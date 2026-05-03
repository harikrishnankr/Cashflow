import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      aria-label="Notifications"
      className="relative w-8 h-8 rounded-full bg-(--card) border border-(--hairline) flex items-center justify-center text-(--ink-2) cursor-pointer"
    >
      <Bell size={14} />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-(--orange) border border-(--paper)" />
    </button>
  );
}
