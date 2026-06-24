import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidosService from '@/services/pedidosService';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';

function RemoverPedido() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    pedidosService.buscarPorId(id)
      .then(async ({ data }) => {
        setItem(data);
        const { data: cliente } = await clientesService.buscarPorId(data.cliente_id).catch(() => ({ data: null }));
        setClienteNome(cliente?.nome || 'Cliente não encontrado');
      })
      .catch(() => setErro('Pedido não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await pedidosService.remover(id);
      router.push('/admin/pedidos');
    } catch {
      setErro('Não foi possível remover este pedido.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover pedido" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente e não remove automaticamente os itens vinculados a este pedido.
            </p>
            <ReadField label="Cliente" value={clienteNome} />
            <ReadField label="Status" value={item.status} />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/pedidos">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function RemoverPedidoPage() {
  return (
    <>
      <Head><title>Remover pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverPedido /></RotaProtegida>
    </>
  );
}
