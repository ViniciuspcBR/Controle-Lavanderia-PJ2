import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import pedidoItemServicosService from '@/services/pedidoItemServicosService';
import servicosService from '@/services/servicosService';
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ListaPedidoItemServicos() {
  const [itens, setItens] = useState([]);
  const [servicosPorId, setServicosPorId] = useState({});
  const [itensLabel, setItensLabel] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const [vinculosRes, servicosRes, pedidoItensRes, tiposRes] = await Promise.all([
        pedidoItemServicosService.listar(),
        servicosService.listar(),
        pedidoItensService.listar(),
        tiposRoupaService.listar(),
      ]);
      setItens(vinculosRes.data);
      setServicosPorId(Object.fromEntries(servicosRes.data.map((s) => [String(s._id), s.nome])));

      const tiposPorId = Object.fromEntries(tiposRes.data.map((t) => [String(t._id), t.nome]));
      setItensLabel(Object.fromEntries(
        pedidoItensRes.data.map((pi) => [String(pi._id), `${tiposPorId[pi.tipo_roupa_id] || 'Item'} (qtd. ${pi.quantidade})`])
      ));
    } catch {
      setErro('Não foi possível carregar os serviços de itens. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await pedidoItemServicosService.remover(paraRemover._id);
      setItens((atual) => atual.filter((i) => i._id !== paraRemover._id));
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este vínculo de serviço.');
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout
      title="Serviços do item do pedido"
      subtitle="Serviços aplicados a cada peça (ex: lavagem + passadoria no mesmo item)."
      actions={<Button href="/admin/pedido-item-servicos/create" variant="accent">+ Vincular serviço</Button>}
    >
      <Alert type="error">{erro}</Alert>

      <div className={uiStyles.tableWrap}>
        {carregando ? (
          <EmptyState title="Carregando…" description="Buscando vínculos cadastrados." />
        ) : itens.length === 0 ? (
          <EmptyState title="Nenhum vínculo encontrado" description="Vincule o primeiro serviço a um item de pedido." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Item do pedido</th>
                <th>Serviço</th>
                <th>Preço unitário</th>
                <th>Quantidade</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item._id}>
                  <td>{itensLabel[item.pedido_item_id] || 'Item não encontrado'}</td>
                  <td><strong>{servicosPorId[item.servico_id] || 'Serviço não encontrado'}</strong></td>
                  <td>{formatarPreco(item.preco_unitario)}</td>
                  <td>{item.quantidade}</td>
                  <td>{formatarPreco(item.valor_total)}</td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/pedido-item-servicos/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/pedido-item-servicos/update/${item._id}`} title="Editar">✎</a>
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
        titulo="Remover vínculo de serviço?"
        descricao="Tem certeza que deseja remover este vínculo? Essa ação não pode ser desfeita."
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
      <Assinatura nome="Vilson Vinicius" />
    </AdminLayout>
  );
}

export default function PedidoItemServicosPage() {
  return (
    <>
      <Head><title>Serviços do item do pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaPedidoItemServicos /></RotaProtegida>
    </>
  );
}
