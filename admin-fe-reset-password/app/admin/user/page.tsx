"use client";

import { Box, Button, Container, Flex, TextInput, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { StepperCreateAccount } from "./create/StepperCreateAccount";
import { useDispatch } from "react-redux";
import { reset } from "@/app/redux/features/stepperSlice";
import FormModal from "@/components/CostumeModal";
import {
  fnChild,
  fnModalOpened,
  fnSize,
  fnTitle,
} from "@/app/redux/features/modalSlice";

const User = async () => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  return (
    <div>
      <FormModal close={close} />
      <Container
        bg="#096dd9"
        style={{ borderRadius: 5, color: "#Nfff", padding: 15 }}
        my="md"
      >
        <Flex p={20} justify={"space-between"} align={"end"}>
          <Box maw={350}>
            <TextInput
              label="Search"
              description="Anda dapat melakukan pencarian data untuk semua kolom"
              placeholder="search"
              styles={{ description: { color: "#bfbfbf" } }}
              rightSection={
                <IconSearch
                  style={{ width: rem(20), height: rem(20) }}
                  color="grey"
                />
              }
            />
          </Box>
          <Button
            color="green"
            onClick={() => {
              dispatch(fnModalOpened(opened));
              dispatch(fnChild(<StepperCreateAccount />));
              dispatch(fnSize("55%"));
              dispatch(fnTitle("Buat Baru Pengguna Admin"));
            }}
          >
            <Box maw={350}>Add</Box>
          </Button>
        </Flex>
      </Container>
    </div>
  );
};

export default User;
