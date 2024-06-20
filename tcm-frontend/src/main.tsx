import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { Dashboard } from './pages/Dashboard/Dasboard';
import { Login } from './pages/Login/Login';
import { ReportData } from './pages/ReportData/ReportData';
import { Template } from './pages/template/Template';
import ReportDataLalin from './pages/ReportDataLalin/ReportDataLalin';
import RoleMaster from './pages/ManagementUser/RoleMaster';
import RoleManagementUser from './pages/ManagementUser/RoleManagementUser';
// import { Dashboard, Login } from '@mui/icons-material';

const router = createBrowserRouter([
  { path: '/', element: <RootLayout/>, 
  // loader: checkAuthLoader,
    children: [
      {
        path: '/', element: <Dashboard/>,
        //  loader: dashboardLoader,
      },
      {
        path: '/laporan-pendapatan-lalin', element: <ReportDataLalin/>,
        //  loader: dashboardLoader,
      },
      {
        path: '/report-data', element: <ReportData/>,
        //  loader: dashboardLoader,
      },
      {
        path: '/role-master', element: <RoleMaster/>,
        //  loader: dashboardLoader,
      },
      {
        path: '/role-management-user', element: <RoleManagementUser/>,
        //  loader: dashboardLoader,
      },
    ],
  },
  {
    path: '/template', element: <Template/>,
    //  loader: dashboardLoader,
  },
  {
    path: '/login', element: <Login/>
  },
  // {
  //   path: 'logout', action: logoutAction
  // }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
