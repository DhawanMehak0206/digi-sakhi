import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/videos", label: "Videos" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Sign out failed");
      return;
    }
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-accent" : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-sm ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos, blogs..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-secondary border border-border rounded-none focus:outline-none focus:border-accent"
          />
        </form>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link to={session ? "/account" : "/auth"}>
            <Button variant="outline" size="sm" className="rounded-none">
              {session ? "My Progress" : "Sign in / Sign up"}
            </Button>
          </Link>
          {!loading && isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="rounded-none">Admin</Button>
            </Link>
          )}
          {session && (
            <Button variant="outline" size="sm" className="rounded-none" onClick={signOut}>
              Sign out
            </Button>
          )}
        </div>

        <div className="md:hidden ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium ${isActive ? "text-accent" : "text-foreground/80"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <form onSubmit={submit} className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full h-10 pl-9 pr-3 text-sm bg-secondary border border-border rounded-none"
              />
            </form>
            <Link to={session ? "/account" : "/auth"} onClick={() => setOpen(false)} className="mt-2">
              <Button variant="outline" size="sm" className="w-full rounded-none">
                {session ? "My Progress" : "Sign in / Sign up"}
              </Button>
            </Link>
            {!loading && isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="mt-2">
                <Button variant="outline" size="sm" className="w-full rounded-none">Admin</Button>
              </Link>
            )}
            {session && (
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-none mt-2"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
              >
                Sign out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
