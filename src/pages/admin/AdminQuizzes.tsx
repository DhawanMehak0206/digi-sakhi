import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, PlusCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/site/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuestionSets, useQuizzes } from "@/hooks/useSupabaseData";
import {
  deleteQuestionSet,
  deleteQuiz,
  parseJsonArray,
  replaceQuizQuestionSets,
  upsertQuestionSet,
  upsertQuiz,
} from "@/lib/supabaseApi";

type QuizQuestionType = "single" | "multiple";
type QuizOption = { id: string; text: string; is_correct: boolean };
type QuizQuestion = { id: string; type: QuizQuestionType; text: string; options: QuizOption[] };
type QuestionSet = { id: string; title: string; description: string; questions: QuizQuestion[]; created_at: string };
type Quiz = { id: string; title: string; description: string; published: boolean; question_set_ids: string[]; created_at: string };

const inp =
  "w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm";

const newId = () => Math.random().toString(36).slice(2, 10);

type Mode =
  | { view: "quizzes" }
  | { view: "sets" }
  | { view: "edit_quiz"; id?: string }
  | { view: "edit_set"; id?: string };

const emptyQuiz: Omit<Quiz, "id" | "created_at"> = {
  title: "",
  description: "",
  question_set_ids: [],
  published: false,
};

const emptySet: Omit<QuestionSet, "id" | "created_at"> = {
  title: "",
  description: "",
  questions: [],
};

export default function AdminQuizzes() {
  const { data: quizzesRaw = [] } = useQuizzes();
  const { data: questionSetsRaw = [] } = useQuestionSets();
  const { saveSetMutation, saveQuizMutation, deleteQuizMutation, deleteSetMutation } = useAdminQuizzesMutations();

  const [mode, setMode] = useState<Mode>({ view: "quizzes" });
  const [delQuizId, setDelQuizId] = useState<string | null>(null);
  const [delSetId, setDelSetId] = useState<string | null>(null);

  const [editingQuiz, setEditingQuiz] = useState<(Partial<Quiz> & Omit<Quiz, "id" | "created_at">) | null>(
    null,
  );
  const [editingSet, setEditingSet] = useState<(Partial<QuestionSet> & { questions: QuizQuestion[] }) | null>(
    null,
  );

  const questionSets: QuestionSet[] = useMemo(
    () =>
      (questionSetsRaw as any[]).map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description || "",
        created_at: s.created_at,
        questions: parseJsonArray<QuizQuestion>(s.questions as any, []).map((q) => ({
          ...q,
          type: (q as any).type || "single",
        })),
      })),
    [questionSetsRaw],
  );

  const quizzes: Quiz[] = useMemo(
    () =>
      (quizzesRaw as any[]).map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description || "",
        published: !!q.published,
        created_at: q.created_at,
        question_set_ids: (q.quiz_question_sets || []).map((x: any) => x.question_set_id),
      })),
    [quizzesRaw],
  );

  const openNewQuiz = () => {
    setEditingQuiz({ ...emptyQuiz });
    setMode({ view: "edit_quiz" });
  };
  const openEditQuiz = (q: Quiz) => {
    setEditingQuiz(JSON.parse(JSON.stringify(q)));
    setMode({ view: "edit_quiz", id: q.id });
  };

  const openNewSet = () => {
    setEditingSet({ ...emptySet, questions: [] });
    setMode({ view: "edit_set" });
  };
  const openEditSet = (s: QuestionSet) => {
    setEditingSet(JSON.parse(JSON.stringify(s)));
    setMode({ view: "edit_set", id: s.id });
  };

  const quizErrors = useMemo(() => {
    if (!editingQuiz) return [];
    const errs: string[] = [];
    if (!editingQuiz.title?.trim()) errs.push("Quiz title is required");
    if (!editingQuiz.question_set_ids?.length) errs.push("Please select at least 1 question set");
    return errs;
  }, [editingQuiz]);

  const setErrors = useMemo(() => {
    if (!editingSet) return [];
    const errs: string[] = [];
    if (!editingSet.title?.trim()) errs.push("Question set title is required");
    if (editingSet.questions.length === 0) errs.push("Add at least 1 question");
    editingSet.questions.forEach((q, idx) => {
      if (!q.text.trim()) errs.push(`Question ${idx + 1} text is required`);
      if (q.options.length < 2) errs.push(`Question ${idx + 1} needs at least 2 options`);
      const optionTexts = q.options.map((o) => o.text.trim()).filter(Boolean);
      if (optionTexts.length !== q.options.length) errs.push(`Question ${idx + 1} has empty options`);
      const correctCount = q.options.filter((o) => o.is_correct).length;
      if (q.type === "multiple") {
        if (correctCount < 1) errs.push(`Question ${idx + 1} needs at least 1 correct option`);
      } else {
        if (correctCount !== 1) errs.push(`Question ${idx + 1} needs exactly 1 correct option`);
      }
    });
    return errs;
  }, [editingSet]);

  const saveQuiz = () => {
    if (!editingQuiz) return;
    if (quizErrors.length) return toast.error(quizErrors[0]);

    saveQuizMutation.mutate(
      {
        id: editingQuiz.id,
        title: editingQuiz.title.trim(),
        description: (editingQuiz.description || "").trim(),
        published: !!editingQuiz.published,
        question_set_ids: editingQuiz.question_set_ids || [],
      },
      {
        onSuccess: () => {
          toast.success("Quiz saved");
          setEditingQuiz(null);
          setMode({ view: "quizzes" });
        },
        onError: (e: any) => toast.error(e.message || "Save failed"),
      },
    );
  };

  const saveSet = () => {
    if (!editingSet) return;
    if (setErrors.length) return toast.error(setErrors[0]);

    saveSetMutation.mutate(
      {
        id: editingSet.id,
        title: editingSet.title.trim(),
        description: (editingSet.description || "").trim(),
        questions: editingSet.questions,
      },
      {
        onSuccess: () => {
          toast.success("Question set saved");
          setEditingSet(null);
          setMode({ view: "sets" });
        },
        onError: (e: any) => toast.error(e.message || "Save failed"),
      },
    );
  };

  const addQuestion = () => {
    if (!editingSet) return;
    const question: QuizQuestion = { id: newId(), type: "single", text: "", options: [] };
    setEditingSet({ ...editingSet, questions: [...editingSet.questions, question] });
  };

  const removeQuestion = (qid: string) => {
    if (!editingSet) return;
    setEditingSet({ ...editingSet, questions: editingSet.questions.filter((q) => q.id !== qid) });
  };

  const setQuestionText = (qid: string, text: string) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) => (q.id === qid ? { ...q, text } : q)),
    });
  };

  const setQuestionType = (qid: string, type: QuizQuestionType) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid ? { ...q, type, options: type === "single" ? ensureSingleCorrect(q.options) : q.options } : q,
      ),
    });
  };

  const addOption = (qid: string) => {
    if (!editingSet) return;
    const opt: QuizOption = { id: newId(), text: "", is_correct: false };
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, opt] } : q,
      ),
    });
  };

  const removeOption = (qid: string, oid: string) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q,
      ),
    });
  };

  const setOptionText = (qid: string, oid: string, text: string) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, text } : o)) }
          : q,
      ),
    });
  };

  const setCorrectOption = (qid: string, oid: string) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => ({ ...o, is_correct: o.id === oid })) }
          : q,
      ),
    });
  };

  const toggleCorrectOption = (qid: string, oid: string) => {
    if (!editingSet) return;
    setEditingSet({
      ...editingSet,
      questions: editingSet.questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, is_correct: !o.is_correct } : o)) }
          : q,
      ),
    });
  };

  const selectedSetTitle = (id: string) => questionSets.find((s) => s.id === id)?.title || "—";
  const quizSetTitles = (ids: string[]) =>
    ids.length ? ids.map((id) => selectedSetTitle(id)).filter(Boolean).join(", ") : "";

  const toggleQuizSet = (setId: string) => {
    if (!editingQuiz) return;
    const current = editingQuiz.question_set_ids || [];
    const next = current.includes(setId) ? current.filter((id) => id !== setId) : [...current, setId];
    setEditingQuiz({ ...editingQuiz, question_set_ids: next });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-sm text-muted-foreground">Create question sets, then attach them to quizzes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={mode.view === "sets" ? "default" : "outline"}
            className="rounded-none"
            onClick={() => {
              setMode({ view: "sets" });
              setEditingQuiz(null);
              setEditingSet(null);
            }}
          >
            <Layers className="h-4 w-4 mr-2" /> Question sets
          </Button>
          <Button
            variant={mode.view === "quizzes" ? "default" : "outline"}
            className="rounded-none"
            onClick={() => {
              setMode({ view: "quizzes" });
              setEditingQuiz(null);
              setEditingSet(null);
            }}
          >
            Quizzes
          </Button>
        </div>
      </div>

      {mode.view === "quizzes" && (
        <div>
          <div className="flex items-center justify-end mb-4">
            <Button onClick={openNewQuiz} className="rounded-none bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> New quiz
            </Button>
          </div>

          <div className="grid gap-3">
            {quizzes.length === 0 && <p className="text-sm text-muted-foreground">No quizzes yet.</p>}
            {quizzes.map((q) => (
              <div key={q.id} className="bg-card border border-border p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{q.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {q.question_set_ids.length
                      ? `Sets: ${quizSetTitles(q.question_set_ids)}`
                      : "No question sets selected"}
                    {q.published ? " • Published" : " • Draft"}
                    {q.description ? ` • ${q.description}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-none" onClick={() => openEditQuiz(q)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none text-destructive"
                    onClick={() => setDelQuizId(q.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode.view === "sets" && (
        <div>
          <div className="flex items-center justify-end mb-4">
            <Button onClick={openNewSet} className="rounded-none bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> New question set
            </Button>
          </div>

          <div className="grid gap-3">
            {questionSets.length === 0 && (
              <p className="text-sm text-muted-foreground">No question sets yet.</p>
            )}
            {questionSets.map((s) => (
              <div key={s.id} className="bg-card border border-border p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{s.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {s.questions.length} question{s.questions.length === 1 ? "" : "s"}
                    {s.description ? ` • ${s.description}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-none" onClick={() => openEditSet(s)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none text-destructive"
                    onClick={() => setDelSetId(s.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(mode.view === "edit_quiz" || mode.view === "edit_set") && (
        <div className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold">
                {mode.view === "edit_quiz"
                  ? editingQuiz?.id
                    ? "Edit quiz"
                    : "New quiz"
                  : editingSet?.id
                    ? "Edit question set"
                    : "New question set"}
              </h2>
              <button
                onClick={() => {
                  setEditingQuiz(null);
                  setEditingSet(null);
                  setMode({ view: "quizzes" });
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {mode.view === "edit_quiz" && editingQuiz && (
              <>
                <div className="p-5 space-y-4">
                  <Field label="Title">
                    <input
                      value={editingQuiz.title || ""}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                      className={inp}
                    />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea
                      rows={3}
                      value={editingQuiz.description || ""}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                      className={inp + " h-auto py-2"}
                    />
                  </Field>
                  <Field label="Question sets">
                    <div className="border border-border bg-background">
                      {questionSets.length === 0 && (
                        <div className="p-3 text-xs text-muted-foreground">Create a question set first.</div>
                      )}
                      {questionSets.length > 0 && (
                        <div className="max-h-56 overflow-y-auto divide-y divide-border">
                          {questionSets.map((s) => {
                            const checked = (editingQuiz.question_set_ids || []).includes(s.id);
                            return (
                              <label key={s.id} className="flex items-center gap-3 p-3 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleQuizSet(s.id)}
                                />
                                <div className="min-w-0">
                                  <div className="font-medium truncate">{s.title}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {s.questions.length} question{s.questions.length === 1 ? "" : "s"}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {(editingQuiz.question_set_ids?.length || 0) > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Selected: {quizSetTitles(editingQuiz.question_set_ids || [])}
                      </div>
                    )}
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!editingQuiz.published}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, published: e.target.checked })}
                    />
                    Published
                  </label>
                </div>
                <div className="p-5 border-t border-border flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none"
                    onClick={() => {
                      setEditingQuiz(null);
                      setMode({ view: "quizzes" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={saveQuiz}>
                    Save quiz
                  </Button>
                </div>
              </>
            )}

            {mode.view === "edit_set" && editingSet && (
              <>
                <div className="p-5 space-y-4">
                  <Field label="Title">
                    <input
                      value={editingSet.title || ""}
                      onChange={(e) => setEditingSet({ ...editingSet, title: e.target.value })}
                      className={inp}
                    />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea
                      rows={3}
                      value={editingSet.description || ""}
                      onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
                      className={inp + " h-auto py-2"}
                    />
                  </Field>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Questions
                    </div>
                    <Button variant="outline" className="rounded-none" onClick={addQuestion}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add question
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editingSet.questions.length === 0 && (
                      <p className="text-sm text-muted-foreground">Add at least one question.</p>
                    )}
                    {editingSet.questions.map((q, qi) => (
                      <div key={q.id} className="border border-border bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">Question {qi + 1}</div>
                            <div className="mt-2">
                              <input
                                value={q.text}
                                onChange={(e) => setQuestionText(q.id, e.target.value)}
                                className={inp}
                                placeholder="Enter your question"
                              />
                            </div>
                            <div className="mt-3">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Question type
                              </label>
                              <div className="mt-1">
                                <select
                                  value={q.type || "single"}
                                  onChange={(e) => setQuestionType(q.id, e.target.value as QuizQuestionType)}
                                  className={inp}
                                >
                                  <option value="single">MCQ (single correct)</option>
                                  <option value="multiple">Multiple correct (checkboxes)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-none text-destructive"
                            onClick={() => removeQuestion(q.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Options ({q.type === "multiple" ? "select all correct" : "select the correct one"})
                          </div>
                          <Button variant="outline" className="rounded-none" onClick={() => addOption(q.id)}>
                            <Plus className="h-4 w-4 mr-2" /> Add option
                          </Button>
                        </div>

                        {q.options.length === 0 && (
                          <p className="mt-2 text-sm text-muted-foreground">Add at least 2 options.</p>
                        )}

                        <div className="mt-2 space-y-2">
                          {q.options.map((o, oi) => (
                            <div key={o.id} className="flex items-center gap-2">
                              {q.type === "multiple" ? (
                                <input
                                  type="checkbox"
                                  checked={o.is_correct}
                                  onChange={() => toggleCorrectOption(q.id, o.id)}
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={o.is_correct}
                                  onChange={() => setCorrectOption(q.id, o.id)}
                                />
                              )}
                              <input
                                value={o.text}
                                onChange={(e) => setOptionText(q.id, o.id, e.target.value)}
                                className={inp}
                                placeholder={`Option ${oi + 1}`}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-none text-destructive"
                                onClick={() => removeOption(q.id, o.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 border-t border-border flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none"
                    onClick={() => {
                      setEditingSet(null);
                      setMode({ view: "sets" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={saveSet}>
                    Save question set
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!delQuizId}
        onOpenChange={(o) => !o && setDelQuizId(null)}
        title="Delete this quiz?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!delQuizId) return;
          deleteQuizMutation.mutate(delQuizId, {
            onSuccess: () => { toast.success("Deleted"); setDelQuizId(null); },
            onError: (e: any) => toast.error(e.message || "Delete failed"),
          });
        }}
      />

      <ConfirmDialog
        open={!!delSetId}
        onOpenChange={(o) => !o && setDelSetId(null)}
        title="Delete this question set?"
        description="Quizzes using it will be detached."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!delSetId) return;
          deleteSetMutation.mutate(delSetId, {
            onSuccess: () => { toast.success("Deleted"); setDelSetId(null); },
            onError: (e: any) => toast.error(e.message || "Delete failed"),
          });
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ensureSingleCorrect(options: QuizOption[]) {
  let found = false;
  return options.map((o) => {
    if (!o.is_correct) return o;
    if (!found) {
      found = true;
      return o;
    }
    return { ...o, is_correct: false };
  });
}

function useAdminQuizzesMutations() {
  const qc = useQueryClient();

  const saveSetMutation = useMutation({
    mutationFn: async (payload: { id?: string; title: string; description: string; questions: QuizQuestion[] }) => {
      const saved = await upsertQuestionSet({
        ...(payload.id ? { id: payload.id } : {}),
        title: payload.title,
        description: payload.description,
        questions: payload.questions as any,
      } as any);
      return saved;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["question_sets"] });
    },
  });

  const saveQuizMutation = useMutation({
    mutationFn: async (payload: { id?: string; title: string; description: string; published: boolean; question_set_ids: string[] }) => {
      const saved = await upsertQuiz({
        ...(payload.id ? { id: payload.id } : {}),
        title: payload.title,
        description: payload.description,
        published: payload.published,
      } as any);
      await replaceQuizQuestionSets(saved.id, payload.question_set_ids);
      return saved;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => deleteQuiz(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  const deleteSetMutation = useMutation({
    mutationFn: async (id: string) => deleteQuestionSet(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["question_sets"] });
      await qc.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  return { saveSetMutation, saveQuizMutation, deleteQuizMutation, deleteSetMutation };
}
