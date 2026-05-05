import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
}

const MAX_MB = 5;

export default function ImageUpload({ value, onChange }: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  if (value) {
    return (
      <div className="relative group border border-border bg-secondary">
        <img src={value} alt="cover" className="w-full max-h-64 object-cover" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 bg-background border border-border text-sm hover:border-accent"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-3 py-2 bg-destructive text-destructive-foreground text-sm inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${
        drag ? "border-accent bg-accent-soft" : "border-border bg-secondary/50 hover:border-accent hover:bg-accent-soft"
      }`}
    >
      <div className="h-10 w-10 bg-background border border-border flex items-center justify-center">
        {drag ? <Upload className="h-5 w-5 text-accent" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="text-sm font-medium">
        {drag ? "Drop the image to upload" : "Drag &amp; drop an image, or click to browse"}
      </div>
      <div className="text-xs text-muted-foreground">PNG, JPG, WEBP — up to {MAX_MB}MB</div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </label>
  );
}
