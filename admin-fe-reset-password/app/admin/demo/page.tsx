"use client";

import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import classes from "../_components/css/Notif.module.css";

export default function Demo() {
  return (
    <Group justify="center">
      <Button
        onClick={() =>
          notifications.show({
            title: "Notification with custom styles",
            message: "It is default blue",
            classNames: classes,
          })
        }
      >
        Default notification
      </Button>

      <Button
        color="red"
        onClick={() =>
          notifications.show({
            color: "red",
            title: "Notification with custom styles",
            message: "It is red",
            classNames: classes,
          })
        }
      >
        Error notification
      </Button>
    </Group>
  );
}
