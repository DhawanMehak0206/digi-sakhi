import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground font-bold">H</div>
          <span className="text-lg font-bold tracking-tight">Hertech</span>
        </Link>

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

        <Link to="/admin" className="hidden md:block">
          <Button variant="outline" size="sm" className="rounded-none">Admin</Button>
        </Link>

        <button className="md:hidden ml-auto p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            <Link to="/admin" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="outline" size="sm" className="w-full rounded-none">Admin</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
