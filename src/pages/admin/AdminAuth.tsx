import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Admin Login — Hertech"; }, []);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate("/admin", { replace: true });
  }, [session, isAdmin, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        const { data: claimed } = await supabase.rpc("claim_admin");
        if (claimed) toast.success("Admin account created. Welcome!");
        else toast.success("Account created. Ask an existing admin to grant access.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-page">
      <div className="w-full max-w-sm bg-card border border-border p-8">
        <h1 className="text-2xl font-bold">Admin {mode === "login" ? "Sign in" : "Sign up"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup" ? "First registered user becomes admin." : "Sign in to manage content."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent" />
          <Button type="submit" disabled={busy} className="w-full rounded-none bg-accent hover:bg-accent/90">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create admin account"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 text-sm text-accent hover:underline w-full text-center">
          {mode === "login" ? "Need to create the first admin? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
