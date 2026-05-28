import { api } from "@/lib/axios";
import { Task } from "@/types/task";



// CREATE BOARD
export const createBoard = async (workspaceId: string, name: string) => {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/boards`,
    { name }
  );

  return data;
};

export const getBoards = async (

  

  workspaceId: string
) => {
  const response = await api.get(
    `/workspaces/${workspaceId}/boards`
  );

  return response.data;




};

export const getTasks = async (boardId: string) => {
  const response = await api.get(`/boards/${boardId}/tasks`);

  console.log("RAW TASKS API:", response.data);

  return response.data;
};

export const createTask = async (
  boardId: string,
  title: string,
  description?: string
) => {
  const response = await api.post(
    `/boards/${boardId}/tasks`,
    {
      title,
      description,
    }
  );

  return response.data;
};

export const deleteTask = async (
  boardId: string,
  taskId: string
) => {
  const res = await api.delete(
    `/boards/${boardId}/tasks/${taskId}`
  );

  return res.data;
};

export const update = async (
  boardId: string,
  taskId: string,
  data: Partial<Task>
) => {
  const res = await api.put(
    `/boards/${boardId}/tasks/${taskId}`,
    data
  );

  return res.data;
};

export const moveTask = async (
  boardId: string,
  taskId: string,
  column: string
) => {
  const res = await api.patch(
    `/boards/${boardId}/tasks/${taskId}/move`,
    { column }
  );

  return res.data;
};

export const assignUser = async (
  boardId: string,
  taskId: string,
  userId: string
) => {
  const res = await api.post(
    `/boards/${boardId}/tasks/${taskId}/assign`,
    { userId }
  );

  return res.data;
};

export const unassignUser = async (
  boardId: string,
  taskId: string,
  userId: string
) => {
  const res = await api.post(
    `/boards/${boardId}/tasks/${taskId}/unassign`,
    { userId }
  );

  return res.data;
};