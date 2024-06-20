"use client";
import { useForm } from "@mantine/form";
import { TextInput, Button, Box, Container, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import classes from "../_components/css/Notif.module.css";
import { useSession } from "next-auth/react";
// import schema from "./validation/validation";

interface UserData {
  employee_id: string;
}

const FormResetPassword: React.FC<UserData> = ({ employee_id }) => {
  const [token, setToken] = useState("");
  const { data: session } = useSession();

  const form = useForm({
    initialValues: { npp: "", password: "", password_confirmation: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      npp: (value) => (value ? null : "Npp can't be empty"),
    },
  });

  useEffect(() => {
    let mapData: any = employee_id.split(" ");
    form.setValues({ npp: mapData[3] });
  }, [employee_id]);

  const config = {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  };

  const handleReset = async (val: any) => {
    try {
      let mapData = employee_id.split(" ");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/password/reset/${mapData[2]}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      if (response.data.status) {
        setToken(response.data.data);
        notifications.show({
          color: "#228BE6",
          title: "Response",
          message: `${response.data.data}`,
          classNames: classes,
        });
      } else {
        notifications.show({
          color: "#C92A2A",
          title: "Response",
          message: `${response.data.data}`,
          classNames: classes,
        });
      }
    } catch (error: any) {
      console.log(error);
      notifications.show({
        color: "#C92A2A",
        title: "Response",
        message: `${error.response.data.data}`,
        classNames: classes,
      });
    }
  };

  return (
    <Container
      bg="#fff"
      style={{ borderRadius: 5, color: "#262626", width: "100%" }}
    >
      <Box maw={340} mx="auto" style={{ padding: 10 }}>
        <form onSubmit={form.onSubmit((values) => handleReset(values))}>
          <TextInput
            label="Npp"
            placeholder="Npp"
            disabled={true}
            {...form.getInputProps("npp")}
          />
          <Button type="submit" mt="sm">
            Reset
          </Button>
        </form>
      </Box>

      {token && (
        <Container p="15">
          <Container
            p="20"
            style={{
              background: "#12B886",
              width: "50%",
              height: "100",
              borderRadius: 5,
              color: "#fff",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Your Random Password is : {token}
            </Text>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default FormResetPassword;
