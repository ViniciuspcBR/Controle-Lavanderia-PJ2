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

function DetalheTipoRoupa() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    tiposRoupaService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Tipo de roupa não encontrado.'));
  }, [id]);

  return (
    <AdminLayout title="Detalhes do tipo de roupa" subtitle="Informações completas deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="Descrição" value={item.descricao} />
            <ReadField label="ID" value={String(item._id)} />
            <div className={uiStyles.formActions}>
              <Button href={`/admin/tipos-roupa/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/tipos-roupa">Voltar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function DetalheTipoRoupaPage() {
  return (
    <>
      <Head><title>Detalhes do tipo de roupa · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalheTipoRoupa /></RotaProtegida>
    </>
  );
}
