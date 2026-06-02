export type LearningProgress = {
  completedVideoIds: string[];
  passedQuizIds: string[];
};

export type CourseLessonState = {
  video_id: string;
  locked: boolean;
  title: string;
  quiz_id: string | null;
  completed: boolean;
  unlocked: boolean;
};

export type CourseProgressSummary = {
  lessons: CourseLessonState[];
  completedCount: number;
  unlockedCount: number;
  totalCount: number;
  courseCompleted: boolean;
  nextLockedTitle: string | null;
};

export function emptyLearningProgress(): LearningProgress {
  return { completedVideoIds: [], passedQuizIds: [] };
}

export function buildCourseProgress(
  courseItems: Array<{ video_id: string; locked: boolean }>,
  videos: Array<{ id: string; title: string; quiz_id?: string | null }>,
  progress: LearningProgress,
): CourseProgressSummary {
  const lessons: CourseLessonState[] = courseItems.map((item, index) => {
    const video = videos.find((entry) => entry.id === item.video_id);
    const completed = !!video && progress.completedVideoIds.includes(video.id);
    let unlocked = index === 0;
    if (index > 0) {
      const previous = courseItems[index - 1];
      const previousVideo = videos.find((entry) => entry.id === previous.video_id);
      const previousDone = !!previousVideo && progress.completedVideoIds.includes(previousVideo.id);
      const previousQuizId = previousVideo?.quiz_id || null;
      const previousQuizPassed = previousQuizId ? progress.passedQuizIds.includes(previousQuizId) : true;
      unlocked = !item.locked || (previousDone && previousQuizPassed);
    }

    return {
      video_id: item.video_id,
      locked: !!item.locked,
      title: video?.title || "Missing video",
      quiz_id: video?.quiz_id || null,
      completed,
      unlocked,
    };
  });

  const completedCount = lessons.filter((lesson) => lesson.completed).length;
  const unlockedCount = lessons.filter((lesson) => lesson.unlocked).length;
  const courseCompleted = lessons.length > 0 && completedCount === lessons.length;
  const nextLockedTitle = lessons.find((lesson) => !lesson.unlocked)?.title || null;

  return {
    lessons,
    completedCount,
    unlockedCount,
    totalCount: lessons.length,
    courseCompleted,
    nextLockedTitle,
  };
}
