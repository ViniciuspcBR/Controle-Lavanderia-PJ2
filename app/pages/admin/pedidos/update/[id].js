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
import uiStyles from '@/styles/Ui.module.css';

function paraInputDate(valor) {
  if (!valor) return '';
  return new Date(valor).toISOString().slice(0, 10);
}

function EditarPedido() {
  const router = useRouter();
  const { id } = router.query;

  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    cliente_id: '', status: 'recebido', data_entrada: '', data_prevista: '', data_saida: '', valor_total: '', observacoes: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;
    Promise.all([pedidosService.buscarPorId(id), clientesService.listar()])
      .then(([pedidoRes, clientesRes]) => {
        setClientes(clientesRes.data);
        const data = pedidoRes.data;
        setForm({
          cliente_id: data.cliente_id || '',
          status: data.status || 'recebido',
          data_entrada: paraInputDate(data.data_entrada),
          data_prevista: paraInputDate(data.data_prevista),
          data_saida: paraInputDate(data.data_saida),
          valor_total: data.valor_total ?? '',
          observacoes: data.observacoes || '',
        });
      })
      .catch(() => setErro('Pedido não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await pedidosService.atualizar(id, {
        cliente_id: form.cliente_id,
        status: form.status,
        data_entrada: form.data_entrada ? new Date(form.data_entrada).toISOString() : null,
        data_prevista: form.data_prevista ? new Date(form.data_prevista).toISOString() : null,
        data_saida: form.data_saida ? new Date(form.data_saida).toISOString() : null,
        valor_total: parseFloat(form.valor_total) || 0,
        observacoes: form.observacoes,
      });
      router.push('/admin/pedidos');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar pedido" subtitle="Atualize as informações deste pedido.">
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
                <label htmlFor="valor_total">Valor total (R$)</label>
                <input id="valor_total" type="number" step="0.01" min="0"
                  value={form.valor_total} onChange={(e) => update('valor_total', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="data_entrada">Data de entrada</label>
                <input id="data_entrada" type="date" value={form.data_entrada} onChange={(e) => update('data_entrada', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="data_prevista">Previsão de entrega</label>
                <input id="data_prevista" type="date" value={form.data_prevista} onChange={(e) => update('data_prevista', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="data_saida">Data de saída <span className={uiStyles.hint}>(quando entregue)</span></label>
                <input id="data_saida" type="date" value={form.data_saida} onChange={(e) => update('data_saida', e.target.value)} />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="observacoes">Observações</label>
                <textarea id="observacoes" value={form.observacoes} onChange={(e) => update('observacoes', e.target.value)} />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar alterações'}</Button>
              <Button variant="ghost" href="/admin/pedidos">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function EditarPedidoPage() {
  return (
    <>
      <Head><title>Editar pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarPedido /></RotaProtegida>
    </>
  );
}
