import classes from './Header.module.css';

import { Link, Form } from 'react-router-dom';
import { 
  DownOutlined, 
  FundOutlined, 
  BorderOutlined, 
  UserOutlined, 
  UsergroupAddOutlined, 
  DatabaseOutlined, 
  ClockCircleOutlined,
  SwapOutlined,
  BookOutlined,
  DollarOutlined,
  ExceptionOutlined,
  NodeCollapseOutlined,
  SendOutlined,
  MedicineBoxOutlined,
  TranslationOutlined,
  MoneyCollectOutlined,
  BankOutlined,
  PayCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  AuditOutlined,
  TeamOutlined,
  AliwangwangOutlined,
  FieldTimeOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const items = [
  {
    key: '1',
    label: <Link className={classes.dropdown} to="/">Dashboard</Link>,
    icon: <FundOutlined />
  },
  {
    key: '2',
    label: <Link className={classes.dropdown} to="/monitor">Monitor</Link>,
    icon: <BorderOutlined />
  },
  {
    key: '3',
    label: <Link className={classes.dropdown} to="/leader">Leader Organisasi</Link>,
    icon: <UsergroupAddOutlined />
  },
];

const cronItems = [
  {
    key: '1',
    label: 'Profile',
    icon: <UserOutlined />,
    children: [
      {
        key: '1-1',
        label: <Link className={classes.dropdown} to="#">Personal Data</Link>,
        icon: <UserOutlined />,
        children: [
          {
            key: '1-1-1',
            label: <Link className={classes.dropdown} to="/kiriman-personal-data">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-1-2',
            label: <Link className={classes.dropdown} to="/run-personal-data">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '1-2',
        label: <Link className={classes.dropdown} to="#">Personal ID</Link>,
        icon: <ExceptionOutlined />,
        children: [
          {
            key: '1-2-1',
            label: <Link className={classes.dropdown} to="/kiriman-personal-id">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-2-2',
            label: <Link className={classes.dropdown} to="/run-personal-id">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '1-3',
        label: <Link className={classes.dropdown} to="/kiriman-bpjs-kes">BPJS Kes</Link>,
        icon: <MedicineBoxOutlined />,
        children: [
          {
            key: '1-3-1',
            label: <Link className={classes.dropdown} to="/kiriman-bpjs-kes">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-3-2',
            label: <Link className={classes.dropdown} to="/run-bpjs-kes">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '1-4',
        label: <Link className={classes.dropdown} to="/kiriman-bpjs-tk">BPJS TK</Link>,
        icon: <TranslationOutlined />,
        children: [
          {
            key: '1-4-1',
            label: <Link className={classes.dropdown} to="/kiriman-bpjs-tk">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-4-2',
            label: <Link className={classes.dropdown} to="/run-bpjs-tk">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '1-5',
        label: <Link className={classes.dropdown} to="/kiriman-tax-id">Tax ID</Link>,
        icon: <MoneyCollectOutlined />,
        children: [
          {
            key: '1-5-1',
            label: <Link className={classes.dropdown} to="/kiriman-tax-id">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-5-2',
            label: <Link className={classes.dropdown} to="/run-tax-id">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '1-6',
        label: <Link className={classes.dropdown} to="/kiriman-address">Address</Link>,
        icon: <BankOutlined />,
        children: [
          {
            key: '1-6-1',
            label: <Link className={classes.dropdown} to="/kiriman-address">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '1-6-2',
            label: <Link className={classes.dropdown} to="/run-address">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
    ],
  },
  {
    key: '2',
    label: 'Mobility',
    icon: <SwapOutlined />,
    children: [
      {
        key: '2-1',
        label: <Link className={classes.dropdown} to="#">OM Action</Link>,
        icon: <ReloadOutlined />,
        children: [
          {
            key: '2-1-1',
            label: <Link className={classes.dropdown} to="/kiriman-om-action">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '2-1-2',
            label: <Link className={classes.dropdown} to="/run-om-action">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '2-2',
        label: <Link className={classes.dropdown} to="#">Approver</Link>,
        icon: <UserSwitchOutlined />,
        children: [
          {
            key: '2-2-1',
            label: <Link className={classes.dropdown} to="/kiriman-approver">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '2-2-2',
            label: <Link className={classes.dropdown} to="#">Jalankan Cron</Link>,
            icon: <LoadingOutlined />,
            disabled: true
          },
        ]
      },
      {
        key: '2-3',
        label: <Link className={classes.dropdown} to="#">Document</Link>,
        icon: <AuditOutlined />,
        children: [
          {
            key: '2-3-1',
            label: <Link className={classes.dropdown} to="/kiriman-document">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '2-3-2',
            label: <Link className={classes.dropdown} to="/run-document">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
      {
        key: '2-4',
        label: <Link className={classes.dropdown} to="#">Leader Organisasi</Link>,
        icon: <AliwangwangOutlined />,
        children: [
          {
            key: '2-4-1',
            label: <Link className={classes.dropdown} to="/kiriman-leader-org">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '2-4-2',
            label: <Link className={classes.dropdown} to="/run-leader-org">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ]
      },
    ],
  },
  {
    key: '3',
    label: 'Education',
    icon: <BookOutlined />,
    children: [
      {
        key: '3-1',
        label: <Link className={classes.dropdown} to="/kiriman-education">Cek Kiriman</Link>,
        icon: <NodeCollapseOutlined />
      },
      {
        key: '3-2',
        label: <Link className={classes.dropdown} to="/run-education">Jalankan Cron</Link>,
        icon: <SendOutlined />
      },
    ],
  },
  {
    key: '4',
    label: 'Finance',
    icon: <DollarOutlined />,
    children: [
      {
        key: '4-1',
        label: <Link className={classes.dropdown} to="#">Payslip</Link>,
        icon: <PayCircleOutlined />,
        children: [
          {
            key: '4-1-1',
            label: <Link className={classes.dropdown} to="/kiriman-payslip">Cek Kiriman</Link>,
            icon: <NodeCollapseOutlined />
          },
          {
            key: '4-1-2',
            label: <Link className={classes.dropdown} to="/run-payslip">Jalankan Cron</Link>,
            icon: <SendOutlined />
          },
        ],
      }
    ],
  },
  {
    key: '5',
    label: 'Family',
    icon: <TeamOutlined />,
    children: [
      {
        key: '5-1',
        label: <Link className={classes.dropdown} to="/kiriman-family">Cek Kiriman</Link>,
        icon: <NodeCollapseOutlined />
      },
      {
        key: '5-2',
        label: <Link className={classes.dropdown} to="run-family">Jalankan Cron</Link>,
        icon: <SendOutlined />
      },
    ],
  },
  {
    key: '6',
    label: 'Masa Kerja',
    icon: <FieldTimeOutlined />,
    children: [
      {
        key: '6-1',
        label: <Link className={classes.dropdown} to="/masa-kerja">Sinkronisasi</Link>,
        icon: <SyncOutlined />
      },
    ],
  },
]

const Header = () => {
  return (
    <nav>
      <ul className={classes.menu}>
        <li>
          <Link to="/">
            <img src="logo.png" alt="Logo" className={classes.logo}></img>
          </Link>
        </li>
        <li className={classes.dropdown}>
          <Dropdown
            menu={{ items: items }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Main Menu
                <DatabaseOutlined />
              </Space>
            </a>
          </Dropdown>
        </li>
        <li className={classes.dropdown}>
          <Dropdown
            menu={{ items: cronItems }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Cron Menu
                <ClockCircleOutlined />
              </Space>
            </a>
          </Dropdown>
        </li>
      </ul>
      <div className={classes['mobile-menu']}>
        <Dropdown
          menu={{ items: items }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Main Menu
              <DatabaseOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <div className={classes['mobile-menu']}>
        <Dropdown
          menu={{ items: cronItems }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Cron Menu
              <ClockCircleOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <Link to="/" className={classes.setting}><i className="fa-solid fa-gear"></i></Link>
      <Form action="/logout" method="post">
        <button className={classes.logout}><i className="fa-solid fa-right-from-bracket"></i></button>
      </Form>
    </nav>
  )
}

export default Header