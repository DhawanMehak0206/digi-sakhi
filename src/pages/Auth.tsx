import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuth();
  const initialMode = (location.state as any)?.mode === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = useMemo(() => (location.state as any)?.from || "/account", [location.state]);

  useEffect(() => {
    document.title = "Sign in — Digi Sakhi";
  }, []);

  useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [from, navigate, session]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate(from, { replace: true });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: displayName.trim() ? { display_name: displayName.trim() } : undefined,
        },
      });
      if (error) throw error;
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.success("Account created");
        navigate(from, { replace: true });
        return;
      }
      toast.success("Check your email to finish creating the account");
      navigate("/auth", { replace: true, state: { from, mode: "signin" } });
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border p-8">
        <div className="mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save your course progress, unlocked lessons, and quiz wins across devices.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`h-10 border text-sm font-medium ${mode === "signin" ? "bg-accent text-accent-foreground border-accent" : "border-border bg-background"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`h-10 border text-sm font-medium ${mode === "signup" ? "bg-accent text-accent-foreground border-accent" : "border-border bg-background"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm"
          />
          <Button type="submit" className="w-full rounded-none bg-accent hover:bg-accent/90" disabled={submitting}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          By continuing, you can manage progress from the{" "}
          <Link to="/account" className="text-accent hover:underline">account page</Link>.
        </p>
      </div>
    </div>
  );
}
