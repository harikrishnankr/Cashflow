import { Checkbox } from "@/components/ui";
import Link from "next/link";

export function TermsCheckbox({
  agreed,
  setAgreed,
}: {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  return (
    <Checkbox
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      required
      className="items-start mt-2 text-xs leading-[1.55]"
      label={
        <span style={{ flex: 1 }}>
          I agree to the{" "}
          <Link
            href="/terms"
            className="underline decoration-(--hairline-strong) underline-offset-[0.1875rem]"
            style={{ color: "var(--ink-2)" }}
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline decoration-(--hairline-strong) underline-offset-[0.1875rem]"
            style={{ color: "var(--ink-2)" }}
          >
            Privacy Policy
          </Link>
          .
        </span>
      }
    />
  );
}
