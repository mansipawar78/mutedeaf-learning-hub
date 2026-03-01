import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type SessionKey = string;
export interface LessonProgress {
    lessonId: string;
    started: boolean;
    completed: boolean;
    score: bigint;
}
export interface backendInterface {
    completeLesson(session: SessionKey, lessonId: string): Promise<void>;
    getAllProgress(session: SessionKey): Promise<Array<LessonProgress>>;
    getAllProgressSortedByScore(session: SessionKey): Promise<Array<LessonProgress>>;
    getLessonProgress(session: SessionKey, lessonId: string): Promise<LessonProgress>;
    isCompleted(session: SessionKey, lessonId: string): Promise<boolean>;
    isStarted(session: SessionKey, lessonId: string): Promise<boolean>;
    resetProgress(session: SessionKey): Promise<void>;
    startLesson(session: SessionKey, lessonId: string): Promise<void>;
    updateScore(session: SessionKey, lessonId: string, score: bigint): Promise<void>;
}
