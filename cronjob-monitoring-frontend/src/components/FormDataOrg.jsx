import { Form, Button, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import classes from './FormDataOrg.module.css';
import Table from './Table';

const FormDataOrg = ({title, subtitle}) => {
  const navigate = useNavigate();
  const buttonStyle = {
    backgroundColor: '#004e92',
    color: 'white',
    border: 'none',
    marginTop: '10px'
  };

  // START STATE
  const [header, setHeader] = useState({ title: '', subtitle: '' });
  const [formData, setFormData] = useState({ changedate: '', object_id: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [tableData, setTableData] = useState({ rows: [], columns: []});
  const [showConfirmationModal, setShowConfirmationModal] = useState({ isShown: false, message: null, canSubmit: false });
  // END STATE

  // Handle Open ConfirmationModal
  const openConfirmationModal = (message, canSubmit) => {
    setShowConfirmationModal({ isShown: true, message: message, canSubmit: canSubmit });
  };

  // Handle Close ConfirmationModal
  const closeConfirmationModal = () => {
    setShowConfirmationModal({ isShown: false, message: null, canSubmit:null });
  };

  // Handle formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitKirimanHandler = async (e) => {
    e.preventDefault()
    if (formData.changedate.trim() === '' && formData.object_id.trim() === '') {
      openConfirmationModal('Changedate atau Organization ID Wajib Diisi', false);
      return
    }
    setIsLoading(true)
    const response = await getKirimanBackend()
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

  const getKirimanBackend = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      let mainRoute = 'org-leader'
      const subtype = subtitle = 'Kiriman Leader Organisasi' ? 'B012' : ''
      let params = []

      formData.changedate.trim() !== '' ? params.push(`changedate=${formData.changedate}`): ''
      formData.object_id.trim() !== '' ? params.push(`object_id=${formData.object_id}`) : ''
      params.push(`subtype=${subtype}`)
      const finalRoute = `?${params.join('&')}`;
      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/${mainRoute}${finalRoute}`, config);
      return response
    } catch (error) {
      if (error.response.status === 403) {
        return navigate('/');
      }
      openConfirmationModal('internal server error', false)
      console.log('Error Fetching data from server : ', error)
    }
  }
  
  const submitRunHandler = async (e) => {
    e.preventDefault()
    if (formData.changedate.trim() === '') {
      openConfirmationModal('Changedate Wajib Diisi', false);
      return
    }

    const organization = formData.object_id.trim() !== '' ? `Organisasi ${formData.object_id}` : '' 
    openConfirmationModal(`Yakin Ingin Menjalankan Cron ${organization} pada changedate ${formData.changedate}?`, true);
    return
  }

  const handleConfirmation = async () => {
    try {
      closeConfirmationModal();
      setIsLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      let params = []

      formData.changedate.trim() !== '' ? params.push(`changedate=${formData.changedate}`): ''
      formData.object_id.trim() !== '' ? params.push(`object_id=${formData.object_id}`) : ''

      const finalRoute = `?${params.join('&')}`;

      const response = await axios.get(`${__VITE_REACT_APP_API_URL__}/cron/run-org-leader${finalRoute}`, config); // Replace with your API endpoint
      setIsLoading(false);
      setIsProcessing(false);

      const dataResult = response.data.data
      const columnsResult = response.data.data.length > 0 ? Object.keys(dataResult[0]).map(key => ({
        field: key,
        headerName: key,
        width: key === 'id' ? 50 : 700,
        renderCell: (params) => (
          <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
            {params.value}
          </div>
        )
      })) : [] ;

      setTableData({ rows: dataResult, columns: columnsResult })
    } catch (error) {
      if (error.response.status === 500) {
        console.log('Error Fetching data from server : ', error)
        openConfirmationModal('internal server error', false)
      } else if (error.response.status === 404) {
        openConfirmationModal('Data Tidak Ditemukan', false)
      } else if (error.response.status === 403) {
        return navigate('/');
      }
      setIsLoading(false);
      setIsProcessing(false);
    }
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
      setFormData({ changedate: '', object_id: '' })
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
        <Form 
        onSubmit={subtitle === 'Kiriman Leader Organisasi' ? submitKirimanHandler : submitRunHandler}
        >
          <Row>
            <Col md={6}>
              <Form.Group>
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
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Organization ID"
                  value={formData.object_id}
                  name='object_id'
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

export default FormDataOrg