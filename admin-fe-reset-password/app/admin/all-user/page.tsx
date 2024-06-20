"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine component features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import { useEffect, useMemo, useState } from "react";
import {
  MRT_Row,
  MRT_RowSelectionState,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Checkbox,
  Flex,
  Modal,
  Popover,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash, IconZoomReset } from "@tabler/icons-react";
import FormChangePassword from "../change-password/FormChangePassword";
import { useDisclosure } from "@mantine/hooks";
import FormResetPassword from "../reset-password/FormResetPassword";
import { notifications } from "@mantine/notifications";
import classes from "../_components/css/Notif.module.css";

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  id: string;
  employee_id: string;
  username: string;
  name: string;
  company_name: string;
  company_code: string;
  unit_kerja_name: string;
  default_password: boolean;
};

const GetAllUser = () => {
  const { data: session } = useSession();
  //data and fetching state
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //adding
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [feature, setFeature] = useState<string | null>(null);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [testFilter, setTestFilter] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const fetchData = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    // costume filter start
    const collection: string[] = [];
    let dynamicParams = "";
    let i = 0;
    for (const key in columnFilters) {
      if (i === 0) {
        collection.push(
          `&${columnFilters[key].id}=${columnFilters[key].value}`
        );
      } else {
        collection.push(
          `&${columnFilters[key].id}=${columnFilters[key].value}`
        );
      }
      i++;
    }
    for (let index = 0; index < collection.length; index++) {
      dynamicParams = dynamicParams + collection[index];
    }
    //costum filter end

    //pagination start
    let paginateStart: number = 0;
    if (pagination.pageIndex === 0) {
      paginateStart = 1;
    } else {
      paginateStart = pagination.pageIndex + 1;
    }
    // pagination end

    console.log(session?.user.accessToken)

    try {
      const response: any = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/?page=${paginateStart}&limit=${pagination.pageSize}${dynamicParams}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      const json: any = (await response.data) as UserApiResponse;
      setData(json.data);
      setRowCount(json.totalPages);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // testFilter,
    columnFilters, //refetch when column filters change
    // globalFilter, //refetch when global filter changes
    pagination.pageIndex, //refetch when page index changes
    pagination.pageSize, //refetch when page size changes
    // sorting, //refetch when sorting changes
  ]);

  useEffect(() => {}, [data, rowSelection]);

  const CompResetPassword = ({
    additionalProp,
    typeResetPassword,
  }: {
    additionalProp: number;
    typeResetPassword: boolean;
  }) => {
    const [opened, { close, open }] = useDisclosure(false);
    const [getDp, setDp] = useState<boolean | null>();
    const [statusUpdated, setStatusUpdated] = useState<boolean>(false);

    useEffect(() => {
      setDp(typeResetPassword);
    }, []);

    return (
      <Popover
        width={300}
        trapFocus
        position="left-start"
        withArrow
        shadow="md"
        // onClose={() => setPopoverOpened(true)}
        opened={opened}
      >
        <Popover.Target>
          <Button onClick={open} color={getDp ? "blue" : "red"}>
            {getDp ? "Aktif" : "Tidak Aktif"}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Flex direction={"column"} justify={"start"}>
            <Text>
              Ingin {getDp ? "menonaktifkan" : "mengaktifkan"} default password?
            </Text>
            <Flex direction={"row"} gap={"sm"}>
              <Button
                bg={"blue"}
                onClick={async () => {
                  try {
                    await handleCheck(
                      additionalProp,
                      session,
                      setStatusUpdated
                    ).finally(() => {
                      // if (statusUpdated) {
                      if (getDp !== undefined) {
                        setDp(!getDp);
                      } else {
                        setDp(typeResetPassword);
                      }
                      close();
                      // }
                    });
                  } catch (error) {
                    notifications.show({
                      color: "#C92A2A",
                      title: "Response",
                      message: `Error retrieving information`,
                      classNames: classes,
                    });
                  }
                }}
              >
                Konfirmasi
              </Button>
              <Button onClick={close} bg={"red"}>
                Batal
              </Button>
            </Flex>
          </Flex>
        </Popover.Dropdown>
      </Popover>
    );
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () =>
      [
        {
          accessorKey: "username",
          header: "Username",
          enableColumnFilter: true,
        },
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "company_name",
          header: "Company Name ",
        },
        {
          accessorKey: "company_code",
          header: "KDCOMP",
        },
        {
          accessorKey: "unit_kerja_name",
          header: "Unit Kerja",
        },
        {
          accessorKey: "default_password",
          header: "Active Password",
          enableColumnFilter: false,
          Cell: ({ row }) => {
            const defaultPassword = row.original.default_password;
            const employee_id = parseInt(row.original.employee_id);
            return (
              <>
                <Flex direction={"row"} justify={"center"}>
                  <CompResetPassword
                    additionalProp={employee_id}
                    typeResetPassword={defaultPassword}
                  />
                </Flex>
              </>
            );
          },
        },
      ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

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

  const handleCheck = async (val: number, sess: any, setStatusUpdated: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${sess.user.accessToken}`,
      },
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/password/default/${val}`,
        null,
        config
      );
      if (response.data.status) {
        setStatusUpdated(true);
        notifications.show({
          color: "#228BE6",
          title: "Response",
          message: `${response.data.data}`,
          // classNames: classes,
        });
      } else {
        return new Error("Error Response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowNumbers: true,
    enableEditing: true,
    getRowId: (row) => row.employee_id,
    initialState: { showColumnFilters: true },
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    enableStickyFooter: true,
    manualFiltering: true,
    manualPagination: true,
    enableTopToolbar: false,
    rowCount,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderRowActions: ({ row, table }) => {
      return (
        <Flex gap="md">
          {row.original.company_code !== "JSMR" ? (<>
            <Tooltip label="Change Password">
              {/* <ActionIcon onClick={() => table.setEditingRow(row)}> */}
              <ActionIcon
                onClick={() =>
                  handleChange(
                    row.index + 1,
                    row.original.employee_id,
                    row.original.username
                  )
                }
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reset Password">
            {/* <ActionIcon onClick={() => table.setEditingRow(row)}> */}
            <ActionIcon
              onClick={() =>
                handleReset(
                  row.index + 1,
                  row.original.employee_id,
                  row.original.username
                )
              }
            >
              <IconZoomReset />
            </ActionIcon>
          </Tooltip>
          </>) : (
            <></>
          )}
        </Flex>
      );
    },
    state: {
      columnFilters,
      // globalFilter,
      rowSelection,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Error loading data" }
      : undefined,
  });

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
      <MantineReactTable table={table} />
    </>
  );
};

export default GetAllUser;
