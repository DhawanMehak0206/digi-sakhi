import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Video, FileText, Tag, ArrowLeft } from "lucide-react";
import { adminAuth, useAdminAuth } from "@/hooks/useAdminAuth";
import ConfirmDialog from "@/components/site/ConfirmDialog";
import ThemeToggle from "@/components/site/ThemeToggle";
import Logo from "@/components/site/Logo";

export default function AdminLayout() {
  const authed = useAdminAuth();
  const navigate = useNavigate();
  const [confirmOut, setConfirmOut] = useState(false);

  useEffect(() => { if (!authed) navigate("/admin/auth", { replace: true }); }, [authed, navigate]);
  if (!authed) return null;

  const items = [
    { to: "/admin", label: "Videos", icon: Video, end: true },
    { to: "/admin/blogs", label: "Blogs", icon: FileText },
    { to: "/admin/categories", label: "Categories", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen md:flex md:flex-col border-b md:border-b-0 md:border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/" className="text-sidebar-foreground hover:text-sidebar-primary"><Logo /></Link>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto md:flex-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap ${isActive ? "bg-sidebar-accent text-sidebar-primary" : "hover:bg-sidebar-accent/50"}`}>
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs text-sidebar-foreground/70">Theme</span>
            <ThemeToggle />
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground px-3 py-2">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-none bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setConfirmOut(true)}
          >
            <LogOut className="h-3 w-3 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 bg-surface">
        <div className="p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>

      <ConfirmDialog
        open={confirmOut}
        onOpenChange={setConfirmOut}
        title="Sign out?"
        description="You'll need to sign in again to manage content."
        confirmLabel="Sign out"
        destructive
        onConfirm={() => adminAuth.logout()}
      />
    </div>
  );
}
