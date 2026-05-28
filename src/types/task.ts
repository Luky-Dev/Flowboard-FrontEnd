import { UserID } from "@/types/user"

export type TaskColumn = "UNASSIGNED" | "DOING" | "DONE";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  boardId: string;
  column: TaskColumn;
  createdAt: string;
  assignees: UserID[];
}