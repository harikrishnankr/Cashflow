import { useState } from "react";
import { Input } from "@/components/ui";
import { EyeIcon } from "@/components/ui/icons";
import { getStrength } from "../register.utils";

const STRENGTH_COLORS: Record<number, string> = {
  1: "var(--negative)",
  2: "var(--orange)",
  3: "var(--positive)",
  4: "var(--positive)",
};

interface PasswordInputProps {
  value: string;
  onChange: (v: string) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function PasswordInput({
  value,
  onChange,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = getStrength(value);

  return (
    <div className="flex flex-col gap-0">
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="At least 8 characters"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        required
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        trail={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="p-1 cursor-pointer"
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />
      {value && (
        <>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="flex-1 h-0.75 rounded-sm transition-colors"
                style={{
                  background:
                    i <= strength.score
                      ? STRENGTH_COLORS[strength.score]
                      : "var(--paper-3)",
                }}
              />
            ))}
          </div>
          <p
            className="text-[0.6875rem] mt-1.5 tracking-[0.05em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
          >
            Strength:{" "}
            <strong style={{ color: STRENGTH_COLORS[strength.score] }}>
              {strength.label}
            </strong>
          </p>
        </>
      )}
    </div>
  );
}
