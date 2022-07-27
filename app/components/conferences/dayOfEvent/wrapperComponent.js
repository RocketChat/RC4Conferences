import styles from "../../../styles/event.module.css"
export const DoEWrapper = (props) => {
    return (
        <div className={styles.dayofevent_wrapper} >
            {props.children}
        </div>
    )
}