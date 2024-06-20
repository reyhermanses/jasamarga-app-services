import { Outlet } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';
import DatePickerInput from "../components/DatePickerInput";

import classes from './RunApprover.module.css';
import FormInput from "../components/FormInput";
import NewTable from "../components/NewTable";

const RunApprover = () => {
  const onFinish = (values) => {
    if (!values.org_id || !values.changedate) {
      openModal('Org ID dan Changedate Wajib diisi', 'Perhatian!', null)
      return
    }
    setInputData({org_id: values.org_id, changedate: values.changedate.format('YYYYMMDD')})
    openModal(`Jika Data ditemukan maka Anda Akan Merubah Leader dari organisasi ${values.org_id}`, 'Perhatian', 'wlewlewle')
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataRetrieved, setDataRetrieved] = useState([]);
  const [inputData, setInputData] = useState({ org_id: null, changedate: null });
  const [modalData, setModalData] = useState({ isOpen: false, title: 'warning' , message: '', action: null });
  
  const openModal = (message, title, action) => {
    setModalData({ isOpen: true, title, message, action })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, title: 'warning', message: '', action: null })
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

      inputData.org_id && inputData.org_id.trim() !== '' ? params.push(`org_id=${inputData.org_id}`) : ''
      inputData.changedate && inputData.changedate.trim() !== '' ? params.push(`changedate=${inputData.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/approver${finalRoute}`, config);

      if (response.data.data.length === 0) {
        openModal(`Tidak ada kiriman data ${inputData.org_id} di changedate ${inputData.changedate}`, 'Data Tidak Ditemukan', null)
        setDataRetrieved([])
        setLoading(false)
        return
      }

      const newData = response.data.data.map((item, index) => {
        return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
      });
      setDataRetrieved(newData)
      openModal(null, 'Berhasil Menjalankan Cronjob', null)
      setLoading(false)
      return response
    } catch (error) {
      console.log(error)
      if (error.response.status === 403 || error.response.status === 401) {
        return navigate('/');
      }
      openModal(error.response.message, 'Internal Server Error', null)
    }
  }
  
  return (
    <>
      <Outlet/>
      <Modal title={modalData.title} open={modalData.isOpen} onOk={modalData.action ? processData : closeModal} onCancel={closeModal}>
        <p className={classes.danger}>{modalData.message}</p>
      </Modal>
      <div className={classes.container}>
          <h1>RUN CRONJOB APPROVER</h1>
        <Spin spinning={loading}>
        <div className={classes.content}>
          <div className={classes.form}>
            <Form 
              name="basic"
              onFinish={onFinish}
            >
              <Form.Item label="Organization ID" name="org_id">
                <FormInput placeholder="Organization ID" />
              </Form.Item>

              <Form.Item label="Change Date" name="changedate">
                <DatePickerInput placeholder="changedate"/>
              </Form.Item>

              <Form.Item>
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
                  title: 'Name Approver',
                  dataIndex: 'name_approver',
                  key: 'name_approver',
                  width: '30%',
                  fixed: 'left'
                },
                {
                  title: 'Position ID Approver',
                  dataIndex: 'position_appr',
                  key: 'position_appr',
                  width: '30%',
                },
                {
                  title: 'Org Text Approver',
                  dataIndex: 'org_text_approver',
                  key: 'org_text_approver',
                  width: '50%',
                },
                {
                  title: 'Org ID Approver',
                  dataIndex: 'org_approver',
                  key: 'org_approver',
                  width: '50%',
                },
                {
                  title: 'Change On',
                  dataIndex: 'change_on',
                  key: 'change_on',
                  width: '30%',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.change_on - b.change_on
                },
              ]} data={dataRetrieved} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default RunApprover