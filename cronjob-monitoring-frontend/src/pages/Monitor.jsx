import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import axios from "axios";

import '../index.css';
import Segment from "../components/Segment";
import { monitoring } from "../redux/header/action";
import { fetchData } from "../redux/summary/action";

// column OM ACTION 2
const columnsOmAction = [
  { field: 'id', headerName: 'no', width: 50, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'begin_date', headerName: 'begin date', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'end_date', headerName: 'end date', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'personnel_number', headerName: 'personnel number', width: 150, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'name', headerName: 'name', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'action', headerName: 'action', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'emp_status', headerName: 'emp status', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'personal_area', headerName: 'personal area', width: 100, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_personal_area', headerName: 'text personal area', width: 150, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'employee_group', headerName: 'employee group', width: 150, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_employee_group', headerName: 'text employee group', width: 150, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'personal_sub_area', headerName: 'personal sub area', width: 150, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_personal_subarea', headerName: 'text personal sub area', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'cost_center', headerName: 'cost center', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'organisasi_key', headerName: 'organisasi key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_organisasi_key', headerName: 'text organisasi key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'position_key', headerName: 'position key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_position_key', headerName: 'text position key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'job_key', headerName: 'job key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_job_key', headerName: 'text job key', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'section', headerName: 'section', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) },
  { field: 'text_section', headerName: 'text section', width: 170, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ) }
];

const columnDocumentConfigurations = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'personnel_number', headerName: 'Personnel Number', width: 150 },
  { field: 'subtype', headerName: 'Subtype', width: 100 },
  { field: 'valid_from', headerName: 'Valid From', width: 120 },
  { field: 'valid_to', headerName: 'Valid To', width: 120 },
  { field: 'doc_type', headerName: 'Document Type', width: 150 },
  { field: 'doc_country', headerName: 'Document Country', width: 150 },
  { field: 'doc_number', headerName: 'Document Number', width: 150 },
  { field: 'issue_date', headerName: 'Issue Date', width: 120 },
  { field: 'issue_place', headerName: 'Issue Place', width: 150 },
  { field: 'issue_ctry', headerName: 'Issue Country', width: 150 },
  { field: 'doc_status', headerName: 'Document Status', width: 150 },
  { field: 'location', headerName: 'Location', width: 100 },
  { field: 'tanggal_efektif_sk', headerName: 'Effective Date', width: 150 },
  { field: 'change_on', headerName: 'Change On', width: 120 },
]

const columnsDocument = columnDocumentConfigurations.map(column => ({
  ...column,
  renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
      {params.value}
    </div>
  ),
}));

const Monitor = () => {
  const data = useLoaderData();
  const dispatch = useDispatch();
  let rowsOmAction = data.omAction.data.data
  let rowsDocument = data.document.data.data
  const dataPendingRequest = data.pendingRequest.data.data
  const columnsPendingRequest = dataPendingRequest.length > 0 ? Object.keys(dataPendingRequest[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;

  const dataOrgLeader = data.orgLeader.data.data
  const columnsOrgLeader = dataOrgLeader.length > 0 ? Object.keys(dataOrgLeader[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;

  const dataPersonalData = data.personalData.data.data
  const columnsPersonalData = dataPersonalData.length > 0 ? Object.keys(dataPersonalData[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;

  const dataApprover = data.approver.data.data
  const columnsApprover = dataApprover.length > 0 ? Object.keys(dataApprover[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataEducation = data.education.data.data
  const columnsEducation = dataEducation.length > 0 ? Object.keys(dataEducation[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataFamily = data.family.data.data
  const columnsFamily = dataFamily.length > 0 ? Object.keys(dataFamily[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataPersonalId = data.personalId.data.data
  const columnsPersonalId = dataPersonalId.length > 0 ? Object.keys(dataPersonalId[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataAddress = data.address.data.data
  const columnsAddress = dataAddress.length > 0 ? Object.keys(dataAddress[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataTaxId = data.taxId.data.data
  const columnsTaxId = dataTaxId.length > 0 ? Object.keys(dataTaxId[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataBpjsKes = data.bpjsKes.data.data
  const columnsBpjsKes = dataBpjsKes.length > 0 ? Object.keys(dataBpjsKes[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;
  
  const dataBpjsTK = data.bpjsTK.data.data
  const columnsBpjsTK = dataBpjsTK.length > 0 ? Object.keys(dataBpjsTK[0]).map(key => ({
    field: key,
    headerName: key,
    width: key === 'id' ? 50 : 250,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', overflow: 'visible' }}>
        {params.value}
      </div>
    )
  })) : [] ;

  useEffect(() => {
    dispatch(monitoring());
    dispatch(fetchData(data.summary.data));
  }, [dispatch, data.summary.data]);

  return (
    <>
      <Outlet/>
      <div className="container">
        <Segment title="OM ACTION" isChart={false} columns={columnsOmAction} rows={rowsOmAction} endpoint='' />
        <Segment title="DOCUMENT" isChart={false} columns={columnsDocument} rows={rowsDocument} endpoint='' />
        <Segment title="ORG LEADER" isChart={false} columns={columnsOrgLeader} rows={dataOrgLeader} endpoint='' />
        <Segment title="PENDING REQUESTS" isChart={false} columns={columnsPendingRequest} rows={dataPendingRequest} endpoint='' />
        <Segment title="APPROVER" isChart={false} columns={columnsApprover} rows={dataApprover} endpoint='' />
        <Segment title="PERSONAL DATA" isChart={false} columns={columnsPersonalData} rows={dataPersonalData} endpoint='' />
        <Segment title="EDUCATION" isChart={false} columns={columnsEducation} rows={dataEducation} endpoint='' />
        <Segment title="FAMILY" isChart={false} columns={columnsFamily} rows={dataFamily} endpoint='' />
        <Segment title="PERSONAL ID" isChart={false} columns={columnsPersonalId} rows={dataPersonalId} endpoint='' />
        <Segment title="ADDRESS" isChart={false} columns={columnsAddress} rows={dataAddress} endpoint='' />
        <Segment title="TAX ID" isChart={false} columns={columnsTaxId} rows={dataTaxId} endpoint='' />
        <Segment title="BPJS KES" isChart={false} columns={columnsBpjsKes} rows={dataBpjsKes} endpoint='' />
        <Segment title="BPJS TK" isChart={false} columns={columnsBpjsTK} rows={dataBpjsTK} endpoint='' />
      </div>
    </>
  )
}

export default Monitor;

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token
}

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return { status: false, data: redirect('/login') }
  }
  
  const expiration = new Date(JSON.parse(atob(token.split(".")[1])).exp);
  if (Date.now() >= expiration * 1000) {
    return { status: false, data: redirect('/login') }
  }

  return { status: true, data: token }
}

export const loader = async () => {

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
  
  const check = checkAuthLoader()
  if (!check.status) {
    return check.data
  }
  const config = {
    headers: {
      Authorization: `Bearer ${check.data}`,
    },
  };

  let summary = {}
  let omAction = {}
  let document = {}
  let pendingRequest = {}
  let orgLeader = {}
  let approver = {}
  let personalData = {}
  let education = {}
  let family = {}
  let personalId = {}
  let address = {}
  let taxId = {}
  let bpjsKes = {}
  let bpjsTK = {}

  try {
    const response = await axios.get(`${apiUrl}/cron/pending-request`, config)
    pendingRequest = response
  } catch (error) {
    return redirect('/login')
  }

  try {
    const response = await axios.get(`${apiUrl}/cron/summary`, config)
    summary = response
  } catch (error) {
    return redirect('/login')
  }

  try {
    const response = await axios.get(`${apiUrl}/cron/om-action`, config)
    omAction = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/document`, config)
    document = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/org-leader`, config)
    orgLeader = response
  } catch {
    return redirect('/login')
  }

  try {
    const response = await axios.get(`${apiUrl}/cron/approver`, config)
    approver = response
  } catch {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/personal-data`, config)
    personalData = response
  } catch {
    return redirect('/login')
  }

  try {
    const response = await axios.get(`${apiUrl}/cron/education`, config)
    education = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/family`, config)
    family = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/personal-id`, config)
    personalId = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/address`, config)
    address = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/tax-id`, config)
    taxId = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/bpjs-kes`, config)
    bpjsKes = response
  } catch (error) {
    return redirect('/login')
  }
  
  try {
    const response = await axios.get(`${apiUrl}/cron/bpjs-tk`, config)
    bpjsTK = response
  } catch (error) {
    return redirect('/login')
  }

  return { summary, omAction, document, orgLeader, pendingRequest, approver, personalData, education, family, personalId, address, taxId, bpjsKes, bpjsTK }
}