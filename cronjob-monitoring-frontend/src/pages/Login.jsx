import classes from './Login.module.css';

import { useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [modal, setModal] = useState({ show: false, message: null });
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    const apiUrl = __VITE_REACT_APP_API_URL__
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      event.preventDefault();
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'username': formData.username, 'password': formData.password }),
      });

      if (response.status === 422 || response.status === 401) {
        return setModal({ show: true, message: 'username atau password tidak sesuai' })
      }

      if (!response.ok) {
        return setModal({ show: true, message: 'ada error server, harap hubungi admin' })
      }

      if (response.ok) {
        const resData = await response.json();
        const token = resData.data.token;

        localStorage.setItem('token', token);
        return navigate('/');
      }
    }

    setValidated(true);
  };

  return (
    <>
      <div className={classes.content}>
        <div className={classes.left}>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className={classes.form}>
            <Col md={12} className="mb-3">
              <Form.Group controlId="validationCustom01">
                <Form.Control
                  required
                  type="text"
                  className={classes.form__input}
                  placeholder='username'
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                  username wajib diisi
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group controlId="validationCustom03">
                <Form.Control 
                  type="password" 
                  required placeholder='password' 
                  className={classes.form__input} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <Form.Control.Feedback type="invalid">
                  password wajib diisi
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Button className={classes.button} type="submit">Login</Button>
          </Form>
        </div>
        <div className={classes.right}>
          <div className={classes.logo}></div>
          <div className={classes.title}>
            <h3>JM CRON MONITORING</h3>
            <h5>Aplikasi Monitoring Cron Milik PT Jasa Marga</h5>
            <p>© Copyright 2023. PT Jasa Marga (Persero) Tbk</p>
          </div>
        </div>
      </div>

      <Modal
        show={modal.show}
        onHide={() => setModal({show: false, message: null})}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        className={classes.modalFailed}
      >
        <Modal.Body>
          <div className={classes['modal-body']}>
            {modal.message}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Login;