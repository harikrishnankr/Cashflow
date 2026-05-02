"use client";

import { Button } from "@/components/ui";
import { redirect } from "next/navigation";

export default function IncomeSourcesPage() {
  return (
    <>
      Income Sources
      <Button onClick={() => redirect("/onboarding/setup-finish")}>
        Next
      </Button>
    </>
  );
}
