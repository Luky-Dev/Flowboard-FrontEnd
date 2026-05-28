"use client";

import { Workspace } from "@/types/workspace";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  getWorkspaces,
  createWorkspace,
} from "@/services/workspace.service";

export default function DashboardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await getWorkspaces();
      setWorkspaces(data);
    })();
  }, [user]);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;
    await createWorkspace(workspaceName);
    setWorkspaceName("");
    const data = await getWorkspaces();
    setWorkspaces(data);
  };

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 text-gray-500 animate-pulse">
        Loading workspace engine...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-100/40">

      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 border-b border-white/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Flowboard
            </h1>
            <p className="text-xs text-gray-500">
              Welcome back, <span className="text-gray-700">{user.email}</span>
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium
            bg-white/70 backdrop-blur border border-white/40
            hover:bg-red-50 hover:text-red-600 hover:shadow-md
            hover:-translate-y-0.5 active:scale-95 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Create a new workspace
            </h2>

            <div className="flex gap-3">
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Startup, SaaS, Ideas..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-white/40
                focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />

              <button
                onClick={handleCreateWorkspace}
                className="px-6 py-3 rounded-xl text-white font-medium
                bg-gradient-to-r from-indigo-500 to-violet-500
                hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition"
              >
                + Create
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Tip: organiza proyectos, ideas o clientes en espacios separados
            </p>
          </div>

          {/* STATS */}
          <div className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden
            bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent)]" />

            <div className="relative">
              <p className="text-xs text-white/70">Workspaces</p>
              <p className="text-5xl font-bold mt-2">{workspaces.length}</p>
              <p className="text-xs text-white/60 mt-3">
                Active projects
              </p>
            </div>

          </div>

        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => router.push(`/workspace/${workspace.id}`)}
              className="group relative cursor-pointer rounded-3xl p-6
              bg-white/60 backdrop-blur border border-white/40
              hover:-translate-y-2 hover:shadow-2xl transition overflow-hidden"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition
              bg-gradient-to-br from-indigo-50 via-white to-violet-50" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">
                    {workspace.name}
                  </div>
                  <div className="text-indigo-400 group-hover:translate-x-1 transition">
                    →
                  </div>
                </div>

                <div className="text-sm text-gray-400 mt-2">
                  Open workspace
                </div>

                <div className="mt-5 h-1 w-10 bg-indigo-200 rounded-full group-hover:w-24 transition-all" />
              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}