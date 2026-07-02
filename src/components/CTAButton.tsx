import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "icon";
  ariaLabel?: string;
};

export function CTAButton({
  children,
  href,
  variant = "primary",
  size = "default",
  className,
  ariaLabel,
  ...props
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 focus:ring-offset-white disabled:pointer-events-none disabled:opacity-50",
    size === "icon" ? "size-9 p-0" : "min-h-11 px-4 py-2 text-sm md:px-5",
    variant === "primary" &&
      "border-black bg-black text-white shadow-[0_14px_40px_rgba(0,0,0,0.16)] hover:border-zinc-800 hover:bg-zinc-800",
    variant === "secondary" &&
      "border-zinc-300 bg-white text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-black hover:bg-zinc-50",
    variant === "ghost" && "border-transparent bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-black",
    className
  );

  if (href) {
    return (
      <a className={classes} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
        {size !== "icon" && <ArrowRight className="size-4" />}
      </a>
    );
  }

  return (
    <button className={classes} aria-label={ariaLabel} {...props}>
      {children}
      {size !== "icon" && variant !== "ghost" && <ArrowRight className="size-4" />}
    </button>
  );
}
