"use client";

import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function Admin() {
  const { data: session } = useSession();

  return (
    <Container
      bg="#096dd9"
      style={{ borderRadius: 5, color: "#fff", padding: 15 }}
      my="md"
    >
      <p>Welcome, {session?.user && session?.user.personName}</p>
    </Container>
  );
}
