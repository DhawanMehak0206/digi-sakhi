import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCourses, useQuizzes, useVideos } from "@/hooks/useSupabaseData";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { buildCourseProgress } from "@/lib/learningProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AccountPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: courses = [] } = useCourses();
  const { data: videos = [] } = useVideos();
  const { data: quizzes = [] } = useQuizzes();
  const { progress, isLoading } = useLearningProgress();

  useEffect(() => {
    document.title = "My Account — Hertech";
  }, []);

  const courseSummaries = useMemo(
    () =>
      courses.map((course) => {
        const courseVideos = (course.course_items || []).map((item) => videos.find((video) => video.id === item.video_id) || null).filter(Boolean);
        const summary = buildCourseProgress(
          (course.course_items || []).map((item) => ({ video_id: item.video_id, locked: !!item.locked })),
          courseVideos as any,
          progress,
        );
        return { course, summary };
      }),
    [courses, progress, videos],
  );

  const completedVideos = useMemo(
    () => videos.filter((video) => progress.completedVideoIds.includes(video.id)),
    [progress.completedVideoIds, videos],
  );

  const passedQuizzes = useMemo(
    () => quizzes.filter((quiz: any) => progress.passedQuizIds.includes(quiz.id)),
    [progress.passedQuizIds, quizzes],
  );

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Sign out failed");
      return;
    }
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  if (!session) {
    return (
      <div className="container-page py-16">
        <div className="max-w-xl bg-card border border-border p-8">
          <h1 className="text-2xl font-bold">Your progress</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in or create an account to sync completed videos, passed quizzes, and unlocked course content.
          </p>
          <div className="mt-6 flex gap-3">
            <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={() => navigate("/auth", { state: { from: "/account", mode: "signin" } })}>
              Sign in
            </Button>
            <Button variant="outline" className="rounded-none" onClick={() => navigate("/auth", { state: { from: "/account", mode: "signup" } })}>
              Sign up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-accent">Account</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold">My learning progress</h1>
          <p className="mt-2 text-muted-foreground">{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none text-destructive" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="bg-card border border-border p-6 text-sm text-muted-foreground">Loading progress…</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <Stat label="Completed videos" value={progress.completedVideoIds.length} />
            <Stat label="Passed quizzes" value={progress.passedQuizIds.length} />
            <Stat label="Unlocked lessons" value={courseSummaries.reduce((sum, item) => sum + item.summary.unlockedCount, 0)} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="bg-card border border-border p-5">
              <h2 className="font-bold">Completed videos</h2>
              <div className="mt-4 space-y-3">
                {completedVideos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed videos yet.</p>
                ) : (
                  completedVideos.map((video) => (
                    <div key={video.id} className="flex items-start justify-between gap-3 border border-border bg-background p-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{video.title}</div>
                        <div className="text-xs text-muted-foreground truncate">Completed and saved to your account</div>
                      </div>
                      <Link to={`/videos/${video.id}`} className="text-xs text-accent hover:underline">
                        Open
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card border border-border p-5">
              <h2 className="font-bold">Passed quizzes</h2>
              <div className="mt-4 space-y-3">
                {passedQuizzes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No quizzes passed yet.</p>
                ) : (
                  passedQuizzes.map((quiz: any) => (
                    <div key={quiz.id} className="border border-border bg-background p-3">
                      <div className="font-medium">{quiz.title}</div>
                      {quiz.description && <div className="mt-1 text-sm text-muted-foreground">{quiz.description}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Courses and unlocks</h2>
            <div className="grid gap-4">
              {courseSummaries.map(({ course, summary }) => (
                <div key={course.id} className="bg-card border border-border p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-bold text-lg">{course.title}</div>
                      {course.description && <div className="mt-1 text-sm text-muted-foreground">{course.description}</div>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {summary.completedCount}/{summary.totalCount} completed
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {summary.lessons.map((lesson, index) => (
                      <div key={lesson.video_id} className={`flex items-center justify-between gap-3 border p-3 ${lesson.unlocked ? "bg-background border-border" : "bg-secondary/40 border-border/70"}`}>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">Lesson {index + 1}</div>
                          <div className="font-medium truncate">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {lesson.locked ? "Locked lesson" : "Open lesson"} {lesson.completed ? "• Completed" : lesson.unlocked ? "• Unlocked" : "• Locked"}
                          </div>
                        </div>
                        <Link to={`/courses/${course.id}`} className="text-xs text-accent hover:underline">
                          Open course
                        </Link>
                      </div>
                    ))}
                  </div>

                  {summary.nextLockedTitle && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      Next locked lesson: {summary.nextLockedTitle}
                    </div>
                  )}
                  {summary.courseCompleted && (
                    <div className="mt-3 text-sm text-accent font-medium">
                      Course completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
