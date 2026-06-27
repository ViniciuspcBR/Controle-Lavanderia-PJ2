import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import pedidosService from '@/services/pedidosService';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

const TONS_STATUS = {
  recebido: 'neutral',
  em_andamento: 'warn',
  pronto: 'ok',
  entregue: 'ok',
  cancelado: 'danger',
};

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

function ListaPedidos() {
  const [itens, setItens] = useState([]);
  const [clientesPorId, setClientesPorId] = useState({});
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const [pedidosRes, clientesRes] = await Promise.all([
        pedidosService.listar(),
        clientesService.listar(),
      ]);
      setItens(pedidosRes.data);
      setClientesPorId(Object.fromEntries(clientesRes.data.map((c) => [String(c._id), c.nome])));
    } catch {
      setErro('Não foi possível carregar os pedidos. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await pedidosService.remover(paraRemover._id);
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este pedido.');
    } finally {
      setRemovendo(false);
    }
  }

  const itensFiltrados = busca
    ? itens.filter((i) =>
        String(i._id).includes(busca) ||
        (i.status || '').toLowerCase().includes(busca.toLowerCase()) ||
        (i.data_entrada && new Date(i.data_entrada).toLocaleDateString('pt-BR').includes(busca)) ||
        (i.data_prevista && new Date(i.data_prevista).toLocaleDateString('pt-BR').includes(busca)) ||
        (clientesPorId[String(i.cliente_id)] || '').toLowerCase().includes(busca.toLowerCase())
      )
    : itens;

  return (
    <AdminLayout
      title="Pedidos"
      subtitle="Pedidos de lavagem em andamento e finalizados."
      actions={<Button href="/admin/pedidos/create" variant="accent">+ Novo pedido</Button>}
    >
      <Alert type="error">{erro}</Alert>

      <input
        className={uiStyles.searchInput}
        placeholder="Buscar por cliente, status, data ou ID…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className={uiStyles.tableWrap}>
        {carregando ? (
          <EmptyState title="Carregando…" description="Buscando pedidos cadastrados." />
        ) : itensFiltrados.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Cadastre o primeiro pedido para começar." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Status</th>
                <th>Entrada</th>
                <th>Previsão</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item._id}>
                  <td><strong>Pedido #{itens.indexOf(item) + 1} — {clientesPorId[String(item.cliente_id)] || 'Cliente não encontrado'}</strong></td>
                  <td><Badge tone={TONS_STATUS[item.status] || 'neutral'}>{(item.status || '—').replace('_', ' ')}</Badge></td>
                  <td>{formatarData(item.data_entrada)}</td>
                  <td>{formatarData(item.data_prevista)}</td>
                  <td>{formatarPreco(item.valor_total)}</td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/pedidos/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/pedidos/update/${item._id}`} title="Editar">✎</a>
                      <button
                        className={`${uiStyles.iconBtn} ${uiStyles.iconBtnDanger}`}
                        title="Remover"
                        onClick={() => setParaRemover(item)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        aberto={!!paraRemover}
        titulo="Remover pedido?"
        descricao="Tem certeza que deseja remover este pedido? Essa ação não pode ser desfeita."
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
      <Assinatura nome="João Vitor" />
    </AdminLayout>
  );
}

export default function PedidosPage() {
  return (
    <>
      <Head><title>Pedidos · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaPedidos /></RotaProtegida>
    </>
  );
}
