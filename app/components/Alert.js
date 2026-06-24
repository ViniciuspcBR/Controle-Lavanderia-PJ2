import styles from '@/styles/Ui.module.css';

export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`${styles.alert} ${styles[`alert_${type}`]}`}>{children}</div>;
}
