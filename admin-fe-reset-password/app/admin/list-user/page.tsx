"use client";

import React, { useEffect, useState } from "react";
import TableDemo from "../_components/TableDemo";
import {
  Box,
  Center,
  Container,
  Loader,
  Pagination,
  Table,
  TextInput,
  rem,
} from "@mantine/core";
import axios from "axios";
import { IconSearch } from "@tabler/icons-react";
import GlobalTableRows from "./GlobalTableRows";
import { useSession } from "next-auth/react";
import { fetchData } from "next-auth/client/_utils";
import { UserController } from "./controller/UserController";

const ListUserAuth = () => {
  const [initValues, setInit] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);
  const [headerValue, setHeader] = useState<any[]>([]);
  const [sliceData, setSliceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchvalues, setSearch] = useState("");
  const limit = 5;

  const { data: session } = useSession();

  const elementsHeader = {
    no: "No",
    name: "Nama Karyawan",
    companyName: "Nama Company",
    kdComp: "KD Comp",
    username: "Username",
    default: "Default Password",
    action: "Action",
  };

  const header = (
    <Table.Tr key="12345">
      <Table.Th>{elementsHeader.no}</Table.Th>
      <Table.Th>{elementsHeader.name}</Table.Th>
      <Table.Th>{elementsHeader.companyName}</Table.Th>
      <Table.Th>{elementsHeader.kdComp}</Table.Th>
      <Table.Th>{elementsHeader.username}</Table.Th>
      <Table.Th>{elementsHeader.default}</Table.Th>
      <Table.Th>{elementsHeader.action}</Table.Th>
    </Table.Tr>
  );

  const fetchData = async () => {
    // const data:any = UserController.getAll(session?.user.accessToken);

    // if(data.data.length > 0){
    //   setInit()
    // }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );

      if (response.data.data.length > 0) {
        setInit(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // if (mounted) {
      setLoading(false);
      // }
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleSearching = () => {
      const query = searchvalues.toUpperCase();
      const find = initValues.filter((user) => {
        return (
          user.company_name.includes(query) ||
          user.username.includes(query) ||
          user.kd_comp.includes(query) ||
          user.name.includes(query)
        );
      });

      if (find && find.length > 0) {
        return setUser(
          find.map((element: any, index: number) => (
            <GlobalTableRows
              key={index}
              index={index}
              element={element}
              session={session}
              setInit={setInit}
            />
          ))
        );
      }
    };

    if (searchvalues.length > 0) {
      setPage(1);
      handleSearching();
    } else {
      fetchData();
    }

    setHeader([header]);

    return () => {
      mounted = false;
    };
  }, [searchvalues, fetchData]);

  useEffect(() => {
    setUser(
      initValues.map((element: any, index: number) => (
        <GlobalTableRows
          key={index}
          index={index}
          element={element}
          session={session}
          setInit={setInit}
        />
      ))
    );
  }, [initValues]);

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = user.slice(startIndex, endIndex);
    setSliceData(data);
  }, [user, page, limit]);

  return (
    <div>
      <Container
        bg="#096dd9"
        style={{ borderRadius: 5, color: "#fff", padding: 15 }}
        my="md"
      >
        <Box maw={350} style={{ padding: 20 }}>
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
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
        <Container
          bg="#fff"
          style={{ borderRadius: 5, color: "black", padding: 15 }}
          my="md"
        >
          {loading && sliceData.length < 0 ? (
            <Loader color="blue" />
          ) : (
            <TableDemo datas={{ header: headerValue, rowsValue: sliceData }} />
          )}
        </Container>
        <Center>
          <Pagination
            color="#595959"
            value={page}
            onChange={setPage}
            total={Math.ceil(user.length / limit)}
            withEdges
          />
        </Center>
      </Container>
    </div>
  );
};

export default ListUserAuth;
