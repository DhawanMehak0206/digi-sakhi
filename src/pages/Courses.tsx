import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/useSupabaseData";

export default function Courses() {
  const { data: courses = [], isLoading } = useCourses();
  useEffect(() => {
    document.title = "Courses — Hertech";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-wider text-accent">Courses</div>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold">Learn in a guided path</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Courses are made of ordered videos. Some videos may be locked until you complete the previous lesson and pass a quiz.
        </p>
      </header>

      {isLoading ? (
        <div className="bg-card border border-border p-6 text-sm text-muted-foreground">Loading…</div>
      ) : courses.length === 0 ? (
        <div className="bg-card border border-border p-6 text-sm text-muted-foreground">
          No courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c.id} className="bg-card border border-border p-5 flex flex-col">
              <div className="font-bold text-lg">{c.title}</div>
              {c.description && <div className="mt-2 text-sm text-muted-foreground">{c.description}</div>}
              <div className="mt-3 text-xs text-muted-foreground">
                {(c.course_items || []).length} video{(c.course_items || []).length === 1 ? "" : "s"}
              </div>
              <div className="mt-5">
                <Link to={`/courses/${c.id}`}>
                  <Button className="rounded-none bg-accent hover:bg-accent/90 w-full">Start course</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
