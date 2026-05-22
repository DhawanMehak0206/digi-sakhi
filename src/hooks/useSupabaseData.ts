import { useQuery } from "@tanstack/react-query";
import {
  listBlogs,
  listCategories,
  listCourses,
  listQuestionSets,
  listQuizzes,
  listVideos,
  getBlogBySlug,
  getCourse,
  getVideo,
  getQuiz,
} from "@/lib/supabaseApi";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: listCategories });
}

export function useVideos() {
  return useQuery({ queryKey: ["videos"], queryFn: listVideos });
}

export function useVideo(id?: string) {
  return useQuery({ queryKey: ["videos", id], queryFn: () => getVideo(id!), enabled: !!id });
}

export function useBlogs() {
  return useQuery({ queryKey: ["blogs"], queryFn: listBlogs });
}

export function useBlogBySlug(slug?: string) {
  return useQuery({ queryKey: ["blogs", "slug", slug], queryFn: () => getBlogBySlug(slug!), enabled: !!slug });
}

export function useCourses() {
  return useQuery({ queryKey: ["courses"], queryFn: listCourses });
}

export function useCourse(id?: string) {
  return useQuery({ queryKey: ["courses", id], queryFn: () => getCourse(id!), enabled: !!id });
}

export function useQuizzes() {
  return useQuery({ queryKey: ["quizzes"], queryFn: listQuizzes });
}

export function useQuiz(id?: string) {
  return useQuery({ queryKey: ["quizzes", id], queryFn: () => getQuiz(id!), enabled: !!id });
}

export function useQuestionSets() {
  return useQuery({ queryKey: ["question_sets"], queryFn: listQuestionSets });
}

