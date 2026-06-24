import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import servicosService from '@/services/servicosService';
import uiStyles from '@/styles/Ui.module.css';

function EditarServico() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({ nome: '', descricao: '', preco_base: '', ativo: true });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;
    servicosService.buscarPorId(id)
      .then(({ data }) => setForm({
        nome: data.nome || '',
        descricao: data.descricao || '',
        preco_base: data.preco_base ?? '',
        ativo: data.ativo !== false,
      }))
      .catch(() => setErro('Serviço não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await servicosService.atualizar(id, {
        ...form,
        preco_base: parseFloat(form.preco_base) || 0,
      });
      router.push('/admin/servicos');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar serviço" subtitle="Atualize as informações deste serviço.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? <p>Carregando…</p> : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" required value={form.nome} onChange={(e) => update('nome', e.target.value)} />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" value={form.descricao} onChange={(e) => update('descricao', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="preco_base">Preço base (R$)</label>
                <input id="preco_base" type="number" step="0.01" min="0"
                  value={form.preco_base} onChange={(e) => update('preco_base', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label>Status</label>
                <div className={uiStyles.checkboxRow}>
                  <input id="ativo" type="checkbox" checked={form.ativo}
                    onChange={(e) => update('ativo', e.target.checked)} />
                  <label htmlFor="ativo" style={{ fontWeight: 400 }}>Serviço ativo</label>
                </div>
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar alterações'}</Button>
              <Button variant="ghost" href="/admin/servicos">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function EditarServicoPage() {
  return (
    <>
      <Head><title>Editar serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarServico /></RotaProtegida>
    </>
  );
}
