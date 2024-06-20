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

const CekEducation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  const onFinish = (values) => {
    if (!values.personnel_number && !values.changedate) {
      openModal('Personnel Number atau Changedate Wajib diisi', 'Perhatian!', null)
      return
    }
    processData({ personnel_number: values.personnel_number, changedate: values.changedate?.format('YYYYMMDD') })
    return
  }
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataRetrieved, setDataRetrieved] = useState([]);
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
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      let params = []

      data.personnel_number && data.personnel_number.trim() !== '' ? params.push(`personnel_number=${data.personnel_number}`) : ''
      data.changedate && data.changedate.trim() !== '' ? params.push(`changedate=${data.changedate}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/education${finalRoute}`, config);
      const newData = response.data.data.map((item, index) => {
        return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false)
      console.log(newData)
      setDataRetrieved(newData)
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
          <h1>CEK KIRIMAN EDUCATION</h1>
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
                  title: 'Personnel Number',
                  dataIndex: 'personnel_number',
                  key: 'personnel_number',
                  width: '25%',
                  fixed: 'left'
                },
                {
                  title: 'Begin Date',
                  dataIndex: 'begin_date',
                  key: 'begin_date',
                  width: '20%',
                  sorter: (a, b) => a.begin_date - b.begin_date
                },
                {
                  title: 'End Date',
                  dataIndex: 'end_date',
                  key: 'end_date',
                  width: '20%',
                  sorter: (a, b) => a.end_date - b.end_date
                },
                {
                  title: 'Level Pendidikan',
                  dataIndex: 'level_pendidikan',
                  key: 'level_pendidikan',
                  width: '20%'
                },
                {
                  title: 'Jurusan Kuliah Training',
                  dataIndex: 'jurusan_kuliah_training',
                  key: 'jurusan_kuliah_training',
                  width: '20%'
                },
                {
                  title: 'Institusi Penyelenggara',
                  dataIndex: 'institusi_penyelenggara',
                  key: 'institusi_penyelenggara',
                  width: '20%'
                },
                {
                  title: 'Country',
                  dataIndex: 'country',
                  key: 'country',
                  width: '20%'
                },
                {
                  title: 'Certificate',
                  dataIndex: 'certificate',
                  key: 'certificate',
                  width: '20%'
                },
                {
                  title: 'Dur of Course',
                  dataIndex: 'dur_of_course',
                  key: 'dur_of_course',
                  width: '20%'
                },
                {
                  title: 'Time Unit Meas',
                  dataIndex: 'time_unit_meas',
                  key: 'time_unit_meas',
                  width: '20%'
                },
                {
                  title: 'Jurusan',
                  dataIndex: 'jurusan',
                  key: 'jurusan',
                  width: '20%'
                },
                {
                  title: 'Final Grade',
                  dataIndex: 'final_grade',
                  key: 'final_grade',
                  width: '20%'
                },
                {
                  title: 'No Certificate',
                  dataIndex: 'no_certificate',
                  key: 'no_certificate',
                  width: '20%'
                },
                {
                  title: 'Location',
                  dataIndex: 'location',
                  key: 'location',
                  width: '20%'
                },
                {
                  title: 'Change On',
                  dataIndex: 'change_on',
                  key: 'change_on',
                  width: '20%'
                },
              ]} data={dataRetrieved} widthScroll={2100} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default CekEducation