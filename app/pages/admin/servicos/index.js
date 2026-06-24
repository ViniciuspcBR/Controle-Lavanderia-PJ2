import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import servicosService from '@/services/servicosService';
import uiStyles from '@/styles/Ui.module.css';

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ListaServicos() {
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
      const { data } = await servicosService.listar();
      setItens(data);
    } catch {
      setErro('Não foi possível carregar os serviços. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await servicosService.remover(paraRemover._id);
      setItens((atual) => atual.filter((i) => i.id !== paraRemover._id));
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este serviço.');
    } finally {
      setRemovendo(false);
    }
  }

  const itensFiltrados = busca
    ? itens.filter((i) => i.nome?.toLowerCase().includes(busca.toLowerCase()))
    : itens;

  return (
    <AdminLayout
      title="Serviços"
      subtitle="Serviços oferecidos, como lavagem, passadoria e tingimento."
      actions={<Button href="/admin/servicos/create" variant="accent">+ Novo serviço</Button>}
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
          <EmptyState title="Carregando…" description="Buscando serviços cadastrados." />
        ) : itensFiltrados.length === 0 ? (
          <EmptyState title="Nenhum serviço encontrado" description="Cadastre o primeiro serviço para começar." />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço base</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.nome}</strong></td>
                  <td>{formatarPreco(item.preco_base)}</td>
                  <td>
                    <Badge tone={item.ativo ? 'ok' : 'danger'}>{item.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/servicos/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/servicos/update/${item._id}`} title="Editar">✎</a>
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
        titulo="Remover serviço?"
        descricao={`Tem certeza que deseja remover "${paraRemover?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
    </AdminLayout>
  );
}

export default function ServicosPage() {
  return (
    <>
      <Head><title>Serviços · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaServicos /></RotaProtegida>
    </>
  );
}
