import { Badge } from "@/components/ui/badge";
import type { User } from "@/schema/user";

interface UserCardProps {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-(--paper-2) border border-(--hairline) flex items-center justify-center flex-none text-sm font-semibold text-(--ink-2)">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          user.name[0].toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-(--ink) m-0 truncate">{user.name}</p>
        <p className="text-xs text-(--ink-3) m-0 truncate">{user.email}</p>
      </div>

      <div className="flex items-center gap-2 flex-none">
        <Badge variant={user.role === "admin" ? "info" : "default"}>{user.role}</Badge>

        {onEdit && (
          <button onClick={onEdit} className="text-xs text-(--ink-2) hover:text-(--ink) transition-colors cursor-pointer bg-none border-0 p-1">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-xs text-(--negative) hover:text-(--negative) transition-colors cursor-pointer bg-none border-0 p-1">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
