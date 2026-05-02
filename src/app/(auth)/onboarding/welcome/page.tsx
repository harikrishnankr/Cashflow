"use client";

import { Button } from "@/components/ui";
import { redirect } from "next/navigation";

export default function WelcomePage() {
  return <>
    Welcome
    <Button onClick={() => redirect("/onboarding/currency-and-locale")}>Next</Button>
  </>;
}
