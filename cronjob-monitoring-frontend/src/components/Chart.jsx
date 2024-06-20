import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import classes from './Chart.module.css'

const Chart = () => {

  const dataSummary = useSelector((state) => state.summary);

  const data = {
    labels: ['Om-Action', 'Approver', 'Document', 'Organization', 'Family', 'Education', 'Peronal ID', 'Personal Data', 'Address', 'Tax ID', 'BPJS Kes', 'BPJS TK'],
    datasets: [
      {
        label: 'Jumlah Data',
        data: [dataSummary.data.om_action, dataSummary.data.approver, dataSummary.data.document, dataSummary.data.org, dataSummary.data.family, dataSummary.data.education, dataSummary.data.personal_id, dataSummary.data.personal_data, dataSummary.data.address, dataSummary.data.tax_id, dataSummary.data.bpjs_kes, dataSummary.data.bpjs_tk],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={classes.container}>
      <Bar data={data} />
    </div>
  );
};

export default Chart;
