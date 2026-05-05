import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Reply, User } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  replies: Comment[];
}

const seed = (videoId: string): Comment[] => [
  {
    id: "c1", author: "Aanya", text: "Loved this — the explainer at 2:30 finally made it click for me!",
    createdAt: new Date(Date.now() - 36e5 * 4).toISOString(),
    replies: [
      {
        id: "c1r1", author: "Hertech", text: "So glad it helped, Aanya! 💜",
        createdAt: new Date(Date.now() - 36e5 * 3).toISOString(), replies: [],
      },
    ],
  },
  {
    id: "c2", author: "Priya", text: "Could you do a follow-up on prompt patterns next?",
    createdAt: new Date(Date.now() - 36e5 * 12).toISOString(), replies: [],
  },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export default function Comments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>(() => seed(videoId));
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const addReplyAt = (list: Comment[], parentId: string, reply: Comment): Comment[] =>
    list.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...c.replies, reply] }
        : { ...c, replies: addReplyAt(c.replies, parentId, reply) }
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const c: Comment = {
      id: uid(), author: name.trim() || "Guest", text: text.trim(),
      createdAt: new Date().toISOString(), replies: [],
    };
    setComments([c, ...comments]);
    setText("");
  };

  const reply = (parentId: string, author: string, message: string) => {
    const r: Comment = {
      id: uid(), author: author || "Guest", text: message,
      createdAt: new Date().toISOString(), replies: [],
    };
    setComments(addReplyAt(comments, parentId, r));
  };

  const total = (() => {
    let n = 0;
    const walk = (l: Comment[]) => l.forEach((c) => { n++; walk(c.replies); });
    walk(comments);
    return n;
  })();

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
        <MessageCircle className="h-5 w-5" /> {total} Comments
      </h2>

      <form onSubmit={submit} className="bg-card border border-border p-4 mb-8">
        <div className="grid sm:grid-cols-[1fr_2fr] gap-3">
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-10 px-3 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
          />
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…" rows={2}
            className="px-3 py-2 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90">Post comment</Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((c) => (
          <CommentItem key={c.id} c={c} onReply={reply} />
        ))}
      </div>
    </section>
  );
}

function CommentItem({
  c, onReply, depth = 0,
}: {
  c: Comment; onReply: (parentId: string, author: string, message: string) => void; depth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onReply(c.id, name, text.trim());
    setText(""); setName(""); setOpen(false);
  };

  return (
    <div className={depth > 0 ? "pl-4 border-l-2 border-border" : ""}>
      <div className="flex gap-3">
        <div className="h-9 w-9 bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm">{c.author}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90 whitespace-pre-line">{c.text}</p>
          <button
            onClick={() => setOpen(!open)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
          >
            <Reply className="h-3 w-3" /> Reply
          </button>

          {open && (
            <form onSubmit={submit} className="mt-3 bg-secondary/50 border border-border p-3 space-y-2">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-9 px-3 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
              />
              <textarea
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder={`Reply to ${c.author}…`} rows={2}
                className="w-full px-3 py-2 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="rounded-none bg-accent hover:bg-accent/90">Reply</Button>
              </div>
            </form>
          )}

          {c.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {c.replies.map((r) => (
                <CommentItem key={r.id} c={r} onReply={onReply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
