/**
 * Gesture mapping utilities for ISL (Indian Sign Language) hand landmark classification.
 * Takes 21 MediaPipe/Handpose keypoints and maps them to ISL sign language letters.
 */

export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
}

export interface GestureMatch {
  label: string;
  confidence: number;
}

// Finger indices in the 21-point hand landmark model
export const FINGER_TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
export const FINGER_MIDS = { thumb: 3, index: 7, middle: 11, ring: 15, pinky: 19 };
export const FINGER_BASES = { thumb: 2, index: 5, middle: 9, ring: 13, pinky: 17 };
export const WRIST = 0;

/**
 * Compute Euclidean distance between two 3D points.
 */
export function distance3D(a: number[], b: number[]): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow((a[2] || 0) - (b[2] || 0), 2)
  );
}

/**
 * Normalize landmarks relative to wrist position and hand scale.
 */
export function normalizeLandmarks(landmarks: number[][]): number[][] {
  const wrist = landmarks[WRIST];
  const middleBase = landmarks[FINGER_BASES.middle];
  const scale = distance3D(wrist, middleBase) || 1;

  return landmarks.map(pt => [
    (pt[0] - wrist[0]) / scale,
    (pt[1] - wrist[1]) / scale,
    ((pt[2] || 0) - (wrist[2] || 0)) / scale,
  ]);
}

/**
 * Determine if a finger is extended based on normalized landmarks.
 * Returns true if the fingertip is further from the wrist than the base.
 */
export function isFingerExtended(
  normalized: number[][],
  tipIdx: number,
  baseIdx: number,
  threshold = 0.5
): boolean {
  const tip = normalized[tipIdx];
  const base = normalized[baseIdx];
  const wrist = normalized[WRIST];
  const tipDist = distance3D(tip, wrist);
  const baseDist = distance3D(base, wrist);
  return tipDist > baseDist + threshold;
}

/**
 * Check if thumb is extended (uses horizontal distance for thumb).
 */
export function isThumbExtended(normalized: number[][]): boolean {
  const tip = normalized[FINGER_TIPS.thumb];
  const base = normalized[FINGER_BASES.thumb];
  return Math.abs(tip[0] - base[0]) > 0.4;
}

/**
 * Get finger extension state as a 5-bit pattern [thumb, index, middle, ring, pinky].
 */
export function getFingerPattern(landmarks: number[][]): boolean[] {
  const norm = normalizeLandmarks(landmarks);
  return [
    isThumbExtended(norm),
    isFingerExtended(norm, FINGER_TIPS.index, FINGER_BASES.index),
    isFingerExtended(norm, FINGER_TIPS.middle, FINGER_BASES.middle),
    isFingerExtended(norm, FINGER_TIPS.ring, FINGER_BASES.ring),
    isFingerExtended(norm, FINGER_TIPS.pinky, FINGER_BASES.pinky),
  ];
}

/**
 * ISL (Indian Sign Language) letter definitions based on finger extension patterns.
 * ISL uses a one-handed alphabet with distinct hand shapes for each letter.
 * Patterns: [thumb, index, middle, ring, pinky]
 *
 * ISL hand shape descriptions:
 * A – Closed fist, thumb resting on the side (all fingers curled)
 * B – All four fingers extended upward, thumb tucked in (flat hand)
 * C – All fingers and thumb curved into a C shape
 * D – Index finger pointing up, other fingers curled, thumb touches middle finger
 * E – All fingers bent/curled at knuckles, thumb tucked under
 * F – Index and thumb form a circle (OK shape), other three fingers extended
 * G – Index finger and thumb extended horizontally (pointing sideways)
 * H – Index and middle fingers extended together horizontally
 * I – Only pinky finger extended upward
 * J – Pinky extended, trace a J motion (same static shape as I)
 */
const ISL_PATTERNS: Array<{ label: string; pattern: boolean[]; confidence: number }> = [
  { label: 'A', pattern: [false, false, false, false, false], confidence: 0.80 },
  { label: 'B', pattern: [false, true,  true,  true,  true ], confidence: 0.85 },
  { label: 'C', pattern: [true,  false, false, false, false], confidence: 0.68 },
  { label: 'D', pattern: [false, true,  false, false, false], confidence: 0.85 },
  { label: 'E', pattern: [false, false, false, false, false], confidence: 0.62 },
  { label: 'F', pattern: [true,  false, true,  true,  true ], confidence: 0.72 },
  { label: 'G', pattern: [true,  true,  false, false, false], confidence: 0.78 },
  { label: 'H', pattern: [false, true,  true,  false, false], confidence: 0.78 },
  { label: 'I', pattern: [false, false, false, false, true ], confidence: 0.88 },
  { label: 'J', pattern: [false, false, false, false, true ], confidence: 0.75 },
  { label: 'K', pattern: [true,  true,  true,  false, false], confidence: 0.72 },
  { label: 'L', pattern: [true,  true,  false, false, false], confidence: 0.82 },
  { label: 'M', pattern: [false, false, false, false, false], confidence: 0.58 },
  { label: 'N', pattern: [false, false, false, false, false], confidence: 0.58 },
  { label: 'O', pattern: [false, false, false, false, false], confidence: 0.62 },
  { label: 'P', pattern: [true,  true,  true,  false, false], confidence: 0.68 },
  { label: 'R', pattern: [false, true,  true,  false, false], confidence: 0.72 },
  { label: 'S', pattern: [false, false, false, false, false], confidence: 0.68 },
  { label: 'T', pattern: [true,  false, false, false, false], confidence: 0.68 },
  { label: 'U', pattern: [false, true,  true,  false, false], confidence: 0.74 },
  { label: 'V', pattern: [false, true,  true,  false, false], confidence: 0.82 },
  { label: 'W', pattern: [false, true,  true,  true,  false], confidence: 0.82 },
  { label: 'X', pattern: [false, true,  false, false, false], confidence: 0.68 },
  { label: 'Y', pattern: [true,  false, false, false, true ], confidence: 0.88 },
  { label: 'Z', pattern: [false, true,  false, false, false], confidence: 0.65 },
];

/**
 * Count matching bits between two boolean arrays.
 */
function patternSimilarity(a: boolean[], b: boolean[]): number {
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / Math.max(a.length, b.length);
}

/**
 * Map hand landmarks to the closest ISL (Indian Sign Language) gesture label.
 * Returns the best matching ISL sign label and confidence score.
 */
export function recognizeISLGesture(landmarks: number[][]): GestureMatch {
  if (!landmarks || landmarks.length < 21) {
    return { label: 'Unknown', confidence: 0 };
  }

  const detectedPattern = getFingerPattern(landmarks);
  let bestMatch = ISL_PATTERNS[0];
  let bestScore = 0;

  for (const entry of ISL_PATTERNS) {
    const score = patternSimilarity(detectedPattern, entry.pattern);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return {
    label: bestMatch.label,
    confidence: bestScore * bestMatch.confidence,
  };
}

/**
 * Draw hand landmarks on a canvas overlay.
 */
export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: number[][],
  color = '#00e5cc',
  dotRadius = 4
): void {
  // Connections between landmarks (MediaPipe hand skeleton)
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],       // Index
    [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
    [0, 13], [13, 14], [14, 15], [15, 16], // Ring
    [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [5, 9], [9, 13], [13, 17],             // Palm
  ];

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.fillStyle = color;

  // Draw connections
  for (const [a, b] of connections) {
    if (landmarks[a] && landmarks[b]) {
      ctx.beginPath();
      ctx.moveTo(landmarks[a][0], landmarks[a][1]);
      ctx.lineTo(landmarks[b][0], landmarks[b][1]);
      ctx.stroke();
    }
  }

  // Draw dots
  for (const pt of landmarks) {
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], dotRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
