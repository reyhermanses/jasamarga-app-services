"use client";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Box,
  Container,
  PasswordInput,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import classes from "../_components/css/Notif.module.css";
import { Notification } from "@mantine/core";
import { useSession } from "next-auth/react";

interface UserData {
  employee_id: string;
}

const FormChangePassword: React.FC<UserData> = ({ employee_id }) => {
  const [isSuccess, setSuccess] = useState(false);
  const [postData, setPostData] = useState({});
  const { data: session } = useSession();

  const config = {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  };

  const form = useForm({
    initialValues: { npp: "", password: "", passwordConfirmation: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      npp: (value: string) => (value ? null : "Npp can't be empty"),
      password: (value: string) => (value ? null : "Password can't be empty"),
      passwordConfirmation: (value, values) =>
        value === values.password ? null : "Password did not match",
    },
  });

  useEffect(() => {
    let mapData = employee_id.split(" ");
    form.setValues({ npp: mapData[3] });
  }, [employee_id]);

  const handlingSubmit = async (val: any) => {
    try {
      let mapData = employee_id.split(" ");
      const sendData = {
        employee_id: mapData[2],
        password: val.password,
        passwordConfirmation: val.passwordConfirmation,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/password/change`,
        sendData,
        config
      );

      if (response.data.status) {
        notifications.show({
          color: "#228BE6",
          title: "Response",
          message: `${response.data.data}`,
          classNames: classes,
        });
      }
    } catch (error: any) {
      console.log("error: " + error);
      notifications.show({
        color: "#C92A2A",
        title: "Response",
        message: `${error.response.data.data}`,
        classNames: classes,
      });
    }
  };

  return (
    <Container bg="#fff" style={{ borderRadius: 5, color: "#262626" }}>
      <Box maw={340} mx="auto" style={{ padding: 10 }}>
        <form onSubmit={form.onSubmit((values: any) => handlingSubmit(values))}>
          <TextInput
            label="Npp"
            placeholder="Npp"
            {...form.getInputProps("npp")}
            disabled={true}
          />
          <PasswordInput
            mt="sm"
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            mt="sm"
            label="Password Confirmation"
            placeholder="Password Confirmation"
            {...form.getInputProps("passwordConfirmation")}
          />
          <Button type="submit" mt="sm">
            Change
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default FormChangePassword;
