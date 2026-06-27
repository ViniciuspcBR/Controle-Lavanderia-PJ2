import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import bcrypt from 'bcryptjs';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import usuariosService from '@/services/usuariosService';
import { useAuth } from '@/contexts/AuthContext';
import uiStyles from '@/styles/Ui.module.css';

function CriarUsuario() {
  const { usuario: usuarioLogado } = useAuth();
  const ehAdmin = usuarioLogado?.perfil === 'admin';

  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'operador', ativo: true });
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
    if (!form.email.trim()) {
      setErro('O e-mail é obrigatório.');
      return;
    }
    if (!form.senha) {
      setErro('A senha é obrigatória.');
      return;
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSalvando(true);
    try {
      const { data: usuarios } = await usuariosService.listar();

      const nomeDuplicado = usuarios.some(
        (u) => u.nome.toLowerCase().trim() === form.nome.toLowerCase().trim()
      );
      if (nomeDuplicado) {
        setErro('Já existe um usuário cadastrado com esse nome.');
        setSalvando(false);
        return;
      }

      const emailDuplicado = usuarios.some(
        (u) => u.email.toLowerCase() === form.email.toLowerCase()
      );
      if (emailDuplicado) {
        setErro('Já existe um usuário com esse e-mail.');
        setSalvando(false);
        return;
      }

      const senha_hash = bcrypt.hashSync(form.senha, 10);
      await usuariosService.criar({
        nome: form.nome,
        email: form.email,
        senha_hash,
        perfil: ehAdmin ? form.perfil : 'operador',
        ativo: form.ativo,
      });
      router.push('/admin/usuarios');
    } catch {
      setErro('Não foi possível cadastrar o usuário.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Novo usuário" subtitle="Cadastre uma pessoa com acesso ao painel.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        <form onSubmit={handleSubmit}>
          <div className={uiStyles.formGrid}>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="nome">Nome <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="nome" required autoFocus placeholder="Nome completo"
                value={form.nome} onChange={(e) => update('nome', e.target.value)} />
            </div>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="email">E-mail <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input id="email" type="email" required placeholder="email@lavanderia.com"
                value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
              <label htmlFor="senha">Senha <span style={{ color: 'var(--color-danger)' }}>*</span> <span className={uiStyles.hint}>(mín. 6 caracteres)</span></label>
              <input id="senha" type="password" required placeholder="••••••••"
                value={form.senha} onChange={(e) => update('senha', e.target.value)} />
            </div>
            {ehAdmin && (
              <div className={uiStyles.field}>
                <label htmlFor="perfil">Perfil</label>
                <select id="perfil" value={form.perfil} onChange={(e) => update('perfil', e.target.value)}>
                  <option value="operador">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            )}
            <div className={uiStyles.field}>
              <label>Status</label>
              <div className={uiStyles.checkboxRow}>
                <input id="ativo" type="checkbox" checked={form.ativo}
                  onChange={(e) => update('ativo', e.target.checked)} />
                <label htmlFor="ativo" style={{ fontWeight: 400 }}>Usuário ativo</label>
              </div>
            </div>
          </div>
          <div className={uiStyles.formActions}>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar usuário'}</Button>
            <Button variant="ghost" href="/admin/usuarios">Cancelar</Button>
          </div>
        </form>
      </FormCard>
    </AdminLayout>
  );
}

export default function CriarUsuarioPage() {
  return (
    <>
      <Head><title>Novo usuário · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarUsuario /></RotaProtegida>
    </>
  );
}
