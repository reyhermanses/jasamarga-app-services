"use client";
import React, { useEffect, useState } from "react";
import { Box, Container, Select, Skeleton } from "@mantine/core";
import axios from "axios";
import FormResetPassword from "./FormResetPassword";

const ResetPassword = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-users?is_pusat=false`
        );
        if (response.data.data.length > 0) {
          setOptions(
            response.data.data.map(
              (data: any, index: number) =>
                `${index + 1} - ${data.employee_id} ${data.username}`
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

  return (
    <Container
      bg="#096dd9"
      style={{ borderRadius: 5, color: "#fff", padding: 15 }}
      my="md"
    >
      <Box maw={340} style={{ padding: 20 }}>
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
              description: { color: "#bfbfbf" }, // Set the color of the description text using styles prop
            }}
            searchable
          />
        </Skeleton>
      </Box>
      {value && <FormResetPassword employee_id={value} />}
    </Container>
  );
};

export default ResetPassword;
