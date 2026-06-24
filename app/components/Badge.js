import styles from '@/styles/Ui.module.css';

export default function Badge({ children, tone = 'neutral' }) {
  return <span className={`${styles.badge} ${styles[`badge_${tone}`]}`}>{children}</span>;
}
