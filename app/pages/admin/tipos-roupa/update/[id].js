import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function EditarTipoRoupa() {
  const router = useRouter();
  const { id } = router.query;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    tiposRoupaService.buscarPorId(id)
      .then(({ data }) => {
        setNome(data.nome || '');
        setDescricao(data.descricao || '');
      })
      .catch(() => setErro('Tipo de roupa não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await tiposRoupaService.atualizar(id, { nome, descricao });
      router.push('/admin/tipos-roupa');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar tipo de roupa" subtitle="Atualize as informações desta categoria.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? (
          <p>Carregando…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando…' : 'Salvar alterações'}
              </Button>
              <Button variant="ghost" href="/admin/tipos-roupa">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
      <Assinatura nome="Vinicius Cardoso" />
    </AdminLayout>
  );
}

export default function EditarTipoRoupaPage() {
  return (
    <>
      <Head><title>Editar tipo de roupa · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarTipoRoupa /></RotaProtegida>
    </>
  );
}
