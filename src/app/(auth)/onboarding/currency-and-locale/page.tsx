"use client";

import { Button } from "@/components/ui";
import { redirect } from "next/navigation";

export default function CurrencyAndLocalePage() {
  return (
    <>
      Currency and Locale
      <Button onClick={() => redirect("/onboarding/welcome")}>Back</Button>
      <Button onClick={() => redirect("/onboarding/income-sources")}>Next</Button>
    </>
  );
}
