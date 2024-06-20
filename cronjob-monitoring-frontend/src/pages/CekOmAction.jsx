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

const CekOmAction = () => {
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

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/om-action${finalRoute}`, config);
      const newData = response.data.data.map((item, index) => {
        return { ...item, key: index.toString() }; // Use index as the key (convert to string for uniqueness)
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false)
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
          <h1>CEK KIRIMAN OM ACTION</h1>
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
                  width: '15%',
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
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  width: '20%',
                },
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  width: '20%',
                },
                {
                  title: 'Emp Status',
                  dataIndex: 'emp_status',
                  key: 'emp_status',
                  width: '20%',
                },
                {
                  title: 'Personal Area',
                  dataIndex: 'personal_area',
                  key: 'personal_area',
                  width: '20%',
                },
                {
                  title: 'Text Personal Area',
                  dataIndex: 'text_personal_area',
                  key: 'text_personal_area',
                  width: '20%',
                },
                {
                  title: 'Employee Group',
                  dataIndex: 'employee_group',
                  key: 'employee_group',
                  width: '20%',
                },
                {
                  title: 'Text Employee Group',
                  dataIndex: 'text_employee_group',
                  key: 'text_employee_group',
                  width: '20%',
                },
                {
                  title: 'Employee Sub Group',
                  dataIndex: 'employee_subgroup',
                  key: 'employee_subgroup',
                  width: '20%',
                },
                {
                  title: 'Text Employee Sub Group',
                  dataIndex: 'text_employee_subgroup',
                  key: 'text_employee_subgroup',
                  width: '20%',
                },
                {
                  title: 'Personal Sub Area',
                  dataIndex: 'personal_sub_area',
                  key: 'personal_sub_area',
                  width: '20%',
                },
                {
                  title: 'Text Personal Sub Area',
                  dataIndex: 'text_personal_subarea',
                  key: 'text_personal_subarea',
                  width: '20%',
                },
                {
                  title: 'Cost Center',
                  dataIndex: 'cost_center',
                  key: 'cost_center',
                  width: '20%',
                },
                {
                  title: 'Organisasi Key',
                  dataIndex: 'organisasi_key',
                  key: 'organisasi_key',
                  width: '20%',
                },
                {
                  title: 'Text Organisasi Key',
                  dataIndex: 'text_organisasi_key',
                  key: 'text_organisasi_key',
                  width: '20%',
                },
                {
                  title: 'Position Key',
                  dataIndex: 'position_key',
                  key: 'position_key',
                  width: '20%',
                },
                {
                  title: 'Text Position Key',
                  dataIndex: 'text_position_key',
                  key: 'text_position_key',
                  width: '20%',
                },
                {
                  title: 'Job Key',
                  dataIndex: 'job_key',
                  key: 'job_key',
                  width: '20%',
                },
                {
                  title: 'Text Job Key',
                  dataIndex: 'text_job_key',
                  key: 'text_job_key',
                  width: '20%',
                },
                {
                  title: 'Section',
                  dataIndex: 'section',
                  key: 'section',
                  width: '20%',
                },
                {
                  title: 'Text Section',
                  dataIndex: 'text_section',
                  key: 'text_section',
                  width: '20%',
                },
                {
                  title: 'Departement',
                  dataIndex: 'departement',
                  key: 'departement',
                  width: '20%',
                },
                {
                  title: 'Text Departement',
                  dataIndex: 'text_departement',
                  key: 'text_departement',
                  width: '20%',
                },
                {
                  title: 'Unit Kerja',
                  dataIndex: 'unit_kerja',
                  key: 'unit_kerja',
                  width: '20%',
                },
                {
                  title: 'Text Unit Kerja',
                  dataIndex: 'text_unit_kerja',
                  key: 'text_unit_kerja',
                  width: '20%',
                },
                {
                  title: 'Kelompok Jabatan',
                  dataIndex: 'kelompok_jabatan',
                  key: 'kelompok_jabatan',
                  width: '20%',
                },
                {
                  title: 'Pay Scale Area',
                  dataIndex: 'pay_scale_area',
                  key: 'pay_scale_area',
                  width: '20%',
                },
                {
                  title: 'Grade',
                  dataIndex: 'grade',
                  key: 'grade',
                  width: '20%',
                },
                {
                  title: 'Subgrade',
                  dataIndex: 'subgrade',
                  key: 'subgrade',
                  width: '20%',
                },
                {
                  title: 'Change on',
                  dataIndex: 'change_on',
                  key: 'change_on',
                  width: '20%',
                },
              ]} data={dataRetrieved} widthScroll={6000} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </>
  )
}

export default CekOmAction