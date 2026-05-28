"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Board } from "@/types/board";
import { Task } from "@/types/task";
import { User } from "@/types/user";

import {
  getBoards,
  getTasks,
  createTask,
  deleteTask,
  update,
  assignUser,
  createBoard,
  unassignUser,
} from "@/services/board.service";

import { getWorkspaceMembers } from "@/services/workspace.service";

type ActiveTask = { taskId: string; boardId: string } | null;

type DragState = {
  task: Task;
  boardId: string;
} | null;

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const workspaceId = params.id as string;

  const [boards, setBoards] = useState<(Board & { tasks?: Task[] })[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [taskTitles, setTaskTitles] = useState<Record<string, string>>({});
  const [activeTask, setActiveTask] = useState<ActiveTask>(null);

  const [boardName, setBoardName] = useState("");
  const [dragging, setDragging] = useState<DragState>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoverColumn, setHoverColumn] = useState<string | null>(null);

  const didInit = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const columns = ["UNASSIGNED", "DOING", "DONE"] as const;

  // ---------------- DATA ----------------
  const refreshData = useCallback(async () => {
    const boardsData = await getBoards(workspaceId);

    const boardsWithTasks = await Promise.all(
      boardsData.map(async (board: Board) => {
        const tasks = await getTasks(board.id);
        return { ...board, tasks };
      })
    );

    setBoards(boardsWithTasks);
  }, [workspaceId]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getWorkspaceMembers(workspaceId);
      const unique = Array.from(new Map(data.map(u => [u.id, u])).values());
      setUsers(unique);
    };

    loadUsers();
  }, [workspaceId]);

  // ---------------- CLICK OUTSIDE MENU ----------------
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------------- DRAG ----------------
  const handleDragStart = (task: Task, boardId: string) => {
    setDragging({ task, boardId });
  };

  const handleDrop = async (boardId: string, column: string) => {
    if (!dragging) return;

    setBoards(prev =>
      prev.map(b =>
        b.id !== boardId
          ? b
          : {
              ...b,
              tasks: (b.tasks ?? []).map(t =>
                t.id === dragging.task.id
                  ? { ...t, column: column as any }
                  : t
              ),
            }
      )
    );

    await update(boardId, dragging.task.id, {
      column: column as any,
    });

    setDragging(null);
    setHoverColumn(null);
    refreshData();
  };

  // ---------------- ACTIONS ----------------
  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;
    await createBoard(workspaceId, boardName.trim());
    setBoardName("");
    refreshData();
  };

  const handleCreateTask = async (boardId: string) => {
    const title = taskTitles[boardId];
    if (!title?.trim()) return;

    await createTask(boardId, title.trim());
    setTaskTitles(p => ({ ...p, [boardId]: "" }));
    refreshData();
  };

  const handleDeleteTask = async (boardId: string, taskId: string) => {
    await deleteTask(boardId, taskId);
    refreshData();
  };

  const handleEditTask = async (boardId: string, task: Task) => {
    const newTitle = prompt("Edit task", task.title);
    if (!newTitle?.trim()) return;

    await update(boardId, task.id, { title: newTitle.trim() });
    refreshData();
  };

  const handleAssignUser = async (boardId: string, taskId: string, userId: string) => {
    await assignUser(boardId, taskId, userId);
    setActiveTask(null);
    refreshData();
  };

  const handleUnassignUser = async (boardId: string, taskId: string, userId: string) => {
    await unassignUser(boardId, taskId, userId);
    setActiveTask(null);
    refreshData();
  };

  // ---------------- UI ----------------
return (
  <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">

    {/* floating background blobs */}
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300/30 blur-3xl rounded-full animate-pulse" />
    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-300/30 blur-3xl rounded-full animate-pulse" />
    <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-blue-200/30 blur-3xl rounded-full animate-pulse" />

    {/* HEADER */}
    <div className="relative flex items-center justify-between mb-10">

      <button
        onClick={() => router.back()}
        className="px-5 py-3 bg-white/70 backdrop-blur-xl border rounded-2xl shadow-sm
        hover:shadow-lg hover:scale-105 active:scale-95 transition"
      >
        ← Back
      </button>

      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Workspace
        </h1>
        <p className="text-gray-500 mt-2">
          Drag & drop con energía visual ✨
        </p>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="px-5 py-3 bg-white/70 backdrop-blur-xl border rounded-2xl shadow-sm
        hover:shadow-lg hover:scale-105 active:scale-95 transition"
      >
        ↑ Top
      </button>

    </div>

    {/* CREATE BOARD */}
    <div className="relative mb-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-5 flex gap-3 border border-white/40">

      <input
        value={boardName}
        onChange={e => setBoardName(e.target.value)}
        placeholder="New board..."
        className="flex-1 text-lg outline-none bg-white/60 px-4 py-3 rounded-2xl border border-white/40 focus:scale-[1.01] transition"
      />

      <button
        onClick={handleCreateBoard}
        className="px-6 py-3 rounded-2xl text-white font-medium
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:scale-105 active:scale-95 transition shadow-lg"
      >
        + Create
      </button>

    </div>

    {/* BOARDS */}
    <div className="relative grid lg:grid-cols-3 gap-8">

      {boards.map(board => (
        <div
          key={board.id}
          className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40
          hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5 relative">

            <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {board.name}
            </h2>

            <button
              onClick={() =>
                setOpenMenu(prev => prev === board.id ? null : board.id)
              }
              className="text-2xl px-3 rounded-xl hover:bg-white/50 transition"
            >
              ⋯
            </button>

            {openMenu === board.id && (
              <div
                ref={menuRef}
                className="absolute right-0 top-12 bg-white/90 backdrop-blur-xl border rounded-2xl shadow-2xl p-2 w-52 z-20"
              >
                <button
                  onClick={() => {
                    const title = prompt("Task title");
                    if (title) createTask(board.id, title).then(refreshData);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-xl transition"
                >
                  + Add task
                </button>

                <button
                  disabled
                  className="w-full text-left px-3 py-2 text-gray-400"
                >
                  Edit board (coming soon)
                </button>
              </div>
            )}
          </div>

          {/* QUICK TASK */}
          <div className="flex gap-2 mb-5">
            <input
              value={taskTitles[board.id] || ""}
              onChange={e =>
                setTaskTitles(p => ({ ...p, [board.id]: e.target.value }))
              }
              placeholder="Quick task..."
              className="flex-1 bg-white/70 px-4 py-3 rounded-2xl border border-white/40"
            />

            <button
              onClick={() => handleCreateTask(board.id)}
              className="px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl
              hover:scale-105 active:scale-95 transition"
            >
              +
            </button>
          </div>

          {/* COLUMNS */}
          {columns.map(column => (
            <div
              key={column}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverColumn(column);
              }}
              onDragLeave={() => setHoverColumn(null)}
              onDrop={() => handleDrop(board.id, column)}
              className={`mb-6 min-h-[140px] p-3 rounded-2xl border transition
              ${
                hoverColumn === column
                  ? "bg-indigo-100/60 border-indigo-300"
                  : "border-dashed border-white/40 bg-white/30"
              }`}
            >

              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                {column}
              </p>

              <div className="space-y-3">

                {(board.tasks ?? [])
                  .filter(t => t.column === column)
                  .map(task => (

                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, board.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`bg-white/80 backdrop-blur-xl p-4 rounded-2xl border shadow-sm
                      transition cursor-grab
                      hover:shadow-xl hover:-translate-y-1
                      ${dragging?.task.id === task.id ? "opacity-40 scale-95" : ""}`}
                    >

                      <div className="font-semibold text-gray-900">
                        {task.title}
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {(task.assignees ?? []).length
                          ? task.assignees.map((a: any) => (
                              <span key={a.user?.id} className="mr-2">
                                {a.user?.name}
                              </span>
                            ))
                          : "Sin asignar"}
                      </div>

                      {/* ACTIONS (FIXED) */}
                      <div className="flex gap-2 mt-3 flex-wrap">

                        <button
                          onClick={() =>
                            setActiveTask(
                              activeTask?.taskId === task.id
                                ? null
                                : { taskId: task.id, boardId: board.id }
                            )
                          }
                          className="px-3 py-1 bg-white/70 rounded-xl hover:scale-105 transition"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => handleEditTask(board.id, task)}
                          className="px-3 py-1 bg-white/70 rounded-xl hover:scale-105 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteTask(board.id, task.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-xl hover:scale-105 transition"
                        >
                          Delete
                        </button>

                      </div>

                      {/* ASSIGN MENU */}
                      {activeTask?.taskId === task.id && (
                        <div className="mt-3 bg-white/90 border rounded-xl p-3 shadow-xl backdrop-blur">

                          {users.map(user => (
                            <div key={user.id} className="flex justify-between text-sm">

                              <button
                                onClick={() =>
                                  handleAssignUser(board.id, task.id, user.id)
                                }
                              >
                                + {user.name}
                              </button>

                              <button
                                onClick={() =>
                                  handleUnassignUser(board.id, task.id, user.id)
                                }
                                className="text-red-500"
                              >
                                x
                              </button>

                            </div>
                          ))}

                        </div>
                      )}

                    </div>
                  ))}

              </div>

            </div>
          ))}

        </div>
      ))}

    </div>

  </main>
);
}