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

const RunLeaderOrg = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    openModal(`Anda Yakin Ingin Menjalankan Cronjob LEADER ORGANISASI ${values.object_id ?? ''} Pada Tanggal ${values.changedate.format('YYYY-MM-DD')} ? Harap Teliti Kembali di Halaman Cek Kiriman Cronjob`, 'warning!', true)
    setInputData({ object_id: values.object_id, changedate: values.changedate.format('YYYYMMDD') })
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({ object_id: null, changedate: null });
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

      inputData.object_id && inputData.object_id.trim() !== '' ? params.push(`object_id=${inputData.object_id}`) : ''
      inputData.changedate && inputData.changedate.trim() !== '' ? params.push(`changedate=${inputData.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/run-org-leader${finalRoute}`, config);
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
          <h1>RUN CRON LEADER ORGANISASI</h1>
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
              <Form.Item label="Organization ID" name="object_id">
                <FormInput placeholder="Organization ID" />
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
                  title: 'Result',
                  dataIndex: 'result',
                  key: 'result',
                  width: '100%',
                  fixed: 'left'
                }
              ]} data={dataRetrieved} widthScroll={0} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default RunLeaderOrg