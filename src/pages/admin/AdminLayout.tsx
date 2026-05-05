import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Video, FileText, Tag, ArrowLeft } from "lucide-react";

export default function AdminLayout() {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) navigate("/admin/auth", { replace: true });
  }, [session, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!session || !isAdmin) return null;

  const items = [
    { to: "/admin", label: "Videos", icon: Video, end: true },
    { to: "/admin/blogs", label: "Blogs", icon: FileText },
    { to: "/admin/categories", label: "Categories", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary">
            <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground font-bold">H</div>
            <span className="font-bold">Hertech Admin</span>
          </Link>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap ${isActive ? "bg-sidebar-accent text-sidebar-primary" : "hover:bg-sidebar-accent/50"}`}>
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 mt-auto md:absolute md:bottom-0 md:w-60 border-t border-sidebar-border space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground px-3 py-2">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <Button variant="outline" size="sm" className="w-full rounded-none bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-3 w-3 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 bg-surface">
        <div className="p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
