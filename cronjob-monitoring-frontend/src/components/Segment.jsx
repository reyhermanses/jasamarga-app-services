import classes from './Segment.module.css';

import 'chart.js/auto';
import Chart from './Chart';
import Table from './Table';
import { useSelector } from 'react-redux';

const Segment = ({title, isChart ,columns, rows, endpoint}) => {

  const dataSummary = useSelector((state) => state.summary);

  let loadingScreen = <>
    <div className={classes['loading-circle']}></div>
    <div className={classes.backdrop}></div>
  </>;

  const isLoading = false;
  let cronError = dataSummary.status !== 'success';

  if (!isLoading) {
    loadingScreen = '';
  }
  
  return (
    <div className={classes.container}>
      <div className={classes.title}>
      <h3>{title}</h3>
      </div>
      {loadingScreen}
      { cronError ? <div className={classes['failed-cronjob']}>
        <h1>
          CRONJOB TIDAK BERJALAN
        </h1>
      </div> : isChart ? <Chart/> : <Table columns={columns} rows={rows} /> }
    </div>
  )
}

export default Segment;