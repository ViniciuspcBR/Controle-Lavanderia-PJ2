import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ListaPedidoItens() {
  const [itens, setItens] = useState([]);
  const [tiposPorId, setTiposPorId] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const [itensRes, tiposRes] = await Promise.all([
        pedidoItensService.listar(),
        tiposRoupaService.listar(),
      ]);
      setItens(itensRes.data);
      setTiposPorId(Object.fromEntries(tiposRes.data.map((t) => [String(t._id), t.nome])));
    } catch {
      setErro('Não foi possível carregar os itens de pedido. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await pedidoItensService.remover(paraRemover._id);
      setItens((atual) => atual.filter((i) => i._id !== paraRemover._id));
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este item.');
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout
      title="Itens do pedido"
      subtitle="Peças individuais que compõem cada pedido."
      actions={<Button href="/admin/pedido-itens/create" variant="accent">+ Novo item</Button>}
    >
      <Alert type="error">{erro}</Alert>

      <div className={uiStyles.tableWrap}>
        {carregando ? (
          <EmptyState title="Carregando…" description="Buscando itens de pedido cadastrados." />
        ) : itens.length === 0 ? (
          <EmptyState title="Nenhum item encontrado" description="Cadastre o primeiro item de pedido para começar." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Tipo de roupa</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item._id}>
                  <td><strong>{tiposPorId[item.tipo_roupa_id] || 'Tipo não encontrado'}</strong></td>
                  <td>{item.quantidade}</td>
                  <td><Badge tone="neutral">{item.status || '—'}</Badge></td>
                  <td>{formatarPreco(item.valor_total)}</td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/pedido-itens/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/pedido-itens/update/${item._id}`} title="Editar">✎</a>
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
        titulo="Remover item do pedido?"
        descricao="Tem certeza que deseja remover este item? Essa ação não pode ser desfeita."
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
    </AdminLayout>
  );
}

export default function PedidoItensPage() {
  return (
    <>
      <Head><title>Itens do pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaPedidoItens /></RotaProtegida>
    </>
  );
}
