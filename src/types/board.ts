import { Task } from "./task";

export interface Board {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  tasks: Task[];
}