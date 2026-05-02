"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import {
  PageFooter,
  WelcomePreviewCard,
  WelcomeValueList,
} from "@/components/features/auth";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start">
        <div>
          <span
            className="hidden md:block text-[0.6875rem] uppercase tracking-widest text-(--ink-3) mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Hello, Jamie
          </span>

          <h1
            className="text-[2rem] md:text-[2.5rem] font-normal tracking-tight leading-[1.1] mb-4 text-(--ink)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every dollar,
            <br />
            on the <em className="text-(--orange)">same page.</em>
          </h1>

          <p className="text-[0.9375rem] text-(--ink-3) leading-relaxed mb-6">
            CashFlow turns your spending into a quiet, readable statement — day,
            week, month, year. Here&apos;s what you&apos;ll get from the jump:
          </p>

          {/* Preview card — mobile only (inline in copy flow) */}
          <div className="md:hidden mb-6">
            <WelcomePreviewCard />
          </div>

          <WelcomeValueList className="mb-8" />

          <Button
            onClick={() => router.push("/onboarding/currency-and-locale")}
            fullWidth
            className="md:w-auto"
          >
            Let&apos;s set it up <ArrowRight size={16} />
          </Button>

          <Button
            variant="ghost"
            fullWidth
            className="md:hidden mt-3"
            onClick={() => router.push("/onboarding/setup-finish")}
          >
            Skip for now
          </Button>
        </div>

        <div className="hidden md:block">
          <WelcomePreviewCard />
        </div>
      </div>

      <PageFooter onBack={() => {}} isBackDisabled={true} nextPage="currency" />
    </>
  );
}
