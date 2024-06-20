import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';

import DatePickerInput from "../components/DatePickerInput";
import { clearHeader } from "../redux/header/action";
import classes from './Cek.module.css';
import FormInput from "../components/FormInput";
import NewTable from "../components/NewTable";

const CekApprover = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    if (!values.org_id && !values.changedate) {
      openModal('Org ID atau Changedate Wajib diisi', 'Perhatian!', 'wlewle')
      return
    }
    processData({ org_id: values.org_id, changedate: values.changedate?.format('YYYYMMDD') })
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataRetrieved, setDataRetrieved] = useState([]);
  const [finishProcessData, setFinishProcessData] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, title: 'warning' , message: '', action: null });
  
  const openModal = (message, title, action) => {
    setModalData({ isOpen: true, title, message, action })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, title: 'warning', message: '', action: null })
  }

  const processData = async (data) => {
    try {
      setLoading(true)
      setFinishProcessData(false)
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      let params = []

      data.org_id && data.org_id.trim() !== '' ? params.push(`org_id=${data.org_id}`) : ''
      data.changedate && data.changedate.trim() !== '' ? params.push(`changedate=${data.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/approver${finalRoute}`, config);
      const newData = response.data.data.map((item, index) => {
        return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
      });
      setDataRetrieved(newData)
      setLoading(false)
      setFinishProcessData(true)
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
      <Modal title={modalData.title} open={modalData.isOpen} onOk={closeModal} onCancel={closeModal}>
        <p className={classes.danger}>{modalData.message}</p>
      </Modal>
      <div className={classes.container}>
          <h1>CEK KIRIMAN APPROVER</h1>
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
              <Form.Item label="Organization ID" name="org_id">
                <FormInput placeholder="Organization ID" />
              </Form.Item>

              <Form.Item label="Change Date" name="changedate">
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
                  title: 'Name Approver',
                  dataIndex: 'name_approver',
                  key: 'name_approver',
                  width: '5%',
                  fixed: 'left'
                },
                {
                  title: 'Position ID Approver',
                  dataIndex: 'position_appr',
                  key: 'position_appr',
                  width: '5%',
                },
                {
                  title: 'Org Text Approver',
                  dataIndex: 'org_text_approver',
                  key: 'org_text_approver',
                  width: '5%',
                },
                {
                  title: 'Org ID Approver',
                  dataIndex: 'org_approver',
                  key: 'org_approver',
                  width: '5%',
                },
                {
                  title: 'Change On',
                  dataIndex: 'change_on',
                  key: 'change_on',
                  width: '3%',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.change_on - b.change_on
                },
              ]} data={dataRetrieved} widthScroll={900} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default CekApprover