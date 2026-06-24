import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import bcrypt from 'bcryptjs';
import usuariosService from '@/services/usuariosService';
import Alert from '@/components/Alert';
import styles from '@/styles/Login.module.css';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmaSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setEnviando(true);
    try {
      const { data: usuarios } = await usuariosService.listar();
      const jaExiste = usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (jaExiste) {
        setErro('Já existe uma conta com esse e-mail.');
        setEnviando(false);
        return;
      }

      const senha_hash = bcrypt.hashSync(senha, 10);
      await usuariosService.criar({
        nome,
        email,
        senha_hash,
        perfil: 'operador',
        ativo: true,
      });

      router.push('/login');
    } catch (err) {
      setErro(
        err?.response?.data?.erro
          || 'Não foi possível conectar à API. Verifique se ela está rodando em http://localhost:3000.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Head>
        <title>Criar conta · Controle de Lavanderia</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.panel}>
          <div className={styles.brandRow}>
            <span className={styles.brandMark}>CL</span>
            <span className={styles.brandName}>Controle de Lavanderia</span>
          </div>

          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Cadastre-se para acessar o painel administrativo.</p>

          <Alert type="error">{erro}</Alert>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                required
                autoFocus
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
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
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirmaSenha">Confirmar senha</label>
              <input
                id="confirmaSenha"
                type="password"
                required
                placeholder="Repita a senha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={enviando}>
              {enviando ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>

          <p className={styles.footerText}>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </>
  );
}
