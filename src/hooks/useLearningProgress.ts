import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  listUserQuizProgress,
  listUserVideoProgress,
  upsertUserQuizProgress,
  upsertUserVideoProgress,
} from "@/lib/supabaseApi";
import { emptyLearningProgress, type LearningProgress } from "@/lib/learningProgress";

const guestKey = "digisakhi_guest_progress";
const legacyGuestKey = "hertech_guest_progress";

function loadGuestProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(guestKey) || localStorage.getItem(legacyGuestKey);
    if (!raw) return emptyLearningProgress();
    const parsed = JSON.parse(raw);
    return {
      completedVideoIds: Array.isArray(parsed.completedVideoIds) ? parsed.completedVideoIds : [],
      passedQuizIds: Array.isArray(parsed.passedQuizIds) ? parsed.passedQuizIds : [],
    };
  } catch {
    return emptyLearningProgress();
  }
}

function saveGuestProgress(progress: LearningProgress) {
  localStorage.setItem(guestKey, JSON.stringify(progress));
  localStorage.removeItem(legacyGuestKey);
}

function mergeUnique(values: string[], next: string) {
  return values.includes(next) ? values : [...values, next];
}

export function useLearningProgress() {
  const { session } = useAuth();
  const userId = session?.user.id || null;
  const queryClient = useQueryClient();
  const [guestProgress, setGuestProgress] = useState<LearningProgress>(() => loadGuestProgress());
  const [serverProgress, setServerProgress] = useState<LearningProgress>(emptyLearningProgress());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setServerProgress(emptyLearningProgress());
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    Promise.all([listUserVideoProgress(userId), listUserQuizProgress(userId)])
      .then(([videos, quizzes]) => {
        if (!active) return;
        const next = {
          completedVideoIds: videos.map((entry) => entry.video_id),
          passedQuizIds: quizzes.map((entry) => entry.quiz_id),
        };
        setServerProgress(next);
        queryClient.setQueryData(["learning-progress", userId], next);
      })
      .catch(() => {
        if (!active) return;
        setServerProgress(emptyLearningProgress());
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryClient, userId]);

  useEffect(() => {
    if (!userId || loading) return;
    if (!guestProgress.completedVideoIds.length && !guestProgress.passedQuizIds.length) return;

    const current = serverProgress;
    const merged = {
      completedVideoIds: Array.from(new Set([...current.completedVideoIds, ...guestProgress.completedVideoIds])),
      passedQuizIds: Array.from(new Set([...current.passedQuizIds, ...guestProgress.passedQuizIds])),
    };

    if (
      merged.completedVideoIds.length === current.completedVideoIds.length &&
      merged.passedQuizIds.length === current.passedQuizIds.length
    ) {
      return;
    }

    setServerProgress(merged);
    queryClient.setQueryData(["learning-progress", userId], merged);

    Promise.all([
      ...guestProgress.completedVideoIds.map((videoId) => upsertUserVideoProgress(userId, videoId)),
      ...guestProgress.passedQuizIds.map((quizId) => upsertUserQuizProgress(userId, quizId)),
    ]).finally(() => {
      setGuestProgress(emptyLearningProgress());
      saveGuestProgress(emptyLearningProgress());
    });
  }, [guestProgress, loading, queryClient, serverProgress, userId]);

  const progress = useMemo<LearningProgress>(
    () => (userId ? serverProgress : guestProgress),
    [guestProgress, serverProgress, userId],
  );

  const markVideoCompleted = async (videoId: string) => {
    if (userId) {
      await upsertUserVideoProgress(userId, videoId);
      setServerProgress((current) => {
        const next = { ...current, completedVideoIds: mergeUnique(current.completedVideoIds, videoId) };
        queryClient.setQueryData(["learning-progress", userId], next);
        return next;
      });
      return;
    }

    setGuestProgress((current) => {
      const next = { ...current, completedVideoIds: mergeUnique(current.completedVideoIds, videoId) };
      saveGuestProgress(next);
      return next;
    });
  };

  const markQuizPassed = async (quizId: string) => {
    if (userId) {
      await upsertUserQuizProgress(userId, quizId);
      setServerProgress((current) => {
        const next = { ...current, passedQuizIds: mergeUnique(current.passedQuizIds, quizId) };
        queryClient.setQueryData(["learning-progress", userId], next);
        return next;
      });
      return;
    }

    setGuestProgress((current) => {
      const next = { ...current, passedQuizIds: mergeUnique(current.passedQuizIds, quizId) };
      saveGuestProgress(next);
      return next;
    });
  };

  return {
    progress,
    isLoading: loading,
    isSignedIn: !!userId,
    markVideoCompleted,
    markQuizPassed,
  };
}
