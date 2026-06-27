import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import servicosService from '@/services/servicosService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function RemoverServico() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    servicosService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Serviço não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await servicosService.remover(id);
      router.push('/admin/servicos');
    } catch {
      setErro('Não foi possível remover este serviço.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover serviço" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente. Confira os dados antes de remover:
            </p>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="Preço base" value={
              Number(item.preco_base || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            } />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/servicos">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="João Vitor" />
    </AdminLayout>
  );
}

export default function RemoverServicoPage() {
  return (
    <>
      <Head><title>Remover serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverServico /></RotaProtegida>
    </>
  );
}
