import { api } from "@/lib/axios";
import { User } from "@/types/user";

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");

  return response.data;
};

export const createWorkspace = async (name: string) => {
  const response = await api.post("/workspaces", {
    name,
  });

  return response.data;
};
export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<User[]> => {
  const res = await api.get<User[]>(
    `/workspaces/${workspaceId}/members`
  );

  return res.data;
};

export const inviteUser = async (
  workspaceId: string,
  email: string
) => {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/invite`,
    { email }
  );

  return data;
};

export const getWorkspaceUsers = async (workspaceId: string) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/users`);
  return res.json();
};