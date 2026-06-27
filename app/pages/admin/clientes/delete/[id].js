import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function RemoverCliente() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    clientesService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Cliente não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await clientesService.remover(id);
      router.push('/admin/clientes');
    } catch {
      setErro('Não foi possível remover este cliente.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover cliente" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente. Confira os dados antes de remover:
            </p>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="E-mail" value={item.email} />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/clientes">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="Gabriel Borges" />
    </AdminLayout>
  );
}

export default function RemoverClientePage() {
  return (
    <>
      <Head><title>Remover cliente · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverCliente /></RotaProtegida>
    </>
  );
}
