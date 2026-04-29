import { ReactNode } from "react";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/ui/logo";

interface AuthSplitLayoutProps {
  children: ReactNode;
  headline: ReactNode;
  subCopy: string;
  eyebrowLabel: string;
  switchLink: { label: string; text: string; href: string };
  decoration?: ReactNode;
  footnote?: string[];
}

export function AuthSplitLayout({
  children,
  headline,
  subCopy,
  eyebrowLabel,
  switchLink,
  decoration,
  footnote = ["v1.0.0", "SOC 2 type II", "Bank-grade encryption"],
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div
        className="bg-(--ink) text-(--paper) p-[44px_48px] flex flex-col relative overflow-hidden"
        style={{ color: "var(--paper)" }}
      >
        <div className="flex items-center">
          <Logo className="hidden md:block h-7.5 w-auto" />
          <LogoMark className="md:hidden h-7.5 w-auto" />
        </div>

        {decoration}

        <div className="mt-auto">
          <div className="flex items-center gap-2.5 mb-4.5 font-mono text-[11px] tracking-widest uppercase" style={{ color: "rgba(250,247,242,0.55)" }}>
            <span className="w-7 h-px bg-[rgba(250,247,242,0.35)]" />
            {eyebrowLabel}
          </div>
          <h2
            className="font-normal text-[54px] leading-[1.04] tracking-[-0.025em] m-0"
            style={{ fontFamily: "var(--font-display)", color: "var(--paper)" }}
          >
            {headline}
          </h2>
          <p className="text-sm leading-relaxed max-w-105 mt-5 mb-0" style={{ color: "rgba(250,247,242,0.7)" }}>
            {subCopy}
          </p>

          {footnote.length > 0 && (
            <div className="mt-9 flex items-center gap-5.5 font-mono text-xs tracking-[0.04em]" style={{ color: "rgba(250,247,242,0.55)" }}>
              {footnote.map((item, i) => (
                <span key={item} className="flex items-center gap-5.5">
                  {item}
                  {i < footnote.length - 1 && (
                    <span className="w-0.75 h-0.75 rounded-full bg-[rgba(250,247,242,0.45)]" />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-[44px_56px] flex flex-col bg-(--paper)">
        <div className="flex justify-end items-center gap-2.5 text-sm text-(--ink-3)">
          <span>{switchLink.label}</span>
          <Link
            href={switchLink.href}
            className="text-(--ink) font-medium underline decoration-(--hairline-strong) underline-offset-4 hover:decoration-(--orange)"
          >
            {switchLink.text}
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
