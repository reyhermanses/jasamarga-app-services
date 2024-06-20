import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./_css/UnAuth.module.css";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/admin/loading";

export function UnAuth() {
  const route = useRouter();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>401</div>
      <Title className={classes.title}>You have to logged in.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, unauthenticated user. You may have to logged in first.
      </Text>
      <Group justify="center">
        <Button variant="subtle" onClick={() => route.push("/")} size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
