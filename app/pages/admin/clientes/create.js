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
import Assinatura from '@/components/Assinatura';

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

    if (!form.nome.trim()) {
      setErro('O nome é obrigatório.');
      return;
    }
    if (!form.telefone.trim()) {
      setErro('O telefone é obrigatório.');
      return;
    }
    if (!form.email.trim()) {
      setErro('O e-mail é obrigatório.');
      return;
    }
    if (!form.cpf_cnpj.trim()) {
      setErro('O CPF/CNPJ é obrigatório.');
      return;
    }
    const cpfLimpo = form.cpf_cnpj.replace(/\D/g, '');
    if (cpfLimpo.length !== 11 && cpfLimpo.length !== 14) {
      setErro('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.');
      return;
    }

    setSalvando(true);
    try {
      const { data: clientes } = await clientesService.listar();

      const nomeDuplicado = clientes.some(
        (c) => c.nome.toLowerCase().trim() === form.nome.toLowerCase().trim()
      );
      if (nomeDuplicado) {
        setErro('Já existe um cliente cadastrado com esse nome.');
        setSalvando(false);
        return;
      }

      const cpfDuplicado = clientes.some((c) => c.cpf_cnpj && c.cpf_cnpj === form.cpf_cnpj);
      if (cpfDuplicado) {
        setErro('Já existe um cliente cadastrado com esse CPF/CNPJ.');
        setSalvando(false);
        return;
      }

      const emailDuplicado = clientes.some(
        (c) => c.email && c.email.toLowerCase() === form.email.toLowerCase()
      );
      if (emailDuplicado) {
        setErro('Já existe um cliente cadastrado com esse e-mail.');
        setSalvando(false);
        return;
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
              <label htmlFor="nome">Nome <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="nome" required autoFocus placeholder="Nome completo ou razão social"
                value={form.nome} onChange={(e) => update('nome', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="telefone">Telefone <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="telefone" required placeholder="(00) 00000-0000"
                value={form.telefone} onChange={(e) => update('telefone', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="email">E-mail <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="email" type="email" required placeholder="cliente@email.com"
                value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className={uiStyles.field}>
              <label htmlFor="cpf_cnpj">CPF/CNPJ <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="cpf_cnpj" required placeholder="000.000.000-00 ou 00.000.000/0000-00"
                maxLength={18}
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
      <Assinatura nome="Gabriel Borges" />
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
