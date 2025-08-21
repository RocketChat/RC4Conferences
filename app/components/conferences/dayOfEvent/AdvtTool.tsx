import { useState } from "react";
import { ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { FaBug, FaInfo, FaStar } from "react-icons/fa";
import styles from "../../../styles/Mainstage.module.css";

// React functional component to show two buttons which expands and collapses a div

export const AdvtButtons = ({ repoUrl }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props.message}
    </Tooltip>
  );

  return (
    <div className={styles.side_button}>
      <ButtonGroup vertical>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip({ message: "Star this Project" })}
        >
          <Button
            variant="outline-warning"
            href={`${repoUrl}/stargazers`}
            target="_blank"
            className={styles.advt_button}
          >
            <FaStar />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip({ message: "Read about this project" })}
        >
          <Button
            variant="outline-info"
            href={`${repoUrl}/blob/main/README.md`}
            target="_blank"
            className={styles.advt_button}
          >
            <FaInfo />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip({ message: "Report a bug" })}
        >
          <Button
            target="_blank"
            variant="outline-danger"
            href={`${repoUrl}/issues/new`}
            className={styles.advt_button}
          >
            <FaBug />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    </div>
  );
};
