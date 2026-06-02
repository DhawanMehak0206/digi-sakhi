import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CategoryRow = Tables<"categories">;
export type VideoRow = Tables<"videos">;
export type BlogRow = Tables<"blogs">;
export type CourseRow = Tables<"courses">;
export type CourseItemRow = Tables<"course_items">;
export type CommentRow = Tables<"comments">;
export type UserVideoProgressRow = Tables<"user_video_progress">;
export type UserQuizProgressRow = Tables<"user_quiz_progress">;
export type QuizRow = Tables<"quizzes">;
export type QuestionSetRow = Tables<"question_sets">;
export type QuizQuestionSetRow = Tables<"quiz_question_sets">;

export async function listCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function upsertCategory(category: TablesInsert<"categories"> | (TablesUpdate<"categories"> & { id?: string })) {
  const { data, error } = await supabase.from("categories").upsert(category as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function listVideos() {
  const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getVideo(id: string) {
  const { data, error } = await supabase.from("videos").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertVideo(v: TablesInsert<"videos"> | TablesUpdate<"videos"> & { id?: string }) {
  const { data, error } = await supabase.from("videos").upsert(v as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteVideo(id: string) {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
}

export async function listUserVideoProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_video_progress")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listUserQuizProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_quiz_progress")
    .select("*")
    .eq("user_id", userId)
    .order("passed_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertUserVideoProgress(userId: string, videoId: string) {
  const { data, error } = await supabase
    .from("user_video_progress")
    .upsert({ user_id: userId, video_id: videoId, completed_at: new Date().toISOString() }, { onConflict: "user_id,video_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function upsertUserQuizProgress(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from("user_quiz_progress")
    .upsert({ user_id: userId, quiz_id: quizId, passed_at: new Date().toISOString() }, { onConflict: "user_id,quiz_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listComments(videoId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("video_id", videoId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createComment(comment: TablesInsert<"comments">) {
  const { data, error } = await supabase.from("comments").insert(comment).select("*").single();
  if (error) throw error;
  return data;
}

export async function listBlogs() {
  const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertBlog(b: TablesInsert<"blogs"> | (TablesUpdate<"blogs"> & { id?: string })) {
  const { data, error } = await supabase.from("blogs").upsert(b as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteBlog(id: string) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
}

export type CourseWithItems = CourseRow & { course_items: CourseItemRow[] };

export async function listCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((c) => ({
    ...(c as any),
    course_items: ((c as any).course_items || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)),
  })) as CourseWithItems[];
}

export async function getCourse(id: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const items = ((data as any).course_items || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
  return { ...(data as any), course_items: items } as CourseWithItems;
}

export async function upsertCourse(course: TablesInsert<"courses"> | (TablesUpdate<"courses"> & { id?: string })) {
  const { data, error } = await supabase.from("courses").upsert(course as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function replaceCourseItems(courseId: string, items: Array<{ video_id: string; locked: boolean }>) {
  const { error: delErr } = await supabase.from("course_items").delete().eq("course_id", courseId);
  if (delErr) throw delErr;
  const payload: TablesInsert<"course_items">[] = items.map((it, idx) => ({
    course_id: courseId,
    video_id: it.video_id,
    locked: it.locked,
    position: idx,
  }));
  const { error: insErr } = await supabase.from("course_items").insert(payload);
  if (insErr) throw insErr;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function listQuestionSets() {
  const { data, error } = await supabase.from("question_sets").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertQuestionSet(set: TablesInsert<"question_sets"> | (TablesUpdate<"question_sets"> & { id?: string })) {
  const { data, error } = await supabase.from("question_sets").upsert(set as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteQuestionSet(id: string) {
  const { error } = await supabase.from("question_sets").delete().eq("id", id);
  if (error) throw error;
}

export type QuizWithSets = QuizRow & { quiz_question_sets: QuizQuestionSetRow[] };

export async function listQuizzes() {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, quiz_question_sets(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((q) => ({
    ...(q as any),
    quiz_question_sets: ((q as any).quiz_question_sets || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)),
  })) as QuizWithSets[];
}

export async function getQuiz(id: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, quiz_question_sets(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const sets = ((data as any).quiz_question_sets || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
  return { ...(data as any), quiz_question_sets: sets } as QuizWithSets;
}

export async function upsertQuiz(q: TablesInsert<"quizzes"> | (TablesUpdate<"quizzes"> & { id?: string })) {
  const { data, error } = await supabase.from("quizzes").upsert(q as any).select("*").single();
  if (error) throw error;
  return data;
}

export async function replaceQuizQuestionSets(quizId: string, questionSetIds: string[]) {
  const { error: delErr } = await supabase.from("quiz_question_sets").delete().eq("quiz_id", quizId);
  if (delErr) throw delErr;
  const payload: TablesInsert<"quiz_question_sets">[] = questionSetIds.map((id, idx) => ({
    quiz_id: quizId,
    question_set_id: id,
    position: idx,
  }));
  if (payload.length === 0) return;
  const { error: insErr } = await supabase.from("quiz_question_sets").insert(payload);
  if (insErr) throw insErr;
}

export async function deleteQuiz(id: string) {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) throw error;
}

export function parseJsonArray<T>(v: Json, fallback: T[] = []): T[] {
  return Array.isArray(v) ? (v as any as T[]) : fallback;
}
