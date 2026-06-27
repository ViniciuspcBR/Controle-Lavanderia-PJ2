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
import Assinatura from '@/components/Assinatura';

function CriarPedidoItemServico() {
  const router = useRouter();
  const [pedidoItens, setPedidoItens] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [tiposPorId, setTiposPorId] = useState({});
  const [form, setForm] = useState({
    pedido_item_id: '', servico_id: '', preco_unitario: '', quantidade: 1,
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  function update(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  useEffect(() => {
    Promise.all([pedidoItensService.listar(), servicosService.listar(), tiposRoupaService.listar()])
      .then(([itensRes, servicosRes, tiposRes]) => {
        setPedidoItens(itensRes.data);
        // Só exibe serviços ATIVOS
        setServicos(servicosRes.data.filter((s) => s.ativo !== false));
        setTiposPorId(Object.fromEntries(tiposRes.data.map((t) => [String(t._id), t.nome])));
        if (router.query.pedido_item_id) {
          update('pedido_item_id', router.query.pedido_item_id);
        }
      })
      .catch(() => setErro('Não foi possível carregar itens de pedido e serviços.'))
      .finally(() => setCarregando(false));
  }, [router.query.pedido_item_id]);

  function selecionarServico(servicoId) {
    update('servico_id', servicoId);
    const servico = servicos.find((s) => String(s._id) === servicoId);
    if (servico && !form.preco_unitario) {
      update('preco_unitario', servico.preco_base ?? '');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!form.pedido_item_id || !form.servico_id) {
      setErro('Selecione o item do pedido e o serviço.');
      return;
    }
    setSalvando(true);
    try {
      const precoUnitario = parseFloat(form.preco_unitario) || 0;
      const quantidade = parseInt(form.quantidade, 10) || 1;
      await pedidoItemServicosService.criar({
        pedido_item_id: form.pedido_item_id,
        servico_id: form.servico_id,
        preco_unitario: precoUnitario,
        quantidade,
        valor_total: precoUnitario * quantidade,
      });
      router.push('/admin/pedido-item-servicos');
    } catch {
      setErro('Não foi possível cadastrar o vínculo de serviço.');
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Vincular serviço a item" subtitle="Aplique um serviço (lavagem, passadoria...) a uma peça do pedido.">
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
                      Pedido #{pedidoItens.indexOf(pi) + 1} — {tiposPorId[String(pi.tipo_roupa_id)] || 'Item'} (qtd. {pi.quantidade})
                    </option>
                  ))}
                </select>
                {pedidoItens.length === 0 && (
                  <span className={uiStyles.hint}>Nenhum item de pedido cadastrado ainda.</span>
                )}
              </div>
              <div className={`${uiStyles.field} ${uiStyles.formGridFull}`}>
                <label htmlFor="servico_id">Serviço</label>
                <select id="servico_id" required value={form.servico_id} onChange={(e) => selecionarServico(e.target.value)}>
                  <option value="">Selecione…</option>
                  {servicos.map((s) => <option key={s._id} value={s._id}>{s.nome}</option>)}
                </select>
                {servicos.length === 0 && (
                  <span className={uiStyles.hint}>Nenhum serviço ativo cadastrado ainda.</span>
                )}
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
              <Button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar vínculo'}</Button>
              <Button variant="ghost" href="/admin/pedido-item-servicos">Cancelar</Button>
            </div>
          </form>
        )}
      </FormCard>
      <Assinatura nome="Vilson Vinicius" />
    </AdminLayout>
  );
}

export default function CriarPedidoItemServicoPage() {
  return (
    <>
      <Head><title>Vincular serviço · Controle de Lavanderia</title></Head>
      <RotaProtegida><CriarPedidoItemServico /></RotaProtegida>
    </>
  );
}
