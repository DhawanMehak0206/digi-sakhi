import { useEffect, useState } from "react";
import { Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

export default function Contact() {
  useEffect(() => { document.title = "Contact — Digi Sakhi"; }, []);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error("Please check your entries."); return; }
    toast.success("Thanks! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-page py-12 max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">Have a question, partnership idea, or feedback? We'd love to hear from you.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={submit} className="md:col-span-2 space-y-4 bg-card border border-border p-6">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-none focus:outline-none focus:border-accent" />
          </div>
          <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90">Send message</Button>
        </form>

        <aside className="space-y-4">
          <div className="bg-surface border border-border p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Email</div>
            <a href="mailto:hello@hertech.app" className="flex items-center gap-2 font-medium hover:text-accent">
              <Mail className="h-4 w-4" /> hello@hertech.app
            </a>
          </div>
          <div className="bg-surface border border-border p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Follow</div>
            <div className="flex gap-3">
              <a href="#" className="p-2 border border-border hover:text-accent"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 border border-border hover:text-accent"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="p-2 border border-border hover:text-accent"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
