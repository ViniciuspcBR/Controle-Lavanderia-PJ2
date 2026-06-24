import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/AdminLayout.module.css';

const MENU = [
  { grupo: 'Operação', itens: [
    { href: '/admin/pedidos', label: 'Pedidos', sigla: 'PD' },
    { href: '/admin/pedido-itens', label: 'Itens do pedido', sigla: 'PI' },
    { href: '/admin/pedido-item-servicos', label: 'Serviços do item', sigla: 'SI' },
  ]},
  { grupo: 'Cadastros', itens: [
    { href: '/admin/clientes', label: 'Clientes', sigla: 'CL' },
    { href: '/admin/servicos', label: 'Serviços', sigla: 'SV' },
    { href: '/admin/tipos-roupa', label: 'Tipos de roupa', sigla: 'TR' },
    { href: '/admin/usuarios', label: 'Usuários', sigla: 'US' },
  ]},
];

export default function AdminLayout({ title, subtitle, actions, children }) {
  const router = useRouter();
  const { usuario, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>CL</span>
          <span className={styles.brandText}>
            Controle de<br />Lavanderia
          </span>
        </Link>

        <nav className={styles.nav}>
          {MENU.map((grupo) => (
            <div key={grupo.grupo} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{grupo.grupo}</p>
              {grupo.itens.map((item) => {
                const ativo = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${ativo ? styles.navItemAtivo : ''}`}
                  >
                    <span className={styles.navSigla}>{item.sigla}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.userBox}>
          <div className={styles.userAvatar}>
            {(usuario?.nome || '?').charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <strong>{usuario?.nome}</strong>
            <span>{usuario?.perfil}</span>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Sair">
            ⏻
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div>
            <h1>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.headerActions}>{actions}</div>}
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
