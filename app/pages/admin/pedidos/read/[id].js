import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidosService from '@/services/pedidosService';
import clientesService from '@/services/clientesService';
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function DetalhePedido() {
  const router = useRouter();
  const { id } = router.query;
  const [pedido, setPedido] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
  const [itens, setItens] = useState([]);
  const [tiposPorId, setTiposPorId] = useState({});
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    async function carregar() {
      try {
        const { data: pedidoData } = await pedidosService.buscarPorId(id);
        setPedido(pedidoData);

        const { data: cliente } = await clientesService.buscarPorId(pedidoData.cliente_id).catch(() => ({ data: null }));
        setClienteNome(cliente?.nome || 'Cliente não encontrado');

        const { data: tipos } = await tiposRoupaService.listar();
        setTiposPorId(Object.fromEntries(tipos.map((t) => [String(t._id), t.nome])));

        const { data: itensData } = await pedidoItensService.buscarPorPedido(id).catch(() => ({ data: [] }));
        setItens(itensData);
      } catch {
        setErro('Pedido não encontrado.');
      }
    }
    carregar();
  }, [id]);

  return (
    <AdminLayout title="Detalhes do pedido" subtitle="Informações completas e itens deste pedido.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {pedido && (
          <>
            <ReadField label="Cliente" value={clienteNome} />
            <div style={{ marginBottom: 18 }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 5px',
              }}>Status</p>
              <Badge tone="neutral">{(pedido.status || '—').replace('_', ' ')}</Badge>
            </div>
            <ReadField label="Data de entrada" value={pedido.data_entrada && new Date(pedido.data_entrada).toLocaleDateString('pt-BR')} />
            <ReadField label="Previsão de entrega" value={pedido.data_prevista && new Date(pedido.data_prevista).toLocaleDateString('pt-BR')} />
            <ReadField label="Data de saída" value={pedido.data_saida && new Date(pedido.data_saida).toLocaleDateString('pt-BR')} />
            <ReadField label="Valor total" value={formatarPreco(pedido.valor_total)} />
            <ReadField label="Observações" value={pedido.observacoes} />

            <div className={uiStyles.formActions} style={{ marginBottom: 24 }}>
              <Button href={`/admin/pedidos/update/${pedido._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/pedidos">Voltar</Button>
            </div>

            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 10px',
              }}>Itens do pedido</p>

              {itens.length === 0 ? (
                <p style={{ color: 'var(--color-ink-soft)', fontSize: 14 }}>
                  Nenhum item cadastrado para este pedido.{' '}
                  <a href={`/admin/pedido-itens/create?pedido_id=${pedido._id}`} style={{ color: 'var(--color-teal-700)', fontWeight: 500 }}>
                    Adicionar item
                  </a>
                </p>
              ) : (
                <div className={uiStyles.tableWrap}>
                  <table className={uiStyles.table}>
                    <thead>
                      <tr>
                        <th>Tipo de roupa</th>
                        <th>Quantidade</th>
                        <th>Status</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item) => (
                        <tr key={item._id}>
                          <td>{tiposPorId[item.tipo_roupa_id] || '—'}</td>
                          <td>{item.quantidade}</td>
                          <td><Badge tone="neutral">{item.status || '—'}</Badge></td>
                          <td>{formatarPreco(item.valor_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function DetalhePedidoPage() {
  return (
    <>
      <Head><title>Detalhes do pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalhePedido /></RotaProtegida>
    </>
  );
}
