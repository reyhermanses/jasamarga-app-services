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

const RunPayslip = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    openModal(`Anda Yakin Ingin Menjalankan Cronjob Payslip ${values.npp ?? ''} Pada Periode ${values.periode.format('YYYY-MM')} ? Harap Teliti Kembali di Halaman Cek Kiriman Cronjob`, 'warning!', true)
    setInputData({ npp: values.npp, periode: values.periode.format('YYYYMMDD') })
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({ npp: null, periode: null });
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

      inputData.npp && inputData.npp.trim() !== '' ? params.push(`npp=${inputData.npp}`) : ''
      inputData.periode && inputData.periode.trim() !== '' ? params.push(`periode=${inputData.periode}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/run-payslip${finalRoute}`, config);
      await new Promise(resolve => setTimeout(resolve, 500));
      openModal(`Berhasil Menjalankan Cron`, 'Berhasil', false)
      setLoading(false)
      return response
    } catch (error) {
			console.log(error)
			if (error.response.status === 403 || error.response.status === 401) {
        return navigate('/');
      }

      if (error.response.status === 404) {
        openModal(`Data Tidak Ditemukan`, 'warning!', null)
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
          <h1>RUN CRON PAYSLIP</h1>
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
                span: 6,
              }}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item label="npp" name="npp">
                <FormInput placeholder="npp" />
              </Form.Item>

              <Form.Item 
                label="Periode" 
                name="periode" 
                rules={[
                  {
                    required: true,
                    message: 'periode Harus Diisi!',
                  },
                ]}>
                <DatePickerInput placeholder="periode" format="YYYY-MM" type="month"/>
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
    </>
  )
}

export default RunPayslip