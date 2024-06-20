"use client";

import React, { Suspense } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useSession } from "next-auth/react";
import { UnAuth } from "@/components/UnAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <section>
      <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
    </section>
  );
}
