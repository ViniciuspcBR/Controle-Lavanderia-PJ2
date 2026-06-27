import styles from '@/styles/Assinatura.module.css';

export default function Assinatura({ nome }) {
  return (
    <div className={styles.assinatura}>
      Desenvolvido por <strong>{nome}</strong>
    </div>
  );
}
