import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'
import RootLayout from './pages/RootLayout'
import Dashboard, { loader as dashboardLoader } from './pages/Dashboard'
import Monitor, { loader as monitorLoader } from './pages/Monitor'
import Run from './pages/Run';
import Login from './pages/Login';
import { checkAuthLoader } from './utils/auth';
import { action as logoutAction } from './pages/Logout'
import store from './redux';
import ChangeLeader from './pages/ChangeLeader';
import CekApprover from './pages/CekApprover';
import CekOmAction from './pages/CekOmAction';
import CekDocument from './pages/CekDocument';
import CekEducation from './pages/CekEducation';
import CekFamily from './pages/CekFamily';
import CekLeaderOrganisasi from './pages/CekLeaderOrganisasi';
import CekPersonalData from './pages/CekPersonalData';
import CekPersonalId from './pages/CekPersonalId';
import CekAddress from './pages/CekAddress';
import CekTaxId from './pages/CekTaxId';
import RunOmAction from './pages/RunOmAction';
import RunEducation from './pages/RunEducation';
import RunFamily from './pages/RunFamily';
import RunLeaderOrg from './pages/RunLeaderOrg';
import RunPersonalData from './pages/RunPersonalData';
import RunPersonalId from './pages/RunPersonalId';
import RunBPJSKes from './pages/RunBPJSKes';
import RunBPJSTK from './pages/RunBPJSTK';
import RunTaxId from './pages/RunTaxId';
import RunAddress from './pages/RunAddress';
import CekBPJSKes from './pages/CekBPJSKes';
import CekBPJSTK from './pages/CekBPJSTK';
import CekPayslip from './pages/CekPayslip';
import RunPayslip from './pages/RunPayslip';
import SyncMasaKerja from './pages/SyncMasaKerja';

const router = createBrowserRouter([
  { path: '/', element: <RootLayout/>, loader: checkAuthLoader,
    children: [
      {
        path: '/', element: <Dashboard/>, loader: dashboardLoader,
      },
      {
        path: 'monitor', element: <Monitor/>, loader: monitorLoader,
      },
      {
        path: 'run-om-action', element: <RunOmAction/>
      },
      {
        path: 'run-om-action-3', element: <Run title="OM ACTION 3" subtitle="Run Cronjob" />
      },
      {
        path: 'run-document', element: <Run title="DOCUMENT" subtitle="Run Cronjob" />
      },
      {
        path: 'run-education', element: <RunEducation/>
      },
      {
        path: 'run-family', element: <RunFamily/>
      },
      {
        path: 'run-leader-org', element: <RunLeaderOrg/>
      },
      {
        path: 'run-personal-data', element: <RunPersonalData/>
      },
      {
        path: 'run-personal-id', element: <RunPersonalId/>
      },
      {
        path: 'run-bpjs-kes', element: <RunBPJSKes/>
      },
      {
        path: 'run-bpjs-tk', element: <RunBPJSTK/>
      },
      {
        path: 'run-tax-id', element: <RunTaxId/>
      },
      {
        path: 'run-address', element: <RunAddress/>
      },
      {
        path: 'run-payslip', element: <RunPayslip/>
      },
      {
        path: 'kiriman-om-action', element: <CekOmAction />
      },
      {
        path: 'kiriman-om-action-3', element: <Run title="OM ACTION 3" subtitle="Kiriman Cronjob" />
      },
      {
        path: 'kiriman-document', element: <CekDocument />
      },
      {
        path: 'kiriman-approver', element: <CekApprover />
      },
      {
        path: 'kiriman-education', element: <CekEducation/>
      },
      {
        path: 'kiriman-family', element: <CekFamily/>
      },
      {
        path: 'kiriman-leader-org', element: <CekLeaderOrganisasi/>
      },
      {
        path: 'kiriman-personal-data', element: <CekPersonalData/>
      },
      {
        path: 'kiriman-personal-id', element: <CekPersonalId/>
      },
      {
        path: 'kiriman-address', element: <CekAddress/>
      },
      {
        path: 'kiriman-tax-id', element: <CekTaxId/>
      },
      {
        path: 'kiriman-bpjs-kes', element: <CekBPJSKes/>
      },
      {
        path: 'kiriman-bpjs-tk', element: <CekBPJSTK/>
      },
      {
        path: 'kiriman-payslip', element: <CekPayslip/>
      },
      {
        path: 'leader', element: <ChangeLeader/>
      },
      {
        path: 'masa-kerja', element: <SyncMasaKerja/>
      },
    ],
  },
  {
    path: 'login', element: <Login/>
  },
  {
    path: 'logout', action: logoutAction
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
