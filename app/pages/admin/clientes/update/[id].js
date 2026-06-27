import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function EditarCliente() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({ nome: '', telefone: '', email: '', cpf_cnpj: '', observacoes: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;
    clientesService.buscarPorId(id)
      .then(({ data }) => setForm({
        nome: data.nome || '',
        telefone: data.telefone || '',
        email: data.email || '',
        cpf_cnpj: data.cpf_cnpj || '',
        observacoes: data.observacoes || '',
      }))
      .catch(() => setErro('Cliente não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await clientesService.atualizar(id, form);
      router.push('/admin/clientes');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar cliente" subtitle="Atualize as informações deste cliente.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? <p>Carregando…</p> : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" required value={form.nome} onChange={(e) => update('nome', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" value={form.telefone} onChange={(e) => update('telefone', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
                <input id="cpf_cnpj" value={form.cpf_cnpj} onChange={(e) => update('cpf_cnpj', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="observacoes">Observações</label>
                <input id="observacoes" value={form.observacoes} onChange={(e) => update('observacoes', e.target.value)} />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar alterações'}</Button>
              <Button variant="ghost" href="/admin/clientes">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
      <Assinatura nome="Gabriel Borges" />
    </AdminLayout>
  );
}

export default function EditarClientePage() {
  return (
    <>
      <Head><title>Editar cliente · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarCliente /></RotaProtegida>
    </>
  );
}
