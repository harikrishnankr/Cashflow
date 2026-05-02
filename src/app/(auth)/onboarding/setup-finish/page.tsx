"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Target } from "lucide-react";
import { Button, Logo } from "@/components/ui";
import { useOnboardingData } from "@/components/features/auth/onboarding/onboarding-provider";
import {
  OrderedOnboardingSteps,
  OnboardingStepMap,
} from "@/components/features/auth/onboarding/constants";
import { CURRENCIES } from "@/components/features/auth/onboarding/currency-and-locale/constants";
import { INCOME_SOURCES } from "@/components/features/auth/onboarding/income-sources/constants";

const QUICK_ACTIONS = [
  {
    icon: Plus,
    title: "Add an expense",
    hint: (
      <>
        Press{" "}
        <kbd className="font-mono bg-(--paper-2) border border-(--hairline) rounded px-1 py-px text-[10px] not-italic">
          A
        </kbd>{" "}
        anywhere
      </>
    ),
    href: "#",
  },
  {
    icon: Target,
    title: "Set a monthly budget",
    hint: "Optional · advisory only",
    href: "#",
  },
] as const;

export default function SetupFinishPage() {
  const router = useRouter();
  const { currency, locale, selectedSources, incomeAmounts } =
    useOnboardingData();

  const currencyGlyph =
    CURRENCIES.find((c) => c.value === currency)?.glyph ?? currency;

  const sourceCount = selectedSources.filter((id) => id !== "custom").length;

  const total = INCOME_SOURCES.filter(
    (s) => s.id !== "custom" && selectedSources.includes(s.id),
  ).reduce((sum, s) => {
    const raw = incomeAmounts[s.id]?.replace(/,/g, "") ?? "";
    return sum + (parseFloat(raw) || 0);
  }, 0);

  const totalStr = `${currencyGlyph} ${total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const summaryRows = [
    { label: "Currency", value: `${currency} · ${currencyGlyph}` },
    { label: "Locale", value: locale },
    { label: "Income sources", value: String(sourceCount) },
    { label: "Est. monthly", value: totalStr, highlight: true },
  ];

  return (
    <>
      {/* ── Mobile: full-screen dark overlay ───────────────────────────────── */}
      <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-(--ink) text-(--paper) px-6 pt-5 pb-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(250,247,242,0.55)",
            }}
          >
            04 / 04
          </span>
        </div>

        {/* Pips */}
        <div className="flex gap-1.5 mb-9">
          {OrderedOnboardingSteps.map((step) => (
            <span
              key={step}
              className={`flex-1 h-1 rounded-xs ${
                step === OnboardingStepMap.SetupFinish
                  ? "bg-(--orange)"
                  : "bg-(--paper) opacity-90"
              }`}
            />
          ))}
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-(--orange) flex items-center justify-center shrink-0">
            <Check size={17} strokeWidth={2.5} className="text-white" />
          </div>
          <span
            className="text-[11px] uppercase tracking-widest text-(--orange)"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Setup complete
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-[2.25rem] font-normal leading-[1.05] tracking-[-0.02em] mb-2.5 text-(--paper)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You&apos;re <em className="text-(--orange) not-italic">ready.</em>
        </h1>
        <p
          className="text-[13px] leading-[1.55] mb-6"
          style={{ color: "rgba(250,247,242,0.65)" }}
        >
          Your ledger is live. We&apos;ve pre-populated the month with your
          recurring income.
        </p>

        {/* Summary card */}
        <div
          className="rounded-(--r-md) px-3.5 mb-5"
          style={{
            background: "rgba(250,247,242,0.06)",
            border: "1px solid rgba(250,247,242,0.1)",
          }}
        >
          {summaryRows.map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(250,247,242,0.08)" }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "rgba(250,247,242,0.55)",
                }}
              >
                {label}
              </span>
              <span
                className={`text-xs font-medium ${highlight ? "text-(--orange)" : "text-(--paper)"}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Action links */}
        <div className="flex flex-col gap-2 mb-8">
          {[
            {
              icon: Plus,
              title: "Add your first expense",
              hint: "The main move. Start here.",
              href: "#",
            },
            {
              icon: Target,
              title: "Set a monthly budget",
              hint: "Optional · advisory only.",
              href: "#",
            },
          ].map(({ icon: Icon, title, hint, href }) => (
            <a
              key={title}
              href={href}
              className="flex items-center gap-3 rounded-(--r-md) px-3.5 py-3.5 no-underline"
              style={{
                background: "rgba(250,247,242,0.06)",
                border: "1px solid rgba(250,247,242,0.1)",
                color: "var(--paper)",
              }}
            >
              <div
                className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-(--orange) shrink-0"
                style={{ background: "rgba(250,247,242,0.08)" }}
              >
                <Icon size={15} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-(--paper)">
                  {title}
                </div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "rgba(250,247,242,0.55)" }}
                >
                  {hint}
                </div>
              </div>
              <ArrowRight
                size={16}
                style={{ color: "rgba(250,247,242,0.55)" }}
                className="shrink-0"
              />
            </a>
          ))}
        </div>

        <Button fullWidth onClick={() => router.push("/dashboard")}>
          Open my dashboard <ArrowRight size={16} />
        </Button>
      </div>

      {/* ── Desktop ─────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        {/* Complete card */}
        <div className="bg-(--ink) border border-(--hairline) rounded-(--r-md) p-8 flex gap-10 mt-2">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div
              className="text-[0.625rem] uppercase tracking-widest text-(--orange) mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Welcome aboard
            </div>
            <h2
              className="text-[2rem] font-normal tracking-tight leading-[1.1] mb-3 text-(--paper)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              You&apos;re <em className="text-(--orange)">ready.</em>
            </h2>
            <p className="text-[0.9375rem] text-(--paper) leading-relaxed mb-8 max-w-sm">
              Your CashFlow is configured. Add your first expense in seconds, or
              head straight to the dashboard to get started.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={() => router.push("/dashboard")}>
                Go to dashboard <ArrowRight size={16} />
              </Button>
              <button
                type="button"
                className="text-sm text-(--ink-3) hover:text-(--orange) transition-colors cursor-pointer"
              >
                Add first expense
              </button>
            </div>
          </div>

          {/* Right — summary */}
          <div className="w-52 shrink-0 border-l border-(--hairline) pl-8">
            {summaryRows.map(({ label, value, highlight }) => (
              <div
                key={label}
                className="flex justify-between items-baseline py-2.5 border-b border-(--hairline) last:border-b-0"
              >
                <span
                  className="text-[0.625rem] uppercase tracking-widest text-(--ink-3)"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </span>
                <span
                  className={`text-xs font-medium ${highlight ? "text-(--orange)" : "text-(--paper)"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3.5 mt-10">
          {QUICK_ACTIONS.map(({ icon: Icon, title, hint, href }) => (
            <a
              key={title}
              href={href}
              className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-4.5 block hover:bg-(--paper-2) transition-colors no-underline"
            >
              <div className="w-8.5 h-8.5 rounded-lg bg-(--paper-2) border border-(--hairline) flex items-center justify-center text-(--ink) mb-3">
                <Icon size={17} />
              </div>
              <div className="text-sm font-medium text-(--ink)">{title}</div>
              <div className="text-xs text-(--ink-3) mt-0.5 leading-snug">
                {hint}
              </div>
            </a>
          ))}
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-(--hairline)">
          <button
            type="button"
            onClick={() => router.push("/onboarding/income-sources")}
            className="flex items-center gap-2 text-sm text-(--ink-3) hover:text-(--ink) transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span
            className="text-[0.625rem] uppercase tracking-widest text-(--ink-3)"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            setup · complete
          </span>
        </div>
      </div>
    </>
  );
}
