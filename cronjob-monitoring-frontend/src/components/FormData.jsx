import { Form, Button, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import classes from './FormData.module.css';
import Table from './Table';

const FormData = ({title, subtitle}) => {
  const navigate = useNavigate();
  const buttonStyle = {
    backgroundColor: '#004e92',
    color: 'white',
    border: 'none',
    marginTop: '10px'
  };
  const [header, setHeader] = useState({ title: '', subtitle: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [tableData, setTableData] = useState({ rows: [], columns: []});

  const [showConfirmationModal, setShowConfirmationModal] = useState({ isShown: false, message: null, canSubmit: false });

  const openConfirmationModal = (message, canSubmit) => {
    setShowConfirmationModal({ isShown: true, message: message, canSubmit: canSubmit });
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal({ isShown: false, message: null, canSubmit:null });
  };

  const [formData, setFormData] = useState({
    changedate: '',
    personnel_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const submitHandler = async (e) => {
    e.preventDefault()

    if (subtitle === 'Run Cronjob' && (formData.changedate.trim() === '')) {
      openConfirmationModal('Changedate Wajib Diisi', false);
      return
    }
    
    if (subtitle === 'Kiriman Cronjob' && ((formData.changedate.trim() === '') && (formData.personnel_number.trim() === ''))) {
      openConfirmationModal('Changedate atau Personnel Number Wajib Diisi', false);
      return
    }

    if (subtitle === 'Run Cronjob') {
      const persNumber = formData.personnel_number.trim() !== '' ? `Karyawan ${formData.personnel_number}` : '' 
      openConfirmationModal(`Yakin Ingin Menjalankan Cron ${persNumber} pada changedate ${formData.changedate}?`, true);
      return
    }

    setIsLoading(true)

    let response = {}
    if (subtitle === 'Kiriman Cronjob') {
      response = await getKiriman()
    }

    setIsLoading(false);
    setIsProcessing(false);

    const dataResult = response.data.data
    const columnsResult = response.data.data.length > 0 ? Object.keys(dataResult[0]).map(key => ({
      field: key,
      headerName: key,
      width: key === 'id' ? 50 : 250,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
          {params.value}
        </div>
      )
    })) : [] ;

    setTableData({ rows: dataResult, columns: columnsResult })
  }

  const runCronjob = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      let mainRoute = `run-${title.toLowerCase()}`

      if (title === 'OM ACTION') {
        mainRoute = 'run-om-action'
      }
      
      if (title === 'OM ACTION 3') {
        mainRoute = 'run-om-action-3'
      }

      let params = []

      formData.changedate.trim() !== '' ? params.push(`changedate=${formData.changedate}`): ''
      formData.personnel_number.trim() !== '' ? params.push(`personnel_number=${formData.personnel_number}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/${mainRoute}${finalRoute}`, config); // Replace with your API endpoint
      // Handle the API response data
      return response
    } catch (error) {
      if (error.response.status === 403) {
        return navigate('/');
      }
      openConfirmationModal(error.response.data.status, false)
      console.log('Error Fetching data from server : ', error)
    }
  }

  const getKiriman = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      let mainRoute = title.toLowerCase()

      if (title === 'OM ACTION') {
        mainRoute = 'om-action'
      }
      
      if (title === 'OM ACTION 3') {
        mainRoute = 'om-action-3'
      }

      let params = []

      formData.changedate.trim() !== '' ? params.push(`changedate=${formData.changedate}`): ''
      formData.personnel_number.trim() !== '' ? params.push(`personnel_number=${formData.personnel_number}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/api/${mainRoute}${finalRoute}`, config); // Replace with your API endpoint
      // Handle the API response data
      return response
    } catch (error) {
      if (error.response.status === 403) {
        return navigate('/');
      }
      openConfirmationModal('internal server error', false)
      console.log('Error Fetching data from server : ', error)
    }
  }

  const handleConfirmation = async () => {
    if (subtitle === 'Run Cronjob') {
      // Close the confirmation modal
      closeConfirmationModal();
    }
    setIsLoading(true)

    const response = await runCronjob()

    setIsLoading(false);
    setIsProcessing(false);

    const dataResult = response.data.data
    console.log(response.data.data)
    const columnsResult = response.data.data.length > 0 ? Object.keys(dataResult[0]).map(key => ({
      field: key,
      headerName: key,
      width: key === 'id' ? 50 : 250,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
          {params.value}
        </div>
      )
    })) : [] ;

    setTableData({ rows: dataResult, columns: columnsResult })
  };

  const confirmButton = (
    <Button variant="primary" onClick={handleConfirmation}>
      Yakin
    </Button>
  );

  useEffect(() => {
    // Compare the previous props with the current props
    if (title !== header.title || subtitle !== header.subtitle) {
      // Reset the state when the relevant prop changes
      setHeader({ title, subtitle })
      setIsLoading(false)
      setIsProcessing(true)
      setFormData({ changedate: '', personnel_number: '' })
    }
  }, [title, subtitle]);

  return (
    <div className={classes.container}>
      <div className={classes.subtitle}>
        <p>{subtitle}</p>
      </div>
      <div className={classes.title}>
        <h2>{title}</h2>
      </div>
      <div className={classes.content}>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control 
                  type="text" 
                  placeholder="Enter Changedate"
                  value={formData.changedate}
                  name='changedate'
                  onChange={handleChange} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBasicPassword">
                <Form.Control 
                  type="text" 
                  placeholder="Personnel Number"
                  value={formData.personnel_number}
                  name='personnel_number'
                  onChange={handleChange} 
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Button style={buttonStyle} type="submit">
                { subtitle === 'Kiriman Cronjob' ? 'Check Kiriman' : 'Jalankan' }
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal show={showConfirmationModal.isShown} onHide={closeConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showConfirmationModal.message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeConfirmationModal}>
              Tutup
            </Button>
            {showConfirmationModal.canSubmit ? confirmButton : null}
          </Modal.Footer>
        </Modal>
        { isLoading && <div className={classes['loading-circle']}><Spinner animation="border" /></div> }
        <div className={classes.table}>
          { !isLoading && !isProcessing ? <Table columns={tableData.columns} rows={tableData.rows}/> : null }
        </div>
      </div>
    </div>
  )
}

export default FormData