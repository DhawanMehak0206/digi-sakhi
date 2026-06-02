import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createComment, listComments, type CommentRow } from "@/lib/supabaseApi";
import { MessageCircle, Reply, User } from "lucide-react";

type CommentNode = CommentRow & { replies: CommentNode[] };

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

function buildTree(rows: CommentRow[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  rows.forEach((row) => nodes.set(row.id, { ...row, replies: [] }));

  rows.forEach((row) => {
    const node = nodes.get(row.id);
    if (!node) return;
    if (row.parent_id) {
      const parent = nodes.get(row.parent_id);
      if (parent) {
        parent.replies.push(node);
        return;
      }
    }
    roots.push(node);
  });

  return roots;
}

export default function Comments({ videoId }: { videoId: string }) {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => listComments(videoId),
    enabled: !!videoId,
  });

  const comments = useMemo(() => buildTree(rows), [rows]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: { parent_id: string | null; author_name: string; body: string }) =>
      createComment({
        video_id: videoId,
        parent_id: payload.parent_id,
        author_name: payload.author_name,
        body: payload.body,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });

  const submitRoot = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    mutation.mutate({
      parent_id: null,
      author_name: name.trim() || "Guest",
      body,
    });
    setText("");
    setName("");
  };

  const submitReply = (parentId: string, authorName: string, body: string) => {
    mutation.mutate({
      parent_id: parentId,
      author_name: authorName.trim() || "Guest",
      body: body.trim(),
    });
  };

  const total = useMemo(() => {
    const walk = (nodes: CommentNode[]): number =>
      nodes.reduce((count, node) => count + 1 + walk(node.replies), 0);
    return walk(comments);
  }, [comments]);

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
        <MessageCircle className="h-5 w-5" /> {total} Comments
      </h2>

      <form onSubmit={submitRoot} className="bg-card border border-border p-4 mb-8">
        <div className="grid sm:grid-cols-[1fr_2fr] gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-10 px-3 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            className="px-3 py-2 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90" disabled={mutation.isPending || !text.trim()}>
            Post comment
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading comments…</div>
      ) : (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Be the first to comment.</p>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} c={comment} onReply={submitReply} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

function CommentItem({
  c,
  onReply,
  depth = 0,
}: {
  c: CommentNode;
  onReply: (parentId: string, authorName: string, body: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    onReply(c.id, name, body);
    setText("");
    setName("");
    setOpen(false);
  };

  return (
    <div className={depth > 0 ? "pl-4 border-l-2 border-border" : ""}>
      <div className="flex gap-3">
        <div className="h-9 w-9 bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm">{c.author_name}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90 whitespace-pre-line">{c.body}</p>
          <button
            onClick={() => setOpen(!open)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
          >
            <Reply className="h-3 w-3" /> Reply
          </button>

          {open && (
            <form onSubmit={submit} className="mt-3 bg-secondary/50 border border-border p-3 space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-9 px-3 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Reply to ${c.author_name}…`}
                rows={2}
                className="w-full px-3 py-2 bg-background border border-border rounded-none text-sm focus:outline-none focus:border-accent"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-none bg-accent hover:bg-accent/90">
                  Reply
                </Button>
              </div>
            </form>
          )}

          {c.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {c.replies.map((reply) => (
                <CommentItem key={reply.id} c={reply} onReply={onReply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
