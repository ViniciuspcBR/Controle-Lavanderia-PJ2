import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidoItemServicosService from '@/services/pedidoItemServicosService';
import servicosService from '@/services/servicosService';
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function DetalhePedidoItemServico() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [servicoNome, setServicoNome] = useState('');
  const [itemLabel, setItemLabel] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    async function carregar() {
      try {
        const { data } = await pedidoItemServicosService.buscarPorId(id);
        setItem(data);

        const { data: servico } = await servicosService.buscarPorId(data.servico_id).catch(() => ({ data: null }));
        setServicoNome(servico?.nome || '—');

        const { data: pedidoItem } = await pedidoItensService.buscarPorId(data.pedido_item_id).catch(() => ({ data: null }));
        if (pedidoItem) {
          const { data: tipo } = await tiposRoupaService.buscarPorId(pedidoItem.tipo_roupa_id).catch(() => ({ data: null }));
          setItemLabel(`${tipo?.nome || 'Item'} — qtd. ${pedidoItem.quantidade}`);
        }
      } catch {
        setErro('Vínculo não encontrado.');
      }
    }
    carregar();
  }, [id]);

  return (
    <AdminLayout title="Detalhes do vínculo de serviço" subtitle="Informações completas deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Item do pedido" value={itemLabel} />
            <ReadField label="Serviço" value={servicoNome} />
            <ReadField label="Preço unitário" value={formatarPreco(item.preco_unitario)} />
            <ReadField label="Quantidade" value={item.quantidade} />
            <ReadField label="Valor total" value={formatarPreco(item.valor_total)} />
            <div className={uiStyles.formActions}>
              <Button href={`/admin/pedido-item-servicos/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/pedido-item-servicos">Voltar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function DetalhePedidoItemServicoPage() {
  return (
    <>
      <Head><title>Detalhes do vínculo · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalhePedidoItemServico /></RotaProtegida>
    </>
  );
}
