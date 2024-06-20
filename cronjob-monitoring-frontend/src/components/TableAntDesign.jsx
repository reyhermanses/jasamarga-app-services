import { Table } from 'antd';

const TableAntDesign = ({ dataSource, columns }) => {
  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  )
}

export default TableAntDesign;