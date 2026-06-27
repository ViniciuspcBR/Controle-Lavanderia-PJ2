import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';

function CriarTipoRoupa() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('O nome é obrigatório.');
      return;
    }

    setSalvando(true);
    try {
      const { data: tipos } = await tiposRoupaService.listar();
      const nomeDuplicado = tipos.some(
        (t) => t.nome.toLowerCase().trim() === nome.toLowerCase().trim()
      );
      if (nomeDuplicado) {
        setErro('Já existe um tipo de roupa cadastrado com esse nome.');
        setSalvando(false);
        return;
      }

      await tiposRoupaService.criar({ nome, descricao });
      router.push('/admin/tipos-roupa');
    } catch {
      setErro('Não foi possível cadastrar o tipo de roupa.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Novo tipo de roupa" subtitle="Cadastre uma nova categoria de peça.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        <form onSubmit={handleSubmit}>
          <div className={uiStyles.formGrid}>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="nome">Nome <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="nome" required autoFocus placeholder="Ex: Camisa social"
                value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="descricao">Descrição <span className={uiStyles.hint}>(opcional)</span></label>
              <textarea id="descricao" placeholder="Detalhes sobre esse tipo de peça"
                value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
          </div>
          <div className={uiStyles.formActions}>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar tipo de roupa'}</Button>
            <Button variant="ghost" href="/admin/tipos-roupa">Cancelar</Button>
          </div>
        </form>
      </FormCard>
    </AdminLayout>
  );
}

export default function CriarTipoRoupaPage() {
  return (
    <>
      <Head><title>Novo tipo de roupa · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarTipoRoupa /></RotaProtegida>
    </>
  );
}
