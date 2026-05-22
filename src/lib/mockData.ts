// Frontend-only mock data store. In-memory; resets on reload.
import { slugify } from "./content";

export interface Category { id: string; name: string; slug: string }
export interface Video {
  id: string; title: string; description: string;
  youtube_url: string; thumbnail?: string | null;
  category_id: string | null; tags: string[];
  quiz_id: string | null;
  featured: boolean; trending: boolean; created_at: string;
}
export interface Blog {
  id: string; title: string; slug: string; content: string;
  cover_image?: string | null; tags: string[];
  category_id: string | null; featured: boolean; created_at: string;
}
export interface QuizOption { id: string; text: string; is_correct: boolean }
export type QuizQuestionType = "single" | "multiple";
export interface QuizQuestion { id: string; type: QuizQuestionType; text: string; options: QuizOption[] }
export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  created_at: string;
}
export interface Quiz {
  id: string;
  title: string;
  description: string;
  question_set_ids: string[];
  published: boolean;
  created_at: string;
}
export interface CourseVideoItem {
  video_id: string;
  locked: boolean;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  items: CourseVideoItem[];
  created_at: string;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const categories: Category[] = [
  { id: "c1", name: "AI Basics", slug: "ai-basics" },
  { id: "c2", name: "Tools", slug: "tools" },
  { id: "c3", name: "Career", slug: "career" },
  { id: "c4", name: "Productivity", slug: "productivity" },
  { id: "c5", name: "Coding", slug: "coding" },
];

export const videos: Video[] = [
  {
    id: "v1", title: "What is Generative AI? — A 5-minute primer",
    description: "A beginner-friendly explanation of how generative AI models work, from training to prompting, with real-world examples.",
    youtube_url: "https://www.youtube.com/watch?v=2IK3DFHRFfw",
    thumbnail: null, category_id: "c1", tags: ["ai", "beginners", "explainer"],
    quiz_id: null,
    featured: true, trending: true, created_at: new Date(Date.now() - 1*864e5).toISOString(),
  },
  {
    id: "v2", title: "ChatGPT for Daily Productivity",
    description: "Practical workflows to plan your week, draft emails, and brainstorm ideas using ChatGPT effectively.",
    youtube_url: "https://www.youtube.com/watch?v=jPLG3K9Z6IE",
    thumbnail: null, category_id: "c4", tags: ["chatgpt", "productivity"],
    quiz_id: null,
    featured: true, trending: true, created_at: new Date(Date.now() - 2*864e5).toISOString(),
  },
  {
    id: "v3", title: "Prompt Engineering Essentials",
    description: "Learn the core patterns of writing prompts that get reliable, high-quality outputs from any LLM.",
    youtube_url: "https://www.youtube.com/watch?v=dOxUroR57xs",
    thumbnail: null, category_id: "c1", tags: ["prompting", "ai"],
    quiz_id: null,
    featured: false, trending: true, created_at: new Date(Date.now() - 3*864e5).toISOString(),
  },
  {
    id: "v4", title: "Top 7 AI Tools Every Creator Should Try",
    description: "A curated walkthrough of seven AI tools to speed up writing, design, and research.",
    youtube_url: "https://www.youtube.com/watch?v=NBpVjHe5Wbk",
    thumbnail: null, category_id: "c2", tags: ["tools", "creators"],
    quiz_id: null,
    featured: true, trending: false, created_at: new Date(Date.now() - 4*864e5).toISOString(),
  },
  {
    id: "v5", title: "Breaking Into Tech as a Career Switcher",
    description: "Step-by-step roadmap for women transitioning into tech roles, from learning paths to interviews.",
    youtube_url: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
    thumbnail: null, category_id: "c3", tags: ["career", "switch"],
    quiz_id: null,
    featured: false, trending: true, created_at: new Date(Date.now() - 5*864e5).toISOString(),
  },
  {
    id: "v6", title: "Python for Absolute Beginners",
    description: "Your first hour with Python — variables, loops, and a small project you can actually run.",
    youtube_url: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnail: null, category_id: "c5", tags: ["python", "beginners"],
    quiz_id: null,
    featured: true, trending: false, created_at: new Date(Date.now() - 6*864e5).toISOString(),
  },
  {
    id: "v7", title: "How AI Is Reshaping the Workplace",
    description: "A short documentary on how teams are integrating AI into hiring, design, and operations.",
    youtube_url: "https://www.youtube.com/watch?v=5p248yoa3oE",
    thumbnail: null, category_id: "c1", tags: ["ai", "workplace"],
    quiz_id: null,
    featured: false, trending: true, created_at: new Date(Date.now() - 7*864e5).toISOString(),
  },
  {
    id: "v8", title: "Design Better with Figma + AI",
    description: "Plug AI into your Figma workflow to ideate, iterate, and ship interfaces faster.",
    youtube_url: "https://www.youtube.com/watch?v=FOhSGOMPeEk",
    thumbnail: null, category_id: "c2", tags: ["design", "figma"],
    quiz_id: null,
    featured: false, trending: false, created_at: new Date(Date.now() - 8*864e5).toISOString(),
  },
];

const richBlog = (intro: string) => `
<p class="lead">${intro}</p>
<h2>Why this matters</h2>
<p>The technology landscape is shifting fast. Understanding the fundamentals helps you make better decisions — whether you are picking tools, planning a project, or steering your career.</p>
<h3>Three things to remember</h3>
<ul>
  <li><strong>Start small.</strong> Pick one workflow and improve it.</li>
  <li><strong>Iterate weekly.</strong> Small experiments compound.</li>
  <li><strong>Share your learnings.</strong> Teaching is the fastest way to learn.</li>
</ul>
<blockquote>"The best time to learn was yesterday. The second best is today."</blockquote>
<h2>Where to go next</h2>
<p>Pair this with a hands-on tutorial and one short project. You will be surprised how quickly things click into place.</p>
`;

export const blogs: Blog[] = [
  {
    id: "b1", title: "A Beginner's Guide to Large Language Models",
    slug: "beginners-guide-to-llms",
    content: richBlog("Large Language Models can feel intimidating. They are not. Here is a friendly walkthrough of how they work and how to use them today."),
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    tags: ["ai", "llm", "beginners"], category_id: "c1", featured: true,
    created_at: new Date(Date.now() - 1*864e5).toISOString(),
  },
  {
    id: "b2", title: "10 AI Tools That Will Save You Hours Every Week",
    slug: "ai-tools-save-hours",
    content: richBlog("From inbox triage to slide design, these ten AI tools have quietly become indispensable for our team."),
    cover_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    tags: ["tools", "productivity"], category_id: "c2", featured: true,
    created_at: new Date(Date.now() - 2*864e5).toISOString(),
  },
  {
    id: "b3", title: "From Marketing to Machine Learning: A Career Story",
    slug: "marketing-to-ml-career",
    content: richBlog("How one founder rebuilt her career around ML — and the practical roadmap you can borrow."),
    cover_image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=80",
    tags: ["career", "story"], category_id: "c3", featured: false,
    created_at: new Date(Date.now() - 3*864e5).toISOString(),
  },
  {
    id: "b4", title: "Prompting Like a Pro: Patterns That Actually Work",
    slug: "prompting-patterns",
    content: richBlog("Five reusable prompt patterns we use weekly, with examples you can copy and adapt."),
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    tags: ["prompting", "ai"], category_id: "c1", featured: false,
    created_at: new Date(Date.now() - 4*864e5).toISOString(),
  },
  {
    id: "b5", title: "Building Your First Python Script",
    slug: "first-python-script",
    content: richBlog("No setup overload. Open an editor and let us write something tiny that solves a real problem."),
    cover_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
    tags: ["python", "coding"], category_id: "c5", featured: true,
    created_at: new Date(Date.now() - 5*864e5).toISOString(),
  },
  {
    id: "b6", title: "Designing for Humans in an AI World",
    slug: "designing-for-humans-ai",
    content: richBlog("As AI generates more, our job as designers shifts toward judgement, taste, and craft."),
    cover_image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    tags: ["design", "ai"], category_id: "c2", featured: false,
    created_at: new Date(Date.now() - 6*864e5).toISOString(),
  },
];

// Helpers
export const getCategoryById = (id?: string | null) =>
  id ? categories.find((c) => c.id === id) || null : null;

export const quizzes: Quiz[] = [];
export const questionSets: QuestionSet[] = [];
export const courses: Course[] = [];

export const getQuizById = (id?: string | null) => (id ? quizzes.find((q) => q.id === id) || null : null);
export const getQuestionSetById = (id?: string | null) =>
  id ? questionSets.find((s) => s.id === id) || null : null;
export const getCourseById = (id?: string | null) => (id ? courses.find((c) => c.id === id) || null : null);

// Mutators (admin)
export const addVideo = (v: Omit<Video, "id" | "created_at">) =>
  videos.unshift({ ...v, id: uid(), created_at: new Date().toISOString() });
export const updateVideo = (id: string, patch: Partial<Video>) => {
  const i = videos.findIndex((v) => v.id === id);
  if (i >= 0) videos[i] = { ...videos[i], ...patch };
};
export const deleteVideo = (id: string) => {
  const i = videos.findIndex((v) => v.id === id);
  if (i >= 0) videos.splice(i, 1);
};

export const addBlog = (b: Omit<Blog, "id" | "created_at" | "slug"> & { slug?: string }) => {
  const slug = b.slug?.trim() || slugify(b.title);
  blogs.unshift({ ...b, slug, id: uid(), created_at: new Date().toISOString() });
};
export const updateBlog = (id: string, patch: Partial<Blog>) => {
  const i = blogs.findIndex((b) => b.id === id);
  if (i >= 0) blogs[i] = { ...blogs[i], ...patch };
};
export const deleteBlog = (id: string) => {
  const i = blogs.findIndex((b) => b.id === id);
  if (i >= 0) blogs.splice(i, 1);
};

export const addCategory = (name: string) =>
  categories.push({ id: uid(), name, slug: slugify(name) });
export const deleteCategory = (id: string) => {
  const i = categories.findIndex((c) => c.id === id);
  if (i >= 0) categories.splice(i, 1);
};

export const addQuiz = (q: Omit<Quiz, "id" | "created_at">) =>
  quizzes.unshift({ ...q, id: uid(), created_at: new Date().toISOString() });
export const updateQuiz = (id: string, patch: Partial<Quiz>) => {
  const i = quizzes.findIndex((q) => q.id === id);
  if (i >= 0) quizzes[i] = { ...quizzes[i], ...patch };
};
export const deleteQuiz = (id: string) => {
  const i = quizzes.findIndex((q) => q.id === id);
  if (i >= 0) quizzes.splice(i, 1);
};

export const addQuestionSet = (s: Omit<QuestionSet, "id" | "created_at">) =>
  questionSets.unshift({ ...s, id: uid(), created_at: new Date().toISOString() });
export const updateQuestionSet = (id: string, patch: Partial<QuestionSet>) => {
  const i = questionSets.findIndex((s) => s.id === id);
  if (i >= 0) questionSets[i] = { ...questionSets[i], ...patch };
};
export const deleteQuestionSet = (id: string) => {
  const i = questionSets.findIndex((s) => s.id === id);
  if (i >= 0) questionSets.splice(i, 1);
  // detach from quizzes
  quizzes.forEach((q, idx) => {
    if (q.question_set_ids.includes(id)) {
      quizzes[idx] = { ...q, question_set_ids: q.question_set_ids.filter((sid) => sid !== id) };
    }
  });
};

export const addCourse = (c: Omit<Course, "id" | "created_at">) =>
  courses.unshift({ ...c, id: uid(), created_at: new Date().toISOString() });
export const updateCourse = (id: string, patch: Partial<Course>) => {
  const i = courses.findIndex((c) => c.id === id);
  if (i >= 0) courses[i] = { ...courses[i], ...patch };
};
export const deleteCourse = (id: string) => {
  const i = courses.findIndex((c) => c.id === id);
  if (i >= 0) courses.splice(i, 1);
};
