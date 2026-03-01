import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useEffect, useState } from 'react';
import type { LessonProgress } from '../backend';

function getOrCreateSessionKey(): string {
  const stored = localStorage.getItem('silentlearn_session');
  if (stored) return stored;
  const key = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  localStorage.setItem('silentlearn_session', key);
  return key;
}

export function useSessionKey() {
  const [sessionKey] = useState(() => getOrCreateSessionKey());
  return sessionKey;
}

export function useAllProgress() {
  const { actor, isFetching } = useActor();
  const sessionKey = useSessionKey();

  return useQuery<LessonProgress[]>({
    queryKey: ['allProgress', sessionKey],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProgress(sessionKey);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLessonProgress(lessonId: string) {
  const { actor, isFetching } = useActor();
  const sessionKey = useSessionKey();

  return useQuery<LessonProgress | null>({
    queryKey: ['lessonProgress', sessionKey, lessonId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getLessonProgress(sessionKey, lessonId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!lessonId,
  });
}

export function useStartLesson() {
  const { actor } = useActor();
  const sessionKey = useSessionKey();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not ready');
      try {
        const isStarted = await actor.isStarted(sessionKey, lessonId);
        if (!isStarted) {
          await actor.startLesson(sessionKey, lessonId);
        }
      } catch {
        // Lesson may already be started, ignore
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
    },
  });
}

export function useUpdateScore() {
  const { actor } = useActor();
  const sessionKey = useSessionKey();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, score }: { lessonId: string; score: number }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateScore(sessionKey, lessonId, BigInt(score));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
    },
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const sessionKey = useSessionKey();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not ready');
      try {
        await actor.completeLesson(sessionKey, lessonId);
      } catch {
        // May already be completed
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
    },
  });
}
