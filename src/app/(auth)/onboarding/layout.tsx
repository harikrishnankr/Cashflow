import { OnboardingLayout as OnboardingLayoutWrapper } from "@/components/features/auth";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingLayoutWrapper>{children}</OnboardingLayoutWrapper>;
}
