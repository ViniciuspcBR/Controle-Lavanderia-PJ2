import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function RemoverTipoRoupa() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    tiposRoupaService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Tipo de roupa não encontrado.'));
  }, [id]);

  async function handleRemover() {
    setRemovendo(true);
    try {
      await tiposRoupaService.remover(id);
      router.push('/admin/tipos-roupa');
    } catch {
      setErro('Não foi possível remover este tipo de roupa.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover tipo de roupa" subtitle="Confirme a remoção deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: 20 }}>
              Esta ação é permanente. Confira os dados antes de remover:
            </p>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="Descrição" value={item.descricao} />
            <div className={uiStyles.formActions}>
              <Button variant="danger" onClick={handleRemover} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </Button>
              <Button variant="ghost" href="/admin/tipos-roupa">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="Vinicius Cardoso" />
    </AdminLayout>
  );
}

export default function RemoverTipoRoupaPage() {
  return (
    <>
      <Head><title>Remover tipo de roupa · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverTipoRoupa /></RotaProtegida>
    </>
  );
}
