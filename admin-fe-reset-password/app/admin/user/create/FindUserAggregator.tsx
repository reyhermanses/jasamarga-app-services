import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Select,
  Skeleton,
} from "@mantine/core";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  dataStepper,
  nextStep,
  previousStep,
  setActive,
} from "@/app/redux/features/stepperSlice";

import { useStepHelper } from "@/helpers/StepHelper";

export const FindUserAggregator = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { back, go } = useStepHelper();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-users?is_pusat=true`
        );
        if (response.data.data.length > 0) {
          setOptions(
            response.data.data.map(
              (data: any, index: number) =>
                `${index + 1} - ${data.employee_id} ${data.username} ${
                  data.name
                }`
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const get = () => {
    if (!value) return;
    dispatch(dataStepper(value));
    go();
  };

  return (
    <Container
      style={{
        background: "#F1F3F5",
        borderRadius: 5,
        color: "#Nfff",
        padding: 15,
      }}
      my="md"
    >
      <Flex p={20} justify={"space-between"} align={"end"}>
        <Box w={400} style={{ padding: 20 }}>
          <Skeleton visible={loading}>
            <Select
              description="Pencarian data npp karyawan"
              label="Search NPP"
              placeholder="Pick NPP"
              data={options}
              limit={5}
              value={value}
              onChange={setValue}
              styles={{
                description: { color: "#696969" }, // Set the color of the description text using styles prop
              }}
              searchable
            />
          </Skeleton>
        </Box>
        <Group mt="xl">
          <Button variant="default" onClick={back}>
            Back
          </Button>
          <Button onClick={get}>Next</Button>
        </Group>
      </Flex>
    </Container>
  );
};
