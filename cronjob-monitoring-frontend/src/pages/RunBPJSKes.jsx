import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';

import { clearHeader } from "../redux/header/action";
import DatePickerInput from "../components/DatePickerInput";
import classes from './Run.module.css';
import FormInput from "../components/FormInput";
import NewTable from "../components/NewTable";

const RunBPJSKes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    openModal(`Anda Yakin Ingin Menjalankan Cronjob BPJS Kesehatan ${values.personnel_number ?? ''} Pada Tanggal ${values.changedate.format('YYYY-MM-DD')} ? Harap Teliti Kembali di Halaman Cek Kiriman Cronjob`, 'warning!', true)
    setInputData({ personnel_number: values.personnel_number, changedate: values.changedate.format('YYYYMMDD') })
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({ personnel_number: null, changedate: null });
  const [dataRetrieved, setDataRetrieved] = useState([]);
  const [modalData, setModalData] = useState({ isOpen: false, title: 'warning!' , message: '', action: false });
  
  const openModal = (message, title, action) => {
    setModalData({ isOpen: true, title, message, action })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, title: 'warning!', message: '', action: false })
  }

  const processData = async () => {
    try {
      closeModal()
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      let params = []

      inputData.personnel_number && inputData.personnel_number.trim() !== '' ? params.push(`personnel_number=${inputData.personnel_number}`) : ''
      inputData.changedate && inputData.changedate.trim() !== '' ? params.push(`changedate=${inputData.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/run-profile-bpjs-kes${finalRoute}`, config);
      const newData = response.data.data.map((item, index) => {
        return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      openModal(`Berhasil Menjalankan Cron`, 'Berhasil', false)
      setLoading(false)
      setDataRetrieved(newData)
      return response
    } catch (error) {
      if (error.response.status === 403 || error.response.status === 401) {
        return navigate('/');
      }

      if (error.response.status === 404) {
        openModal(`Data Tidak Ditemukan`, 'warning!', null)
        setDataRetrieved([])
        setLoading(false)
        return
      }
      openModal(`INTERNAL SERVER ERROR ${error.response.message}`, 'warning!', null)
      return
    }
  }
  
  return (
    <>
      <Outlet/>
      <Modal title={modalData.title} open={modalData.isOpen} onOk={ modalData.action ? processData : closeModal} onCancel={closeModal}>
        <p className={modalData.title === 'warning!' ? classes.danger : classes.success}>{modalData.message}</p>
      </Modal>
      <div className={classes.container}>
          <h1>RUN CRON BPJS KES</h1>
        <Spin spinning={loading}>
        <div className={classes.content}>
          <div className={classes.form}>
            <Form 
              name="basic" 
              onFinish={onFinish}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item label="Personnel Number" name="personnel_number">
                <FormInput placeholder="Personnel Number" />
              </Form.Item>

              <Form.Item 
                label="Change Date" 
                name="changedate" 
                rules={[
                  {
                    required: true,
                    message: 'Changedate Harus Diisi!',
                  },
                ]}>
                <DatePickerInput placeholder="Changedate"/>
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
          <div className={classes['table-container']}>
            <div className={classes.table}>
              <NewTable columns={[
                {
                  title: 'Employee Number',
                  dataIndex: 'employee_number',
                  key: 'employee_number',
                  width: '15%',
                  fixed: 'left'
                },
                {
                  title: 'Action Profile',
                  dataIndex: 'action_profile',
                  key: 'action_profile',
                  width: '20%',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  width: '20%',
                },
              ]} data={dataRetrieved} widthScroll={500} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default RunBPJSKes