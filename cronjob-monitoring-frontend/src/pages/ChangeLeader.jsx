import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';

import Dropdown from "../components/Dropdown";
import TableAntDesign from "../components/TableAntDesign";
import classes from './ChangeLeader.module.css';
import { leader } from "../redux/header/action";

const ChangeLeader = ({title, subtitle}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({  key: 1, name: '', npp: '', kd_comp: '' });
  const [modalData, setModalData] = useState({ isOpen: false, title: 'warning' , message: '', action: null });
  const [formData, setFormData] = useState({ org: null, leader: null })
  const [parentData, setParentData] = useState('');
  const [loading, setLoading] = useState(false);
  const prevParentData = useRef('');
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setFormData({ org: values.org, leader: values.leader })
    openModal('Jika Anda Merubah Leader Organisasi Maka Karyawan Di Organisasi Tsb. Akan Berubah Atasan', 'Perhatian!', 'wlewle')
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleOptions = (childData) => {
    setParentData(childData)
  };

  const handleOptionsOrg = (childData) => {
    form.setFieldsValue({ ['org']: childData });
  }
  
  const handleOptionsLeader = (childData) => {
    form.setFieldsValue({ ['leader']: childData });
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
        await axios.put(`${__VITE_REACT_APP_API_URL__}/api/organization-hierarchy/${formData.org}`, { leader_id: formData.leader }, config);
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
    dispatch(leader());
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        // Only fetch data if parentData has changed
        if (parentData !== prevParentData.current) {
          const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/organization-hierarchy/${parentData}`, config);
          const data = response.data;

          // Assuming the API response is an array of objects with 'value' and 'label' properties
          
          // Update the previous value of parentData
          prevParentData.current = parentData;
          setData({  key: data.data.leader?.id, name: data.data.leader?.name, npp: data.data.leader?.npp, kd_comp: data.data.leader.kd_comp })
        }
      } catch (error) {
        if (error.response.status === 403) {
          return navigate('/');
        }
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [parentData, data, dispatch]);

  return (
    <>
      <Outlet/>
      <Modal title={modalData.title} open={modalData.isOpen} onOk={processData} onCancel={closeModal}>
        <p className={classes.danger}>{modalData.message}</p>
      </Modal>
      <div className={classes.container}>
        <h1>CEK LEADER ORGANISASI</h1>
        <div className={classes.content}>
          PILIH ORGANISASI
          <div className={classes['org-dropdown']}>
            <Dropdown changeDataParent={handleOptions} title='pilih organisasi' endpoint={`${__VITE_REACT_APP_API_URL__}/api/organization-hierarchy`} parameter='name' />
          </div>
        </div>
        <div className={classes.content}>
          LEADER ORGANISASI
          <div className={classes.table}>
            <TableAntDesign columns={[ { title: 'NAME', dataIndex: 'name', key: 'name' }, { title: 'NPP', dataIndex: 'npp', key: 'npp' }, { title: 'KD COMP', dataIndex: 'kd_comp', key: 'kd_comp' } ]} dataSource={[data]} />
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.spinner}>
          <Spin spinning={loading}>
          <h1>GANTI LEADER ORGANISASI</h1>
          <div className={classes.content}>
            <div className={classes.form}>
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="PILIH ORGANISASI"
                  name="org"
                  rules={[
                    {
                      required: true,
                      message: 'Organisasi Wajib Dipilih!',
                    },
                  ]}
                >
                  <Dropdown changeDataParent={handleOptionsOrg} title='pilih organisasi' endpoint={`${__VITE_REACT_APP_API_URL__}/api/organization-hierarchy`} parameter='name' />
                </Form.Item>
                <Form.Item
                  label="PILIH LEADER"
                  name="leader"
                  rules={[
                    {
                      required: true,
                      message: 'Leader Wajib Dipilih!',
                    },
                  ]}
                >
                  <Dropdown changeDataParent={handleOptionsLeader} title='masukkan NPP' endpoint={`${__VITE_REACT_APP_API_URL__}/api/employee`} parameter='npp' />
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
          </div>
          </Spin>
        </div>
      </div>
    </>
  )
}

export default ChangeLeader