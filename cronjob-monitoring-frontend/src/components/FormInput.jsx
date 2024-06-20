import { Input } from 'antd';

const FormInput = ({ onChange, placeholder }) => {
  return (
    <Input onChange={onChange} placeholder={placeholder} />
  )
}

export default FormInput