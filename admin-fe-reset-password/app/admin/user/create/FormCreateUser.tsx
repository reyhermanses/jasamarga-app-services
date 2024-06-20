"use client";
import { useForm } from "@mantine/form";
import type { RootState } from "@/app/redux/store";
import {
  TextInput,
  Button,
  Box,
  Container,
  VisuallyHidden,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useStepHelper } from "@/helpers/StepHelper";
import { useSession } from "next-auth/react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import classes from "../../_components/css/Notif.module.css";
const FormCreateUser = () => {
  const { back, go } = useStepHelper();
  const d = useSelector((state: RootState) => state.stepper.datas);
  const { data: session } = useSession();

  const config = {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  };

  useEffect(() => {
    let mapData = d.split(" ");
    form.setValues({ employee_id: mapData[2], username: mapData[3] });
  }, []);

  const form = useForm({
    initialValues: { employee_id: "", username: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      username: (value) =>
        value.length < 2 ? "Username must have at least 2 letters" : null,
    },
  });

  const handleSubmit = async (val: any) => {
    try {
      val.is_login = false;
      val.is_active = true;
      val.created_by = "administrator";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/management/user/create`,
        val,
        config
      );
      go();
    } catch (error: any) {
      // console.log(error);
      notifications.show({
        color: "#C92A2A",
        title: "Response",
        message: `${error.response.data.data}`,
        classNames: classes,
      });
    }
  };

  return (
    <div>
      <Container
        style={{
          background: "#F1F3F5",
          borderRadius: 5,
          color: "#Nfff",
          padding: 15,
        }}
        my="md"
      >
        <Box mx="auto">
          <form onSubmit={form.onSubmit((v: any) => handleSubmit(v))}>
            <VisuallyHidden>
              <TextInput
                label="Employee ID"
                hidden={true}
                placeholder="Employee ID"
                {...form.getInputProps("employee_id")}
              />
            </VisuallyHidden>
            <TextInput
              disabled={true}
              mt="sm"
              label="Username"
              placeholder="Username"
              {...form.getInputProps("username")}
            />
            <Button variant="default" onClick={back}>
              Back
            </Button>
            <Button type="submit" mt="sm">
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default FormCreateUser;
