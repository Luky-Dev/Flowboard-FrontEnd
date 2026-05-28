"use client";

import React from "react";
import AppHeader from "./AppHeader";

type Props = {
  title?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export default function WorkspaceLayout({ title, children, rightSlot }: Props) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      <AppHeader title={title} rightSlot={rightSlot} />

      <main className="p-6 md:p-10">
        {children}
      </main>

    </div>
  );
}