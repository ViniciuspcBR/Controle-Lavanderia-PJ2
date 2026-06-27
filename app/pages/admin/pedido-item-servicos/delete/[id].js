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
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function RemoverPedidoItemServico() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [servicoNome, setServicoNome] = useState('');
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    pedidoItemServicosService.buscarPorId(id)
      .then(async ({ data }) => {
        setItem(data);
        const { data: servico } = await servicosService.buscarPorId(data.servico_id).catch(() => ({ data: null }));
        setServicoNome(servico?.nome || '—');
      })
      .catch(() => setErro('Vínculo não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await pedidoItemServicosService.remover(id);
      router.push('/admin/pedido-item-servicos');
    } catch {
      setErro('Não foi possível remover este vínculo.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover vínculo de serviço" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente. Confira os dados antes de remover:
            </p>
            <ReadField label="Serviço" value={servicoNome} />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/pedido-item-servicos">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="Vilson Vinicius" />
    </AdminLayout>
  );
}

export default function RemoverPedidoItemServicoPage() {
  return (
    <>
      <Head><title>Remover vínculo de serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverPedidoItemServico /></RotaProtegida>
    </>
  );
}
