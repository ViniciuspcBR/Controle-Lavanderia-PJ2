import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RotaProtegida from '@/components/RotaProtegida';
import AdminLayout from '@/components/AdminLayout';
import FormCard from '@/components/FormCard';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import pedidoItemServicosService from '@/services/pedidoItemServicosService';
import pedidoItensService from '@/services/pedidoItensService';
import servicosService from '@/services/servicosService';
import tiposRoupaService from '@/services/tiposRoupaService';
import uiStyles from '@/styles/Ui.module.css';

function EditarPedidoItemServico() {
  const router = useRouter();
  const { id } = router.query;

  const [pedidoItens, setPedidoItens] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [tiposPorId, setTiposPorId] = useState({});
  const [form, setForm] = useState({
    pedido_item_id: '', servico_id: '', preco_unitario: '', quantidade: 1,
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;
    Promise.all([
      pedidoItemServicosService.buscarPorId(id),
      pedidoItensService.listar(),
      servicosService.listar(),
      tiposRoupaService.listar(),
    ])
      .then(([vinculoRes, itensRes, servicosRes, tiposRes]) => {
        setPedidoItens(itensRes.data);
        setServicos(servicosRes.data);
        setTiposPorId(Object.fromEntries(tiposRes.data.map((t) => [t.id, t.nome])));
        const data = vinculoRes.data;
        setForm({
          pedido_item_id: data.pedido_item_id || '',
          servico_id: data.servico_id || '',
          preco_unitario: data.preco_unitario ?? '',
          quantidade: data.quantidade ?? 1,
        });
      })
      .catch(() => setErro('Vínculo não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const precoUnitario = parseFloat(form.preco_unitario) || 0;
      const quantidade = parseInt(form.quantidade, 10) || 1;
      await pedidoItemServicosService.atualizar(id, {
        pedido_item_id: form.pedido_item_id,
        servico_id: form.servico_id,
        preco_unitario: precoUnitario,
        quantidade,
        valor_total: precoUnitario * quantidade,
      });
      router.push('/admin/pedido-item-servicos');
    } catch {
      setErro('Não foi possível salvar as alterações.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Editar vínculo de serviço" subtitle="Atualize as informações deste vínculo.">
      <FormCard>
        <Alert type="error">{erro}</Alert>
        {carregando ? <p>Carregando…</p> : (
          <form onSubmit={handleSubmit}>
            <div className={uiStyles.formGrid}>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="pedido_item_id">Item do pedido</label>
                <select id="pedido_item_id" required value={form.pedido_item_id} onChange={(e) => update('pedido_item_id', e.target.value)}>
                  <option value="">Selecione um item…</option>
                  {pedidoItens.map((pi) => (
                    <option key={pi._id} value={pi._id}>
                      {tiposPorId[pi.tipo_roupa_id] || 'Item'} — qtd. {pi.quantidade}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="servico_id">Serviço</label>
                <select id="servico_id" required value={form.servico_id} onChange={(e) => update('servico_id', e.target.value)}>
                  <option value="">Selecione…</option>
                  {servicos.map((s) => <option key={s._id} value={s._id}>{s.nome}</option>)}
                </select>
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="preco_unitario">Preço unitário (R$)</label>
                <input id="preco_unitario" type="number" step="0.01" min="0"
                  value={form.preco_unitario} onChange={(e) => update('preco_unitario', e.target.value)} />
              </div>
              <div className={uiStyles.field}>
                <label htmlFor="quantidade">Quantidade</label>
                <input id="quantidade" type="number" min="1" value={form.quantidade}
                  onChange={(e) => update('quantidade', e.target.value)} />
              </div>
            </div>
            <div className={uiStyles.formActions}>
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar alterações'}</Button>
              <Button variant="ghost" href="/admin/pedido-item-servicos">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
    </AdminLayout>
  );
}

export default function EditarPedidoItemServicoPage() {
  return (
    <>
      <Head><title>Editar vínculo de serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><EditarPedidoItemServico /></RotaProtegida>
    </>
  );
}
