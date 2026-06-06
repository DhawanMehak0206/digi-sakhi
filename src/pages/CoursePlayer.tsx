import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Lock, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getYouTubeId } from "@/lib/content";
import { useCourse, useQuestionSets, useQuizzes, useVideos } from "@/hooks/useSupabaseData";
import { parseJsonArray } from "@/lib/supabaseApi";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { buildCourseProgress } from "@/lib/learningProgress";

type QuizQuestionType = "single" | "multiple";
type QuizOption = { id: string; text: string; is_correct: boolean };
type QuizQuestion = { id: string; type: QuizQuestionType; text: string; options: QuizOption[] };
type Quiz = { id: string; title: string; description: string; published: boolean; question_set_ids: string[] };
type QuestionSet = { id: string; title: string; description: string; questions: any };

function flattenQuizQuestions(quiz: Quiz, sets: QuestionSet[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  quiz.question_set_ids.forEach((setId) => {
    const set = sets.find((s) => s.id === setId);
    if (!set) return;
    const parsed = parseJsonArray<QuizQuestion>(set.questions as any, []);
    parsed.forEach((q) => {
      if (!q.id) q.id = `${setId}_${Math.random().toString(36).slice(2, 8)}` as any;
      if (!q.type) (q as any).type = "single";
      questions.push(q);
    });
  });
  return questions;
}

function isQuestionCorrect(q: QuizQuestion, selected: string[]): boolean {
  const correctIds = q.options.filter((o) => o.is_correct).map((o) => o.id).sort();
  const picked = [...selected].sort();
  if (q.type === "multiple") {
    return picked.length === correctIds.length && picked.every((id, i) => id === correctIds[i]);
  }
  return picked.length === 1 && picked[0] === correctIds[0];
}

export default function CoursePlayer() {
  const { id } = useParams();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { data: videos = [] } = useVideos();
  const { data: quizzes = [] } = useQuizzes();
  const { data: questionSets = [] } = useQuestionSets();
  const { progress, markVideoCompleted, markQuizPassed } = useLearningProgress();

  const items = useMemo(
    () =>
      (course?.course_items || []).map((it) => ({
        video_id: it.video_id,
        locked: !!it.locked,
      })),
    [course],
  );
  const courseProgress = useMemo(
    () =>
      buildCourseProgress(
        items,
        videos.map((video) => ({ id: video.id, title: video.title, quiz_id: video.quiz_id })),
        progress,
      ),
    [items, progress, videos],
  );
  const resolved = useMemo(
    () => courseProgress.lessons.map((lesson) => ({
      it: lesson,
      v: videos.find((v) => v.id === lesson.video_id) || null,
    })),
    [courseProgress.lessons, videos],
  );
  const unlocked = useMemo(() => courseProgress.lessons.map((lesson) => lesson.unlocked), [courseProgress.lessons]);

  const firstUnlockedIndex = useMemo(() => unlocked.findIndex(Boolean), [unlocked]);
  const [idx, setIdx] = useState(() => (firstUnlockedIndex >= 0 ? firstUnlockedIndex : 0));
  useEffect(() => { if (firstUnlockedIndex >= 0) setIdx(firstUnlockedIndex); }, [firstUnlockedIndex]);

  const current = resolved[idx]?.v;
  const currentLesson = courseProgress.lessons[idx] || null;
  const currentQuizId = currentLesson?.quiz_id || null;
  const currentQuiz = currentQuizId ? quizzes.find((q: any) => q.id === currentQuizId) || null : null;

  const currentCompleted = !!currentLesson?.completed;
  const currentUnlocked = !!currentLesson?.unlocked;
  const currentQuizPassed = !!(currentQuizId && progress.passedQuizIds.includes(currentQuizId));
  const needsQuizGate = !!(currentQuizId && !currentQuizPassed);

  const canGoNext = useMemo(() => {
    if (idx >= resolved.length - 1) return false;
    if (needsQuizGate) return false;
    return unlocked[idx + 1];
  }, [idx, resolved.length, unlocked, needsQuizGate]);

  const [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    if (currentQuizId && !currentQuizPassed) setQuizOpen(true);
  }, [currentQuizId, currentQuizPassed]);
  useEffect(() => {
    if (!current || !currentUnlocked || currentQuizId || currentCompleted) return;
    void markVideoCompleted(current.id);
  }, [current, currentCompleted, currentQuizId, currentUnlocked, markVideoCompleted]);

  useEffect(() => {
    if (course) document.title = `${course.title} — Digi Sakhi`;
    window.scrollTo(0, 0);
  }, [course]);

  if (courseLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (!course) {
    return (
      <div className="container-page py-20 text-center text-muted-foreground">
        Course not found. <Link to="/courses" className="text-accent">Back to courses</Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container-page py-20 text-center text-muted-foreground">
        Course has no valid videos yet. <Link to="/courses" className="text-accent">Back to courses</Link>
      </div>
    );
  }

  const ytId = getYouTubeId(current.youtube_url);

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-accent">Course</div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold">{(course as any).title}</h1>
        {(course as any).description && <p className="mt-3 text-muted-foreground">{(course as any).description}</p>}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-card border border-border">
            <div className="px-4 py-3 border-b border-border text-sm font-semibold">Lessons</div>
            <div className="divide-y divide-border">
              {resolved.map(({ it, v }, i) => {
                const isUnlocked = unlocked[i];
                const isActive = i === idx;
                const isDone = !!(v && progress.completedVideoIds.includes(v.id));
                return (
                  <button
                    key={it.video_id}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary/40 ${isActive ? "bg-secondary/60" : ""} ${!isUnlocked ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={!isUnlocked}
                    onClick={() => setIdx(i)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{v?.title || "Missing video"}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {it.locked ? "Locked lesson" : "Open lesson"}
                          {v?.quiz_id ? " • Quiz" : ""}
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {!isUnlocked ? <Lock className="h-4 w-4" /> : isDone ? <CheckCircle2 className="h-4 w-4 text-accent" /> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <Link to="/courses" className="text-sm text-accent hover:underline">← Back to courses</Link>
          </div>
        </aside>

        <main className="lg:col-span-3 min-w-0">
          <div className="bg-card border border-border">
            <div className="p-4 border-b border-border">
              <div className="text-xs text-muted-foreground">Lesson {idx + 1} of {resolved.length}</div>
              <div className="font-bold text-lg">{current.title}</div>
            </div>

            <div className="aspect-video bg-primary">
              {ytId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-primary-foreground text-sm">Invalid video URL</div>
              )}
            </div>

            <div className="p-4 space-y-3">
              {current.description && <p className="text-sm text-muted-foreground whitespace-pre-line">{current.description}</p>}

              {currentQuizId && !currentCompleted && (
                <div className="text-sm text-muted-foreground">
                  This lesson has a quiz. Pass it to unlock the next locked video.
                </div>
              )}

              {currentQuizId && currentCompleted && !currentQuizPassed && (
                <div className="text-sm text-muted-foreground">
                  Quiz required: pass it to continue to the next lesson.
                </div>
              )}

              {!currentQuizId && currentCompleted && (
                <div className="text-sm text-accent">
                  Lesson completed automatically.
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" className="rounded-none" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
                  Previous
                </Button>
                <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={() => setIdx(idx + 1)} disabled={!canGoNext}>
                  Next
                </Button>
                {currentQuizId && currentCompleted && !currentQuizPassed && (
                  <Button variant="outline" className="rounded-none" onClick={() => setQuizOpen(true)}>
                    Take quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {quizOpen && currentQuiz && (
        <QuizModal
          quiz={{
            id: (currentQuiz as any).id,
            title: (currentQuiz as any).title,
            description: (currentQuiz as any).description,
            published: !!(currentQuiz as any).published,
            question_set_ids: ((currentQuiz as any).quiz_question_sets || []).map((x: any) => x.question_set_id),
          }}
          questionSets={(questionSets as any) || []}
          onClose={() => setQuizOpen(false)}
          onPassed={async () => {
            if (!currentQuizId) return;
            try {
              await markQuizPassed(currentQuizId);
              if (current) await markVideoCompleted(current.id);
              setQuizOpen(false);
              toast.success("Quiz passed");
            } catch (error: any) {
              toast.error(error.message || "Failed to save quiz result");
            }
          }}
        />
      )}
    </div>
  );
}

function QuizModal({
  quiz,
  questionSets,
  onClose,
  onPassed,
}: {
  quiz: Quiz;
  questionSets: QuestionSet[];
  onClose: () => void;
  onPassed: () => void | Promise<void>;
}) {
  const questions = useMemo(() => flattenQuizQuestions(quiz, questionSets), [quiz, questionSets]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const setSingle = (qid: string, oid: string) => setAnswers((a) => ({ ...a, [qid]: [oid] }));
  const toggleMulti = (qid: string, oid: string) =>
    setAnswers((a) => {
      const cur = a[qid] || [];
      return { ...a, [qid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] };
    });

  const submit = async () => {
    setSubmitting(true);
    try {
      const allCorrect = questions.every((q) => isQuestionCorrect(q, answers[q.id] || []));
      if (!allCorrect) {
        toast.error("Some answers are incorrect. Try again.");
        return;
      }
      await onPassed();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Quiz</div>
            <h2 className="font-bold">{quiz.title}</h2>
          </div>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-6">
          {questions.length === 0 ? (
            <div className="text-sm text-muted-foreground">This quiz has no questions.</div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="border border-border bg-background p-4">
                <div className="font-semibold">Q{idx + 1}. {q.text}</div>
                <div className="mt-3 space-y-2">
                  {q.options.map((o: QuizOption) => {
                    const picked = (answers[q.id] || []).includes(o.id);
                    return (
                      <label key={o.id} className="flex items-center gap-3 text-sm cursor-pointer">
                        {q.type === "multiple" ? (
                          <input type="checkbox" checked={picked} onChange={() => toggleMulti(q.id, o.id)} />
                        ) : (
                          <input type="radio" name={`q-${q.id}`} checked={picked} onChange={() => setSingle(q.id, o.id)} />
                        )}
                        <span>{o.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-2">
          <Button variant="outline" className="rounded-none" onClick={onClose} disabled={submitting}>Close</Button>
          <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={submit} disabled={submitting || questions.length === 0}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
