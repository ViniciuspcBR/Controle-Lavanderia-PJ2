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

function DetalheCliente() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    clientesService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Cliente não encontrado.'));
  }, [id]);

  return (
    <AdminLayout title="Detalhes do cliente" subtitle="Informações completas deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="Telefone" value={item.telefone} />
            <ReadField label="E-mail" value={item.email} />
            <ReadField label="CPF/CNPJ" value={item.cpf_cnpj} />
            <ReadField label="Observações" value={item.observacoes} />
            <ReadField label="Cadastrado em" value={item.created_at && new Date(item.created_at).toLocaleString('pt-BR')} />
            <ReadField label="ID" value={String(item._id || item.id)} />
            <div className={uiStyles.formActions}>
              <Button href={`/admin/clientes/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/clientes">Voltar</Button>
            </div>
          </>
        )}
      </FormCard>
      <Assinatura nome="Gabriel Borges" />
    </AdminLayout>
  );
}

export default function DetalheClientePage() {
  return (
    <>
      <Head><title>Detalhes do cliente · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalheCliente /></RotaProtegida>
    </>
  );
}
