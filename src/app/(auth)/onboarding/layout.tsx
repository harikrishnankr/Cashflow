import {
  OnboardingLayout,
  OnboardingProvider,
} from "@/components/features/auth";

export default function OnboardingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <OnboardingLayout>{children}</OnboardingLayout>
    </OnboardingProvider>
  );
}
