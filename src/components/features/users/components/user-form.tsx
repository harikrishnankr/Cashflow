"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User, UpdateUserDto } from "@/types/user.types";

interface UserFormProps {
  user?: User;
  onSubmit: (data: UpdateUserDto) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ name });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full name"
        type="text"
        placeholder="Jane Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : user ? "Save changes" : "Create user"}
        </Button>
      </div>
    </form>
  );
}
