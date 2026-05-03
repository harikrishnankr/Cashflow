import {
  MobileHeader,
  MobileNav,
  Sidebar,
  Topbar,
} from "@/components/layout/dashboard-layout";
import { Footer } from "@/components/layout/footer";

const PLACEHOLDER_USER = {
  name: "Jamie Doe",
  email: "jamie@example.com",
  initials: "JD",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-(--paper)">
      <Sidebar user={PLACEHOLDER_USER} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileHeader initials={PLACEHOLDER_USER.initials} />
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
        <Footer />
      </div>

      <MobileNav />
    </div>
  );
}
