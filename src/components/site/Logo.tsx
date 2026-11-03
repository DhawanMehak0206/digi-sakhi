import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  /** Visual size for navbar vs footer */
  size?: "nav" | "footer" | "lg";
  asLink?: boolean;
};

// ~1.5× previous sizes so the mark stays readable in header/footer
const sizeClasses = {
  nav: "h-[5.25rem] md:h-24",
  footer: "h-[7.5rem] md:h-36",
  lg: "h-36 md:h-[10.5rem]",
} as const;

export default function Logo({ className = "", size = "nav", asLink = false }: LogoProps) {
  const content = (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Digi Sakhi"
        className={`${sizeClasses[size]} w-auto object-contain bg-transparent`}
      />
    </span>
  );

  if (asLink) {
    return <Link to="/" aria-label="Digi Sakhi home">{content}</Link>;
  }

  return content;
}
