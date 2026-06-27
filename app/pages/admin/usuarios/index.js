import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import usuariosService from '@/services/usuariosService';
import { useAuth } from '@/contexts/AuthContext';
import uiStyles from '@/styles/Ui.module.css';

function ListaUsuarios() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const { usuario: usuarioLogado } = useAuth();

  const ehAdmin = usuarioLogado?.perfil === 'admin';

  function ehVoce(item) {
    return item._id === usuarioLogado?._id || item.email === usuarioLogado?.email;
  }

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await usuariosService.listar();
      setItens(data);
    } catch {
      setErro('Não foi possível carregar os usuários. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await usuariosService.remover(paraRemover._id);
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este usuário.');
    } finally {
      setRemovendo(false);
    }
  }

  const itensFiltrados = busca
    ? itens.filter((i) =>
        i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        String(i._id).includes(busca)
      )
    : itens;

  return (
    <AdminLayout
      title="Usuários"
      subtitle="Pessoas com acesso ao painel administrativo."
      actions={<Button href="/admin/usuarios/create" variant="accent">+ Novo usuário</Button>}
    >
      <Alert type="error">{erro}</Alert>

      <input
        className={uiStyles.searchInput}
        placeholder="Buscar por nome…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className={uiStyles.tableWrap}>
        {carregando ? (
          <EmptyState title="Carregando…" description="Buscando usuários cadastrados." />
        ) : itensFiltrados.length === 0 ? (
          <EmptyState title="Nenhum usuário encontrado" description="Cadastre o primeiro usuário para começar." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.nome}</strong>
                    {ehVoce(item) && (
                      <span style={{ marginLeft: 8 }}><Badge tone="neutral">você</Badge></span>
                    )}
                  </td>
                  <td>{item.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{item.perfil || '—'}</td>
                  <td><Badge tone={item.ativo ? 'ok' : 'danger'}>{item.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/usuarios/read/${item._id}`} title="Ver detalhes">👁</a>
                      {(ehAdmin || ehVoce(item)) && (
                        <a className={uiStyles.iconBtn} href={`/admin/usuarios/update/${item._id}`} title="Editar">✎</a>
                      )}
                      {ehAdmin && !ehVoce(item) && (
                        <button
                          className={`${uiStyles.iconBtn} ${uiStyles.iconBtnDanger}`}
                          title="Remover"
                          onClick={() => setParaRemover(item)}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        aberto={!!paraRemover}
        titulo="Remover usuário?"
        descricao={`Tem certeza que deseja remover "${paraRemover?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
    </AdminLayout>
  );
}

export default function UsuariosPage() {
  return (
    <>
      <Head><title>Usuários · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaUsuarios /></RotaProtegida>
    </>
  );
}
