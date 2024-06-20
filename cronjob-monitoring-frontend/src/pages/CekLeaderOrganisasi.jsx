import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Spin, Form, Button, Modal } from 'antd';

import { clearHeader } from "../redux/header/action";
import DatePickerInput from "../components/DatePickerInput";
import classes from './Cek.module.css';
import FormInput from "../components/FormInput";
import NewTable from "../components/NewTable";

const CekLeaderOrganisasi = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    if (!values.object_id && !values.changedate) {
      openModal('Org ID atau Changedate Wajib diisi', 'Perhatian!', 'wlewle')
      return
    }
    processData({ object_id: values.object_id, changedate: values.changedate?.format('YYYYMMDD') })
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

      data.object_id && data.object_id.trim() !== '' ? params.push(`object_id=${data.object_id}`) : ''
      data.changedate && data.changedate.trim() !== '' ? params.push(`changedate=${data.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/org-leader${finalRoute}&subtype=B012`, config);
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
          <h1>CEK KIRIMAN LEADER ORGANISASI "JM_ORG"</h1>
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
                  title: 'Object ID',
                  dataIndex: 'object_id',
                  key: 'object_id',
                  width: '10%',
                  fixed: 'left'
                },
                {
                  title: 'Object Name',
                  dataIndex: 'object_name',
                  key: 'object_name',
                  width: '20%',
                  fixed: 'left'
                },
                {
                  title: 'Start Date',
                  dataIndex: 'start_date',
                  key: 'start_date',
                  width: '10%',
                  sorter: (a, b) => a.start_date - b.start_date
                },
                {
                  title: 'End Date',
                  dataIndex: 'end_date',
                  key: 'end_date',
                  width: '10%',
                  sorter: (a, b) => a.end_date - b.end_date
                },
                {
                  title: 'Object Type',
                  dataIndex: 'object_type',
                  key: 'object_type',
                  width: '10%',
                },
                {
                  title: 'Object Type',
                  dataIndex: 'object_type',
                  key: 'object_type',
                  width: '10%',
                },
                {
                  title: 'Subtype',
                  dataIndex: 'subtype',
                  key: 'subtype',
                  width: '10%',
                },
                {
                  title: 'Subtype Text',
                  dataIndex: 'subtype_text',
                  key: 'subtype_text',
                  width: '10%',
                },
                {
                  title: 'Type of Related Object',
                  dataIndex: 'type_of_related_object',
                  key: 'type_of_related_object',
                  width: '10%',
                },
                {
                  title: 'Object Sob ID',
                  dataIndex: 'object_sobid',
                  key: 'object_sobid',
                  width: '10%',
                },
                {
                  title: 'Object Sob ID Name',
                  dataIndex: 'object_sobid_name',
                  key: 'object_sobid_name',
                  width: '20%',
                },
                {
                  title: 'Change On',
                  dataIndex: 'change_on',
                  key: 'change_on',
                  width: '10%',
                },
              ]} data={dataRetrieved} widthScroll={1500} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default CekLeaderOrganisasi