import Link from 'next/link';
import styles from '@/styles/Ui.module.css';

export default function Button({
  children,
  variant = 'primary',
  href,
  type = 'button',
  onClick,
  disabled,
  full,
}) {
  const className = `${styles.btn} ${styles[`btn_${variant}`]} ${full ? styles.btnFull : ''}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
