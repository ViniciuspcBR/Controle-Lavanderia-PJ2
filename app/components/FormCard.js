import styles from '@/styles/Ui.module.css';

export default function FormCard({ children }) {
  return (
    <div className={styles.card} style={{ padding: 28, maxWidth: 720 }}>
      {children}
    </div>
  );
}
