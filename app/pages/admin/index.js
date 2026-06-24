import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import usuariosService from '@/services/usuariosService';
import clientesService from '@/services/clientesService';
import tiposRoupaService from '@/services/tiposRoupaService';
import servicosService from '@/services/servicosService';
import pedidosService from '@/services/pedidosService';
import pedidoItensService from '@/services/pedidoItensService';
import pedidoItemServicosService from '@/services/pedidoItemServicosService';
import styles from '@/styles/Dashboard.module.css';

const CARTOES = [
  { chave: 'pedidos', label: 'Pedidos', href: '/admin/pedidos', servico: pedidosService, sigla: 'PD' },
  { chave: 'clientes', label: 'Clientes', href: '/admin/clientes', servico: clientesService, sigla: 'CL' },
  { chave: 'servicos', label: 'Serviços', href: '/admin/servicos', servico: servicosService, sigla: 'SV' },
  { chave: 'tiposRoupa', label: 'Tipos de roupa', href: '/admin/tipos-roupa', servico: tiposRoupaService, sigla: 'TR' },
  { chave: 'pedidoItens', label: 'Itens de pedido', href: '/admin/pedido-itens', servico: pedidoItensService, sigla: 'PI' },
  { chave: 'pedidoItemServicos', label: 'Serviços de item', href: '/admin/pedido-item-servicos', servico: pedidoItemServicosService, sigla: 'SI' },
  { chave: 'usuarios', label: 'Usuários', href: '/admin/usuarios', servico: usuariosService, sigla: 'US' },
];

function AdminDashboard() {
  const { usuario } = useAuth();
  const [contagens, setContagens] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const resultados = await Promise.all(
          CARTOES.map((c) => c.servico.listar().then((r) => [c.chave, r.data.length]))
        );
        if (ativo) {
          setContagens(Object.fromEntries(resultados));
          setOffline(false);
        }
      } catch {
        if (ativo) setOffline(true);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  return (
    <AdminLayout
      title={`Olá, ${usuario?.nome?.split(' ')[0] || ''}`}
      subtitle="Visão geral do sistema de controle de lavanderia."
    >
      {offline && (
        <div className={styles.offlineBanner}>
          Não foi possível conectar à API em <code>http://localhost:3000</code>. Inicie o servidor da API
          (Projeto 1) para ver os dados.
        </div>
      )}

      <div className={styles.grid}>
        {CARTOES.map((c) => (
          <a key={c.chave} href={c.href} className={styles.card}>
            <span className={styles.cardSigla}>{c.sigla}</span>
            <div className={styles.cardBody}>
              <span className={styles.cardLabel}>{c.label}</span>
              <span className={styles.cardValue}>
                {carregando ? '—' : offline ? '—' : contagens[c.chave] ?? 0}
              </span>
            </div>
          </a>
        ))}
      </div>
    </AdminLayout>
  );
}

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Painel · Controle de Lavanderia</title>
      </Head>
      <RotaProtegida>
        <AdminDashboard />
      </RotaProtegida>
    </>
  );
}
