import { ReactNode } from "react";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/ui/logo";

interface AuthSplitLayoutProps {
  children: ReactNode;
  headline: ReactNode;
  subCopy?: string;
  eyebrowLabel: string;
  switchLink: { label: string; text: string; href: string };
  decoration?: ReactNode;
  extraContent?: ReactNode;
  footnote?: string[];
}

export function AuthSplitLayout({
  children,
  headline,
  subCopy,
  eyebrowLabel,
  switchLink,
  decoration,
  extraContent,
  footnote = ["v1.0.0", "Bank-grade encryption"],
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      {/* Dark editorial left panel — hidden on mobile */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden
                   px-6 py-8 lg:p-[44px_48px]"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        {/* Brand */}
        <div className="flex items-center">
          <Logo className="h-7 w-auto" />
        </div>

        {/* Preview card */}
        {decoration && (
          <div>{decoration}</div>
        )}

        {/* Pitch */}
        <div className="mt-auto">
          <div
            className="flex items-center gap-2.5 mb-4 text-[11px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(250,247,242,0.55)" }}
          >
            <span className="w-7 h-px" style={{ background: "rgba(250,247,242,0.35)" }} />
            {eyebrowLabel}
          </div>

          <h2
            className="font-normal m-0 leading-[1.04] tracking-[-0.025em] text-[54px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--paper)" }}
          >
            {headline}
          </h2>

          {subCopy && (
            <p
              className="text-sm leading-relaxed max-w-105 mt-5 mb-0"
              style={{ color: "rgba(250,247,242,0.7)" }}
            >
              {subCopy}
            </p>
          )}

          {extraContent && <div>{extraContent}</div>}

          {footnote.length > 0 && (
            <div
              className="mt-9 hidden lg:flex items-center gap-0 text-xs tracking-[0.04em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(250,247,242,0.55)" }}
            >
              {footnote.map((item, i) => (
                <span key={item} className="flex items-center">
                  {item}
                  {i < footnote.length - 1 && (
                    <span
                      className="inline-block w-0.75 h-0.75 rounded-full mx-5"
                      style={{ background: "rgba(250,247,242,0.45)" }}
                    />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col bg-(--paper) px-6 py-5 lg:p-[44px_56px]">
        {/* Mobile-only header: logo mark + name + opposite page link */}
        <div className="flex items-center justify-between lg:hidden mb-5">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6.5 w-6.5" />
            <span
              className="text-[16px] tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CashFlow
            </span>
          </div>
          <Link
            href={switchLink.href}
            className="text-[13px] underline decoration-(--hairline-strong) underline-offset-[3px]"
            style={{ color: "var(--ink)" }}
          >
            {switchLink.text}
          </Link>
        </div>

        {/* Desktop-only switch link */}
        <div className="hidden lg:flex items-center gap-2.5 text-sm text-(--ink-3) justify-end mb-0">
          <span>{switchLink.label}</span>
          <Link
            href={switchLink.href}
            className="text-(--ink) font-medium underline decoration-(--hairline-strong)
                       underline-offset-4 hover:decoration-(--orange)"
          >
            {switchLink.text}
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
