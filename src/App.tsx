import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Impact from "./pages/Impact";
import AuthPage from "./pages/Auth";
import AccountPage from "./pages/Account";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import NotFound from "./pages/NotFound";
import CoursePlayer from "./pages/CoursePlayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/courses" element={<Navigate to="/videos" replace />} />
            <Route path="/courses/:id" element={<CoursePlayer />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminVideos />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
