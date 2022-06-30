import styles from "../../../styles/event.module.css";

export const EventShow = ({ event }) => {
  return (
    <div>
      <div
        className={styles.event_banner}
        style={{
          backgroundImage: `url(${event.data.attributes["original-image-url"]})`,
        }}
      >
        <div className={styles.event_banner_title}>
        <img src={event.data.attributes["logo-url"]} width={100} />

          {event.data.attributes.name}
          </div>
      </div>
      
      
    </div>
  );
};
