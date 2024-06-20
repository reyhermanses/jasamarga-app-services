"use client";

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Center,
  Box,
} from "@mantine/core";
import React from "react";
import { SignInResponse, signIn } from "next-auth/react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import classes from "../../admin/_components/css/Notif.module.css";
import { useRouter } from "next/navigation";

type Props = {
  callBackUrl?: string;
  error?: string;
};

export default function Login(props: any) {
  const router = useRouter();
  const handleSubmit = async (v: any) => {
    // const response = (await signIn("credentials", {
    //   username: v.username,
    //   password: v.password,
    //   redirect: false,
    // })) as SignInResponse;
    let response = {status: 200, error: '2kk2'}


    if (response.status === 401) {
      return notifications.show({
        color: "#C92A2A",
        title: "Response",
        message: `${response.error}`,
        classNames: classes,
      });
    }

    if (response.status === 500) {
      return notifications.show({
        color: "#C92A2A",
        title: "Response",
        message: `${response.error}`,
        classNames: classes,
      });
    }

    if (response.status === 200) {
      notifications.show({
        color: "#20C997",
        title: "Response",
        message: `Successfully signed in`,
        classNames: classes,
      });

      router.push("/admin");
    }
  };

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.length > 0 ? null : "Username cannot be empty",
      password: (value) =>
        value.length > 0 ? null : "Password cannot be empty",
    },
  });

  return (
    <Container size={420} my={40}>
      <Title>Welcome back!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {!!props.error && (
          <Center p={5}>
            <Box bg="#C92A2A" p={5} style={{ borderRadius: 5, color: "#fff" }}>
              Un Authenticated user
            </Box>
          </Center>
        )}

        <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
          <TextInput
            label="Username"
            placeholder="Your Username"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            mt="md"
          />
          {/* <Group mt="lg">
            <Checkbox label="Remember me" />
            <Anchor<"a">
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group> */}
          {/* <Button fullWidth mt="xl" onClick={(e) => handleSubmit(e)}> */}
          <Button type="submit" fullWidth mt="xl">
            Login
            {/* <Link href="/pages/admin/list-user-auth">Sign in</Link> */}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
