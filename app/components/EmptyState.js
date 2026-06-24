import styles from '@/styles/Ui.module.css';

export default function EmptyState({ title, description }) {
  return (
    <div className={styles.empty}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
