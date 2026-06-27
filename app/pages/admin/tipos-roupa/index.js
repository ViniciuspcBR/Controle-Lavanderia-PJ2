import { useEffect, useState } from 'react';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function ListaTiposRoupa() {
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
      const { data } = await tiposRoupaService.listar();
      setItens(data);
    } catch (err) {
      setErro('Não foi possível carregar os tipos de roupa. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await tiposRoupaService.remover(paraRemover._id);
      setItens((atual) => atual.filter((i) => i.id !== paraRemover._id));
      setParaRemover(null);
      await carregar();
    } catch {
      setErro('Não foi possível remover este tipo de roupa.');
    } finally {
      setRemovendo(false);
    }
  }

  const itensFiltrados = busca
    ? itens.filter((i) => i.nome?.toLowerCase().includes(busca.toLowerCase()) || String(i._id).includes(busca))
    : itens;

  return (
    <AdminLayout
      title="Tipos de roupa"
      subtitle="Categorias de peças aceitas pela lavanderia (camisa, calça, edredom...)."
      actions={<Button href="/admin/tipos-roupa/create" variant="accent">+ Novo tipo</Button>}
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
          <EmptyState title="Carregando…" description="Buscando tipos de roupa cadastrados." />
        ) : itensFiltrados.length === 0 ? (
          <EmptyState
            title="Nenhum tipo de roupa encontrado"
            description="Cadastre o primeiro tipo de roupa para começar."
          />
        ) : (
          <table className={uiStyles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.descricao || '—'}</td>
                  <td>
                    <div className={uiStyles.tableActions}>
                      <a className={uiStyles.iconBtn} href={`/admin/tipos-roupa/read/${item._id}`} title="Ver detalhes">👁</a>
                      <a className={uiStyles.iconBtn} href={`/admin/tipos-roupa/update/${item._id}`} title="Editar">✎</a>
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
        titulo="Remover tipo de roupa?"
        descricao={`Tem certeza que deseja remover "${paraRemover?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
        carregando={removendo}
      />
      <Assinatura nome="Vinicius Cardoso" />
    </AdminLayout>
  );
}

export default function TiposRoupaPage() {
  return (
    <>
      <Head><title>Tipos de roupa · Controle de Lavanderia</title></Head>
      <RotaProtegida><ListaTiposRoupa /></RotaProtegida>
    </>
  );
}
