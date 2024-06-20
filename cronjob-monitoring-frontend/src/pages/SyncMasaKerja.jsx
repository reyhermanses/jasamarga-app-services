import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';

import Dropdown from "../components/Dropdown";
import TableAntDesign from "../components/TableAntDesign";
import classes from './SyncMasaKerja.module.css';
import NewTable from "../components/NewTable";

const SyncMasaKerja = ({title, subtitle}) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState({ isOpen: false, title: 'warning' , message: '', action: null });
  const [formData, setFormData] = useState({ employee_id: null })
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
		setFormData({ employee_id: values.employee })
    openModal('Yakin Sinkronisasi Masa Kerja?', 'Perhatian!', 'wlewle')
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleOptionsEmployee = (childData) => {
		 form.setFieldsValue({ ['employee']: childData });
  }

  const openModal = (message, title, action) => {
    setModalData({ isOpen: true, title, message, action })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, title: 'warning', message: '', action: null })
  }

  const processData = async () => {
    if (modalData.action) {
      try {
        closeModal();
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/run-masa-kerja?employee_id=${formData.employee_id}`, config);
				const newData = response.data.data.map((item, index) => {
					return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
				});
				console.log(newData);
				setData(newData)
        setLoading(false);
      } catch (error) {
        if (error.response.status === 403) {
          return navigate('/');
        }
        openModal(error.message, 'backend server error', null)
      }
    } else {
      closeModal();
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
      } catch (error) {
        if (error.response.status === 403) {
          return navigate('/');
        }
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [data]);

  return (
    <>
      <Outlet/>
      <Modal title={modalData.title} open={modalData.isOpen} onOk={processData} onCancel={closeModal}>
        <p className={classes.danger}>{modalData.message}</p>
      </Modal>
      <div className={classes.container}>
        <div className={classes.spinner}>
          <Spin spinning={loading}>
          <h1>SINKRONISASI MASA KERJA</h1>
          <div className={classes.content}>
            <div className={classes.form}>
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 8,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="PILIH KARYAWAN"
                  name="employee"
                  rules={[
                    {
                      required: true,
                      message: 'Karyawan Wajib Dipilih!',
                    },
                  ]}
                >
                  <Dropdown changeDataParent={handleOptionsEmployee} title='masukkan NPP' endpoint={`${__VITE_REACT_APP_API_URL__}/api/employee`} parameter='npp' />
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 5,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          <div className={classes.table}>
            <NewTable columns={[
							{ 
								title: 'Date of Entry', 
								dataIndex: 'date_of_entry', 
								key: 'date_of_entry' 
							}, 
							{ 
								title: 'Grade', 
								dataIndex: 'grade', 
								key: 'grade' 
							}, 
							{ 
								title: 'Konversi', 
								dataIndex: 'konversi', 
								key: 'konversi' 
							},
							{ 
								title: 'SK Position Date', 
								dataIndex: 'sk_position_date', 
								key: 'sk_position_date' 
							},
							{ 
								title: 'Start Date', 
								dataIndex: 'start_date', 
								key: 'start_date' 
							},
							{ 
								title: 'Unit Name', 
								dataIndex: 'unit_name', 
								key: 'unit_name' 
							},
							{ 
								title: 'MK Grade', 
								dataIndex: 'mk_grade', 
								key: 'mk_grade' 
							},
							{ 
								title: 'MK Unit', 
								dataIndex: 'mk_unit', 
								key: 'mk_unit' 
							},
							{ 
								title: 'Masa Kerja', 
								dataIndex: 'masa_kerja', 
								key: 'masa_kerja' 
							},
							{ 
								title: 'MK Jabatan', 
								dataIndex: 'mk_jabatan', 
								key: 'mk_jabatan' 
							},
						]} data={data} widthScroll={1400} />
          </div>
          </div>
          </Spin>
        </div>
      </div>
    </>
  )
}

export default SyncMasaKerja