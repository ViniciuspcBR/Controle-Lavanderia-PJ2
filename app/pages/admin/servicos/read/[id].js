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
import servicosService from '@/services/servicosService';
import uiStyles from '@/styles/Ui.module.css';

function DetalheServico() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    servicosService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Serviço não encontrado.'));
  }, [id]);

  return (
    <AdminLayout title="Detalhes do serviço" subtitle="Informações completas deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="Descrição" value={item.descricao} />
            <ReadField label="Preço base" value={
              Number(item.preco_base || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            } />
            <div style={{ marginBottom: 18 }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 5px',
              }}>Status</p>
              <Badge tone={item.ativo ? 'ok' : 'danger'}>{item.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </div>
            <div className={uiStyles.formActions}>
              <Button href={`/admin/servicos/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/servicos">Voltar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function DetalheServicoPage() {
  return (
    <>
      <Head><title>Detalhes do serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalheServico /></RotaProtegida>
    </>
  );
}
