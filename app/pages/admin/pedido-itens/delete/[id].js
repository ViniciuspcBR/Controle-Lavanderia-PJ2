import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidoItensService from '@/services/pedidoItensService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function RemoverPedidoItem() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [tipoNome, setTipoNome] = useState('');
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    pedidoItensService.buscarPorId(id)
      .then(async ({ data }) => {
        setItem(data);
        const { data: tipo } = await tiposRoupaService.buscarPorId(data.tipo_roupa_id).catch(() => ({ data: null }));
        setTipoNome(tipo?.nome || '—');
      })
      .catch(() => setErro('Item não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await pedidoItensService.remover(id);
      router.push('/admin/pedido-itens');
    } catch {
      setErro('Não foi possível remover este item.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover item de pedido" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente e não remove automaticamente os serviços vinculados a este item.
            </p>
            <ReadField label="Tipo de roupa" value={tipoNome} />
            <ReadField label="Quantidade" value={item.quantidade} />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/pedido-itens">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="Matheus Lenz" />
    </AdminLayout>
  );
}

export default function RemoverPedidoItemPage() {
  return (
    <>
      <Head><title>Remover item de pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverPedidoItem /></RotaProtegida>
    </>
  );
}
