import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { User } from "@/schema/user";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <Table
      keyField="id"
      data={users}
      emptyMessage="No users found."
      columns={[
        {
          key: "name",
          header: "Name",
          render: (u) => (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-(--paper-2) border border-(--hairline) flex items-center justify-center text-xs font-semibold text-(--ink-2) flex-none">
                {u.name[0].toUpperCase()}
              </div>
              <span className="font-medium">{u.name}</span>
            </div>
          ),
        },
        { key: "email", header: "Email" },
        {
          key: "role",
          header: "Role",
          render: (u) => <Badge variant={u.role === "admin" ? "info" : "default"}>{u.role}</Badge>,
        },
        {
          key: "createdAt",
          header: "Joined",
          render: (u) => <span className="text-(--ink-3)">{formatDate(u.createdAt)}</span>,
        },
        {
          key: "actions",
          header: "",
          render: (u) => (
            <div className="flex items-center gap-2 justify-end">
              {onEdit && (
                <button onClick={() => onEdit(u)} className="text-xs text-(--ink-2) hover:text-(--ink) cursor-pointer bg-none border-0 p-1">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(u)} className="text-xs text-(--negative) cursor-pointer bg-none border-0 p-1">
                  Delete
                </button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
