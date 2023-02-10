import React, { useState, useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';
import styles from '../styles/ShowToast.module.css'

export default function ShowToast(props) {
  const [show, setShow] = useState(true);
  return (
    <div className={styles.alert}>
     {show && <Alert variant={props.type === 'error' ? 'danger' : 'success'} onClose={() => setShow(false)} dismissible>
      {props.message}
     </Alert>}
    </div>
  );
}
