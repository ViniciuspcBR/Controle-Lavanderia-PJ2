import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import ReadField from '@/components/ReadField';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import usuariosService from '@/services/usuariosService';
import { useAuth } from '@/contexts/AuthContext';
import uiStyles from '@/styles/Ui.module.css';

function RemoverUsuario() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);
  const { usuario: usuarioLogado } = useAuth();

  useEffect(() => {
    if (!id) return;
    usuariosService.buscarPorId(id)
      .then(({ data }) => setItem(data))
      .catch(() => setErro('Usuário não encontrado.'));
  }, [id]);

  async function handleRemover() {
    if (id === usuarioLogado?.id) {
      setErro('Você não pode remover o próprio usuário enquanto está logado com ele.');
      return;
    }
    setRemovendo(true);
    try {
      await usuariosService.remover(id);
      router.push('/admin/usuarios');
    } catch {
      setErro('Não foi possível remover este usuário.');
      setRemovendo(false);
    }
  }

  return (
    <AdminLayout title="Remover usuário" subtitle="Confirme a remoção deste cadastro.">
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
              <Button variant="ghost" href="/admin/usuarios">Cancelar</Button>
            </div>
          </>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function RemoverUsuarioPage() {
  return (
    <>
      <Head><title>Remover usuário · Controle de Lavanderia</title></Head>
      <RotaProtegida><RemoverUsuario /></RotaProtegida>
    </>
  );
}
