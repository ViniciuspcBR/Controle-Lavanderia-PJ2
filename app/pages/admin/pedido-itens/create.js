import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidoItensService from '@/services/pedidoItensService';
import pedidosService from '@/services/pedidosService';
import tiposRoupaService from '@/services/tiposRoupaService';
import clientesService from '@/services/clientesService';
import uiStyles from '@/styles/Ui.module.css';
import Assinatura from '@/components/Assinatura';

function CriarPedidoItem() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [clientesPorId, setClientesPorId] = useState({});
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({
    pedido_id: '', tipo_roupa_id: '', quantidade: 1, descricao: '', status: 'recebido', valor_total: '',
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    Promise.all([pedidosService.listar(), tiposRoupaService.listar(), clientesService.listar()])
      .then(([pedidosRes, tiposRes, clientesRes]) => {
        setPedidos(pedidosRes.data);
        setTipos(tiposRes.data);
        setClientesPorId(Object.fromEntries(clientesRes.data.map((c) => [String(c._id), c.nome])));
        if (router.query.pedido_id) {
          update('pedido_id', router.query.pedido_id);
        }
      })
      .catch(() => setErro('Não foi possível carregar pedidos e tipos de roupa.'))
      .finally(() => setCarregando(false));
  }, [router.query.pedido_id]);

  function labelPedido(p, index) {
    const cliente = clientesPorId[String(p.cliente_id)] || 'Cliente';
    return `Pedido #${index + 1} — ${cliente}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!form.pedido_id || !form.tipo_roupa_id) {
      setErro('Selecione o pedido e o tipo de roupa.');
      return;
    }
    setSalvando(true);
    try {
      await pedidoItensService.criar({
        pedido_id: form.pedido_id,
        tipo_roupa_id: form.tipo_roupa_id,
        quantidade: parseInt(form.quantidade, 10) || 1,
        descricao: form.descricao,
        status: form.status,
        valor_total: parseFloat(form.valor_total) || 0,
      });
      router.push('/admin/pedido-itens');
    } catch {
      setErro('Não foi possível cadastrar o item.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Novo item de pedido" subtitle="Adicione uma peça a um pedido existente.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? <p>Carregando…</p> : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="pedido_id">Pedido</label>
                <select id="pedido_id" required value={form.pedido_id} onChange={(e) => update('pedido_id', e.target.value)}>
                  <option value="">Selecione um pedido…</option>
                  {pedidos.map((p, index) => (
                    <option key={p._id} value={p._id}>
                      {labelPedido(p, index)}
                    </option>
                  ))}
                </select>
                {pedidos.length === 0 && (
                  <span className={uiStyles.hint}>Nenhum pedido cadastrado ainda.</span>
                )}
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="tipo_roupa_id">Tipo de roupa</label>
                <select id="tipo_roupa_id" required value={form.tipo_roupa_id} onChange={(e) => update('tipo_roupa_id', e.target.value)}>
                  <option value="">Selecione…</option>
                  {tipos.map((t) => <option key={t._id} value={t._id}>{t.nome}</option>)}
                </select>
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="quantidade">Quantidade</label>
                <input id="quantidade" type="number" min="1" value={form.quantidade}
                  onChange={(e) => update('quantidade', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)}>
                  <option value="recebido">Recebido</option>
                  <option value="lavando">Lavando</option>
                  <option value="pronto">Pronto</option>
                  <option value="entregue">Entregue</option>
                </select>
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="valor_total">Valor total (R$)</label>
                <input id="valor_total" type="number" step="0.01" min="0" placeholder="0,00"
                  value={form.valor_total} onChange={(e) => update('valor_total', e.target.value)} />
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="descricao">Descrição <span className={uiStyles.hint}>(opcional)</span></label>
                <textarea id="descricao" placeholder="Ex: mancha no bolso, botão solto…"
                  value={form.descricao} onChange={(e) => update('descricao', e.target.value)} />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar item'}</Button>
              <Button variant="ghost" href="/admin/pedido-itens">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
      <Assinatura nome="Matheus Lenz" />
    </AdminLayout>
  );
}

export default function CriarPedidoItemPage() {
  return (
    <>
      <Head><title>Novo item de pedido · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarPedidoItem /></RotaProtegida>
    </>
  );
}
