import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';

function ListaClientes() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await clientesService.listar();
      setItens(data);
    } catch {
      setErro('Não foi possível carregar os clientes. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await clientesService.remover(paraRemover._id);
      setItens((atual) => atual.filter((i) => i.id !== paraRemover._id));
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este cliente.');
    } finally {
      setRemovendo(false);
    }
  }

  const itensFiltrados = busca
    ? itens.filter((i) => i.nome?.toLowerCase().includes(busca.toLowerCase()))
    : itens;

  return (
    <AdminLayout
      title="Clientes"
      subtitle="Pessoas e empresas atendidas pela lavanderia."
      actions={<Button href="/admin/clientes/create" variant="accent">+ Novo cliente</Button>}
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
          <EmptyState title="Carregando…" description="Buscando clientes cadastrados." />
        ) : itensFiltrados.length === 0 ? (
          <EmptyState title="Nenhum cliente encontrado" description="Cadastre o primeiro cliente para começar." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>CPF/CNPJ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.telefone || '—'}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.cpf_cnpj || '—'}</td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/clientes/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/clientes/update/${item._id}`} title="Editar">✎</a>
                      <button
                        className={`${uiStyles.iconBtn} ${uiStyles.iconBtnDanger}`}
                        title="Remover"
                        onClick={() => setParaRemover(item)}
                      >
                        🗑
                      </button>
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
        titulo="Remover cliente?"
        descricao={`Tem certeza que deseja remover "${paraRemover?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
    </AdminLayout>
  );
}

export default function ClientesPage() {
  return (
    <>
      <Head><title>Clientes · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaClientes /></RotaProtegida>
    </>
  );
}
