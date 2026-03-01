import { useEffect, useRef, useState, useCallback } from 'react';
import { recognizeISLGesture } from '@/utils/gestureMapping';

export type GestureStatus = 'idle' | 'loading' | 'ready' | 'detecting' | 'error';

export interface HandGestureResult {
  label: string | null;
  confidence: number;
  landmarks: number[][] | null;
  status: GestureStatus;
  errorMessage: string | null;
  startRecognition: (videoEl: HTMLVideoElement) => void;
  stopRecognition: () => void;
  isRecognizing: boolean;
}

// Dynamically load TensorFlow.js and Handpose model via CDN
async function loadTFScripts(): Promise<void> {
  if ((window as any).__tfLoaded) return;

  const scripts = [
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/dist/handpose.min.js',
  ];

  for (const src of scripts) {
    await new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.head.appendChild(script);
    });
  }

  (window as any).__tfLoaded = true;
}

export function useHandGestureRecognition(): HandGestureResult {
  const [status, setStatus] = useState<GestureStatus>('idle');
  const [label, setLabel] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const modelRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noHandFramesRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const loadModel = useCallback(async () => {
    if (modelRef.current) return true;
    setStatus('loading');
    try {
      await loadTFScripts();
      const handpose = (window as any).handpose;
      if (!handpose) throw new Error('Handpose model not available');
      modelRef.current = await handpose.load({
        detectionConfidence: 0.8,
        maxContinuousChecks: 10,
      });
      setStatus('ready');
      return true;
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Failed to load ML model. Please check your connection and try again.');
      return false;
    }
  }, []);

  const runInference = useCallback(async () => {
    if (!modelRef.current || !videoRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) return;

    try {
      const predictions = await modelRef.current.estimateHands(video);
      if (predictions && predictions.length > 0) {
        noHandFramesRef.current = 0;
        const hand = predictions[0];
        const lm: number[][] = hand.landmarks;
        setLandmarks(lm);

        // Always use ISL classifier
        const result = recognizeISLGesture(lm);
        setLabel(result.label);
        setConfidence(result.confidence);
      } else {
        noHandFramesRef.current += 1;
        setLandmarks(null);
        if (noHandFramesRef.current >= 3) {
          setLabel(null);
        }
      }
    } catch {
      // Silently ignore inference errors
    }
  }, []);

  const startRecognition = useCallback(async (videoEl: HTMLVideoElement) => {
    videoRef.current = videoEl;
    setIsRecognizing(true);
    setStatus('loading');
    noHandFramesRef.current = 0;

    const loaded = await loadModel();
    if (!loaded) {
      setIsRecognizing(false);
      return;
    }

    setStatus('detecting');
    intervalRef.current = setInterval(runInference, 800);
  }, [loadModel, runInference]);

  const stopRecognition = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecognizing(false);
    setStatus('idle');
    setLabel(null);
    setLandmarks(null);
    noHandFramesRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    label,
    confidence,
    landmarks,
    status,
    errorMessage,
    startRecognition,
    stopRecognition,
    isRecognizing,
  };
}
