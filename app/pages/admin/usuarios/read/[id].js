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
import usuariosService from '@/services/usuariosService';
import uiStyles from '@/styles/Ui.module.css';

function DetalheUsuario() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    usuariosService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Usuário não encontrado.'));
  }, [id]);

  return (
    <AdminLayout title="Detalhes do usuário" subtitle="Informações completas deste cadastro.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {item && (
          <>
            <ReadField label="Nome" value={item.nome} />
            <ReadField label="E-mail" value={item.email} />
            <ReadField label="Perfil" value={item.perfil} />
            <div style={{ marginBottom: 18 }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 5px',
              }}>Status</p>
              <Badge tone={item.ativo ? 'ok' : 'danger'}>{item.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </div>
            <ReadField label="Cadastrado em" value={item.created_at && new Date(item.created_at).toLocaleString('pt-BR')} />
            <ReadField label="ID" value={String(item._id || item.id)} />
            <div className={uiStyles.formActions}>
              <Button href={`/admin/usuarios/update/${item._id}`}>Editar</Button>
              <Button variant="ghost" href="/admin/usuarios">Voltar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function DetalheUsuarioPage() {
  return (
    <>
      <Head><title>Detalhes do usuário · Controle de Lavanderia</title></Head>
      <RotaProtegida><DetalheUsuario /></RotaProtegida>
    </>
  );
}
