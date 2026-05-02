"use client";

import { Button } from "@/components/ui";
import { redirect } from "next/navigation";

export default function SetupFinishPage() {
  return (
    <>
      Setup Finish
      <Button onClick={() => redirect("/onboarding/income-sources")}>
        Back
      </Button>
    </>
  );
}
