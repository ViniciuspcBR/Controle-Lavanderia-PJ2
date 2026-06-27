import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidosService from '@/services/pedidosService';
import clientesService from '@/services/clientesService';
import { useAuth } from '@/contexts/AuthContext';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function CriarPedido() {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    cliente_id: '', status: 'recebido', data_entrada: '', data_prevista: '', observacoes: '',
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    clientesService.listar()
      .then(({ data }) => setClientes(data))
      .catch(() => setErro('Não foi possível carregar a lista de clientes.'))
      .finally(() => setCarregando(false));

    const hoje = new Date().toISOString().slice(0, 10);
    setForm((atual) => ({ ...atual, data_entrada: hoje }));
  }, []);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!form.cliente_id) {
      setErro('Selecione um cliente.');
      return;
    }
    setSalvando(true);
    try {
      await pedidosService.criar({
        cliente_id: form.cliente_id,
        usuario_id: usuario?.id,
        status: form.status,
        data_entrada: form.data_entrada ? new Date(form.data_entrada).toISOString() : null,
        data_prevista: form.data_prevista ? new Date(form.data_prevista).toISOString() : null,
        data_saida: null,
        valor_total: 0,
        observacoes: form.observacoes,
      });
      router.push('/admin/pedidos');
    } catch {
      setErro('Não foi possível cadastrar o pedido.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Novo pedido" subtitle="Registre a entrada de um novo pedido de lavagem.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? <p>Carregando…</p> : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="cliente_id">Cliente</label>
                <select id="cliente_id" required value={form.cliente_id} onChange={(e) => update('cliente_id', e.target.value)}>
                  <option value="">Selecione um cliente…</option>
                  {clientes.map((c) => <option key={c._id} value={c._id}>{c.nome}</option>)}
                </select>
                {clientes.length === 0 && (
                  <span className={uiStyles.hint}>Nenhum cliente cadastrado ainda. Cadastre um cliente primeiro.</span>
                )}
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)}>
                  <option value="recebido">Recebido</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="pronto">Pronto</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="data_entrada">Data de entrada</label>
                <input id="data_entrada" type="date" value={form.data_entrada} onChange={(e) => update('data_entrada', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="data_prevista">Previsão de entrega</label>
                <input id="data_prevista" type="date" value={form.data_prevista} onChange={(e) => update('data_prevista', e.target.value)} />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="observacoes">Observações</label>
                <textarea id="observacoes" placeholder="Alguma observação sobre o pedido?"
                  value={form.observacoes} onChange={(e) => update('observacoes', e.target.value)} />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar pedido'}</Button>
              <Button variant="ghost" href="/admin/pedidos">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
      <Assinatura nome="João Vitor" />
    </AdminLayout>
  );
}

export default function CriarPedidoPage() {
  return (
    <>
      <Head><title>Novo pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarPedido /></RotaProtegida>
    </>
  );
}
