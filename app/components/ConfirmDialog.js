import Button from './Button';
import styles from '@/styles/ConfirmDialog.module.css';

export default function ConfirmDialog({ aberto, titulo, descricao, onConfirmar, onCancelar, carregando }) {
  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onCancelar}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3>{titulo}</h3>
        <p>{descricao}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmar} disabled={carregando}>
            {carregando ? 'Removendo…' : 'Sim, remover'}
          </Button>
        </div>
      </div>
    </div>
  );
}
