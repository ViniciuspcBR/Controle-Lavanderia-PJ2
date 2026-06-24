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
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import pedidoItemServicosService from '@/services/pedidoItemServicosService';
import servicosService from '@/services/servicosService';
import uiStyles from '@/styles/Ui.module.css';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function DetalhePedidoItem() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [tipoNome, setTipoNome] = useState('');
  const [servicosVinculados, setServicosVinculados] = useState([]);
  const [servicosPorId, setServicosPorId] = useState({});
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    async function carregar() {
      try {
        const { data } = await pedidoItensService.buscarPorId(id);
        setItem(data);

        const { data: tipo } = await tiposRoupaService.buscarPorId(data.tipo_roupa_id).catch(() => ({ data: null }));
        setTipoNome(tipo?.nome || '—');

        const { data: servicos } = await servicosService.listar();
        setServicosPorId(Object.fromEntries(servicos.map((s) => [s.id, s.nome])));

        const { data: vinculados } = await pedidoItemServicosService.buscarPorItem(id).catch(() => ({ data: [] }));
        setServicosVinculados(vinculados);
      } catch {
        setErro('Item de pedido não encontrado.');
      }
    }
    carregar();
  }, [id]);

  return (
    <AdminLayout title="Detalhes do item de pedido" subtitle="Informações completas e serviços aplicados a este item.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Tipo de roupa" value={tipoNome} />
            <ReadField label="Quantidade" value={item.quantidade} />
            <div style={{ marginBottom: 18 }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 5px',
              }}>Status</p>
              <Badge tone="neutral">{item.status || '—'}</Badge>
            </div>
            <ReadField label="Valor total" value={formatarPreco(item.valor_total)} />
            <ReadField label="Descrição" value={item.descricao} />

            <div className={uiStyles.formActions} style={{ marginBottom: 24 }}>
              <Button href={`/admin/pedido-itens/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/pedido-itens">Voltar</Button>
            </div>

            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 10px',
              }}>Serviços aplicados</p>

              {servicosVinculados.length === 0 ? (
                <p style={{ color: 'var(--color-ink-soft)', fontSize: 14 }}>
                  Nenhum serviço vinculado a este item.{' '}
                  <a href={`/admin/pedido-item-servicos/create?pedido_item_id=${item._id}`} style={{ color: 'var(--color-teal-700)', fontWeight: 500 }}>
                    Adicionar serviço
                  </a>
                </p>
              ) : (
                <div className={uiStyles.tableWrap}>
                  <table className={uiStyles.table}>
                    <thead>
                      <tr>
                        <th>Serviço</th>
                        <th>Preço unitário</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicosVinculados.map((s) => (
                        <tr key={s._id}>
                          <td>{servicosPorId[s.servico_id] || '—'}</td>
                          <td>{formatarPreco(s.preco_unitario)}</td>
                          <td>{s.quantidade}</td>
                          <td>{formatarPreco(s.valor_total)}</td>
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

export default function DetalhePedidoItemPage() {
  return (
    <>
      <Head><title>Detalhes do item de pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalhePedidoItem /></RotaProtegida>
    </>
  );
}
