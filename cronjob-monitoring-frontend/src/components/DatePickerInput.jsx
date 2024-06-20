import { DatePicker, Space } from 'antd';

const DatePickerInput = ({ onChange, placeholder, type, format }) => {
  return (
    <Space direction="vertical" size={12}>
      <DatePicker onChange={onChange} placeholder={placeholder} format={format ? format : 'YYYYMMDD'} picker={type} getPopupContainer={(triggerNode) => {
      return triggerNode.parentNode;
    }} />
    </Space>
  )
}

export default DatePickerInput;