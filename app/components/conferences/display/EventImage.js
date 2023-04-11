import {
  Form,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import AvatarEditor from 'react-avatar-editor';
import styles from '../../../styles/EventImage.module.css';
import { useRef, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

export const EventImage = ({ handleImageChange }) => {

  const editorRef = useRef(null);

  const [picture, setPicture] = useState({
    isHeaderImage: true,
    cropperOpen: false,
    img: null,
    zoom: 1,
    width: null,
    croppedHeaderImg: null,
    croppedLogoImg: null,
  });

  const [headerLabelStyle, setHeaderLabelStyle] = useState({
    backgroundImage: null,
  });

  const [logoLabelStyle, setLogoLabelStyle] = useState({
    backgroundImage: null,
  });

  const [modalStyle, setModalStyle] = useState({
    width: null,
  });

  const [showEventUplaod, setShowEventUpload] = useState(false);

  const handleSlider = (event) => {
    setPicture((picture) => {
      return {
        ...picture,
        zoom: parseInt(event.target.value)
      }
    });
  };

  const handleFileChange = (e, imageType) => {
    setPicture((picture) => {
      return {
        ...picture,
        isHeaderImage: imageType === 'headerimage',
        img: e.target.files[0],
        cropperOpen: true,
        width: imageType === 'headerimage' ? 800 : 400,
      }
    });
    setModalStyle({
      width: imageType === 'headerimage' ? '70%' : '50%',
    })
  };

  const handleSave = async () => {
    const img = editorRef.current.getImage().toDataURL();
    if(picture.isHeaderImage) {
      setHeaderLabelStyle({
        backgroundImage: `url(${img})`,
      })
    }
    else {
      setLogoLabelStyle({
        backgroundImage: `url(${img})`,
      })
    }
    setPicture((picture) => {
      return {
        ...picture,
        cropperOpen: false,
        croppedHeaderImg: picture.isHeaderImage ? img : picture.croppedHeaderImg,
        croppedLogoImg: !picture.isHeaderImage ? img : picture.croppedLogoImg,
      }
    });
    handleImageChange(picture.isHeaderImage ? 'headerimage' : 'logoimage', img);
  };

  const closeEditor = () => {
    setPicture((picture) => {
      return {
        ...picture,
        cropperOpen: false,
      }
    })
  }

  const resetSize = () => {
    setPicture((picture) => {
      return {
        ...picture,
        zoom: 1,
      }
    })
  }

  const toggleUploadImage = () => {
    setShowEventUpload(prev => !prev)
  }

  return (
    <>
      {picture.cropperOpen && (
        <>
          <div className={styles.backdrop} />
          <Card className={styles.modal} style={modalStyle}>
            <Card body>
              Crop Image 
              <div className={styles.cross}>
                <RxCross1 onClick={closeEditor} />
              </div>
            </Card>
            <AvatarEditor 
              ref={editorRef}
              image={picture.img}
              width={picture.width}
              height={400}
              border={40}
              color={[255, 255, 255, 0.6]}
              rotate={0}
              style={{
                width: '100%',
                height: '100%',
              }}
              scale={picture.zoom}
            />
            <input type="range" min="1" max="10" value={picture.zoom} onChange={handleSlider} className={styles.slider} />
            <div className={styles.buttonClass}>
              <Button variant="success" onClick={handleSave}>Looks good</Button>{' '}
              <Button style={{ marginRight: '10px'}} variant="dark" onClick={resetSize}>Reset</Button>{' '}
            </div>
          </Card>
        </>
      )}
      <Button variant="outline-dark" onClick={toggleUploadImage}>Add/Upload event header</Button>{' '}
      <Form.Group className="mb-3">
        <Row className={styles.eventUpload}>
          <Col className={`${showEventUplaod ? styles.showDiv : styles.hideDiv} ${styles.eventUploadOptions}`} lg={8}>
            <Form.Label style={headerLabelStyle} className={styles.eventUploadLabel}>
              <AiFillCamera className={styles.eventUploadIcon} />
              <Form.Control
                className={styles.eventUploadInput}
                name="headerimage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e,'headerimage')}
              />
            </Form.Label>
          </Col>
          <Col className={`${showEventUplaod ? styles.showDiv : styles.hideDiv} ${styles.logoUploadOptions}`} >
            <Form.Label style={logoLabelStyle} className={styles.eventUploadLogo}>
                <BsFillImageFill className={styles.eventUploadIconPic} />
                <Form.Control
                  className={styles.eventUploadInput}
                  name="logoimage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e,'logoimage')}
                />
            </Form.Label>
          </Col>
        </Row>
      </Form.Group>
    </>
  )
};