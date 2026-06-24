import { useEffect, useState } from 'react';
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

function EditarUsuario() {
  const router = useRouter();
  const { id } = router.query;
  const { usuario: usuarioLogado } = useAuth();
  const ehAdmin = usuarioLogado?.perfil === 'admin';

  const [form, setForm] = useState({ nome: '', email: '', novaSenha: '', perfil: 'operador', ativo: true });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;
    usuariosService.buscarPorId(id)
      .then(({ data }) => setForm({
        nome: data.nome || '',
        email: data.email || '',
        novaSenha: '',
        perfil: data.perfil || 'operador',
        ativo: data.ativo !== false,
      }))
      .catch(() => setErro('Usuário não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (form.novaSenha && form.novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        ativo: form.ativo,
      };
      if (ehAdmin) {
        payload.perfil = form.perfil;
      }
      if (form.novaSenha) {
        payload.senha_hash = bcrypt.hashSync(form.novaSenha, 10);
      }
      await usuariosService.atualizar(id, payload);
      router.push('/admin/usuarios');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar usuário" subtitle="Atualize as informações deste usuário.">
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
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="novaSenha">Nova senha <span className={uiStyles.hint}>(deixe em branco para manter a atual)</span></label>
                <input id="novaSenha" type="password" placeholder="••••••••"
                  value={form.novaSenha} onChange={(e) => update('novaSenha', e.target.value)} />
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
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar alterações'}</Button>
              <Button variant="ghost" href="/admin/usuarios">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function EditarUsuarioPage() {
  return (
    <>
      <Head><title>Editar usuário · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarUsuario /></RotaProtegida>
    </>
  );
}
