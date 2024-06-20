"use client";

import { Table } from "@mantine/core";

interface TableInterface {
  datas: any;
}

const TableDemo: React.FC<TableInterface> = ({ datas }) => {
  return (
    <Table.ScrollContainer minWidth={500} type="native">
      <Table>
        <Table.Thead>{datas.header}</Table.Thead>
        <Table.Tbody>{datas.rowsValue}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default TableDemo;
