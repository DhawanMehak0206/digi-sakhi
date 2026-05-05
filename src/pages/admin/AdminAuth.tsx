import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminAuth, useAdminAuth } from "@/hooks/useAdminAuth";
import Logo from "@/components/site/Logo";

export default function AdminAuth() {
  const navigate = useNavigate();
  const authed = useAdminAuth();
  const [email, setEmail] = useState("admin@hertech.app");
  const [password, setPassword] = useState("admin");

  useEffect(() => { document.title = "Admin Sign in — Hertech"; }, []);
  useEffect(() => { if (authed) navigate("/admin", { replace: true }); }, [authed, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAuth.login(email, password)) {
      toast.success("Signed in");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center container-page bg-surface">
      <div className="w-full max-w-sm bg-card border border-border p-8">
        <div className="mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo credentials are pre-filled. Click sign in to continue.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm" />
          <Button type="submit" className="w-full rounded-none bg-accent hover:bg-accent/90">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
