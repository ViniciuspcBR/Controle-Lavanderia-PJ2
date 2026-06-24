import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';

function CriarCliente() {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', cpf_cnpj: '', observacoes: '' });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const router = useRouter();

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const { data: clientes } = await clientesService.listar();

      if (form.cpf_cnpj) {
        const cpfDuplicado = clientes.some(
          (c) => c.cpf_cnpj && c.cpf_cnpj === form.cpf_cnpj
        );
        if (cpfDuplicado) {
          setErro('Já existe um cliente cadastrado com esse CPF/CNPJ.');
          setSalvando(false);
          return;
        }
      }

      if (form.email) {
        const emailDuplicado = clientes.some(
          (c) => c.email && c.email.toLowerCase() === form.email.toLowerCase()
        );
        if (emailDuplicado) {
          setErro('Já existe um cliente cadastrado com esse e-mail.');
          setSalvando(false);
          return;
        }
      }

      await clientesService.criar(form);
      router.push('/admin/clientes');
    } catch {
      setErro('Não foi possível cadastrar o cliente.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Novo cliente" subtitle="Cadastre uma pessoa ou empresa atendida pela lavanderia.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        <form onSubmit={handleSubmit}>
          <div className={uiStyles.formGrid}>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="nome">Nome</label>
              <input id="nome" required autoFocus placeholder="Nome completo ou razão social"
                value={form.nome} onChange={(e) => update('nome', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" placeholder="(00) 00000-0000"
                value={form.telefone} onChange={(e) => update('telefone', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" placeholder="cliente@email.com"
                value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
              <input id="cpf_cnpj" placeholder="000.000.000-00"
                value={form.cpf_cnpj} onChange={(e) => update('cpf_cnpj', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="observacoes">Observações</label>
              <input id="observacoes" placeholder="Alguma observação?"
                value={form.observacoes} onChange={(e) => update('observacoes', e.target.value)} />
            </div>
          </div>
          <div className={uiStyles.formActions}>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar cliente'}</Button>
            <Button variant="ghost" href="/admin/clientes">Cancelar</Button>
          </div>
        </form>
      </FormCard>
    </AdminLayout>
  );
}

export default function CriarClientePage() {
  return (
    <>
      <Head><title>Novo cliente · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarCliente /></RotaProtegida>
    </>
  );
}
