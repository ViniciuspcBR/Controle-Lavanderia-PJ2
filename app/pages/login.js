import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/Alert';
import styles from '@/styles/Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { login, usuario, carregando } = useAuth();
  const router = useRouter();

  // Se já está logado, manda direto pro painel
  useEffect(() => {
    if (!carregando && usuario) {
      router.replace('/admin');
    }
  }, [carregando, usuario, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      router.push('/admin');
    } catch (err) {
      const mensagem = err?.response?.data?.erro
        || err?.message
        || 'Não foi possível conectar à API. Verifique se ela está rodando em http://localhost:3000.';
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Head>
        <title>Entrar · Controle de Lavanderia</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.panel}>
          <div className={styles.brandRow}>
            <span className={styles.brandMark}>CL</span>
            <span className={styles.brandName}>Controle de Lavanderia</span>
          </div>

          <h1 className={styles.title}>Entrar na conta</h1>
          <p className={styles.subtitle}>Acesse o painel para gerenciar pedidos, clientes e serviços.</p>

          <Alert type="error">{erro}</Alert>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className={styles.footerText}>
            Ainda não tem uma conta? <Link href="/cadastro">Criar conta</Link>
          </p>

          <div className={styles.seedHint}>
            <span className={styles.seedHintLabel}>Acesso de teste</span>
            admin@lavanderia.com · 123456
          </div>
        </div>
      </div>
    </>
  );
}
