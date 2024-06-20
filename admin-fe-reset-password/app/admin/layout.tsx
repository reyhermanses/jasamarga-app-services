"use client";

import React, { Suspense } from "react";
import { MantineProvider } from "@mantine/core";
import NavbarSection from "./_components/NavbarSection";
import "@mantine/core/styles.css";
import { useSession } from "next-auth/react";
import { UnAuth } from "@/components/UnAuth";
import Loading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <section>
      <MantineProvider defaultColorScheme="light">
        <Suspense fallback={<Loading />}>
          {/* {session?.user ? ( */}
            <NavbarSection>{children}</NavbarSection>
          {/* ) : (
            <UnAuth />
          )} */}
        </Suspense>
      </MantineProvider>
    </section>
  );
}
