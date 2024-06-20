"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox, Group, Space, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import classes from "../_components/css/Notif.module.css";
import { useDisclosure } from "@mantine/hooks";
import FormChangePassword from "../change-password/FormChangePassword";
import FormResetPassword from "../reset-password/FormResetPassword";

// import { CheckboxIcon } from "@mantine/core/lib/components/Checkbox/CheckIcon";

interface IfcGlobalRow {
  index: number;
  element: any;
  session: any;
  setInit?: any;
}

const GlobalTableRows: React.FC<IfcGlobalRow> = ({
  index,
  element,
  session,
  setInit,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [feature, setFeature] = useState<string | null>(null);
  const handleChange = async (index: number, empId: string, npp: string) => {
    open();
    setTitle("Change Password");
    setFeature("change");
    let data: any = index + " " + "-" + " " + empId + " " + npp;
    setValue(data);
  };
  const handleReset = async (index: number, empId: string, npp: string) => {
    open();
    setTitle("Reset Password");
    setFeature("reset");
    let data: any = index + " " + "-" + " " + empId + " " + npp;
    setValue(data);
  };
  const [defaultPassword, setDefaultPassword] = useState<boolean | null>(false);

  useEffect(() => {
    setDefaultPassword(element.default_password ? true : false);
  }, []);

  // setDefaultPassword(element.default_password ? true : false);

  const handleCheck = async (id: number, val: any, dp: boolean, sess: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${sess.user.accessToken}`,
      },
    };
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/password/default/${val.target.value}`,
        null,
        config
      );
      if (response.data.status) {
        setDefaultPassword(!dp);
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={title}>
        {feature === "change" && value && (
          <FormChangePassword employee_id={value} />
        )}
        {feature === "reset" && value && (
          <FormResetPassword employee_id={value} />
        )}
      </Modal>

      <Table.Tr key={element.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.company_name}</Table.Td>
        <Table.Td>{element.kd_comp}</Table.Td>
        <Table.Td>
          {element.username}
          {element.default_password ? "true" : "false"}
        </Table.Td>
        <Table.Td>
          <Checkbox
            style={{ textAlign: "center" }}
            key={element.id}
            // icon={CheckboxIcon}
            checked={defaultPassword ? true : false}
            value={element.employee_id}
            onChange={(e) =>
              handleCheck(element.id, e, defaultPassword!, session)
            }
          />
        </Table.Td>
        <Table.Td>
          <div style={{ display: "flex" }}>
            <Button
              onClick={() =>
                handleChange(index + 1, element.employee_id, element.username)
              }
            >
              Change
            </Button>
            <Space w="xs" />
            <Button
              onClick={() =>
                handleReset(index + 1, element.employee_id, element.username)
              }
            >
              Reset
            </Button>
          </div>
        </Table.Td>
      </Table.Tr>
    </>
  );
};

export default GlobalTableRows;
