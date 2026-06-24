import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';
import usuariosService from '@/services/usuariosService';

const STORAGE_KEY = 'lavanderia_usuario_logado';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  // Recupera sessão salva no navegador ao iniciar a aplicação
  useEffect(() => {
    const salvo = window.localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setCarregando(false);
  }, []);

  // Confere e-mail e senha contra a lista de usuários da API
  async function login(email, senha) {
    const { data: usuarios } = await usuariosService.listar();
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!encontrado) {
      throw new Error('E-mail ou senha incorretos.');
    }
    if (encontrado.ativo === false) {
      throw new Error('Este usuário está inativo. Fale com um administrador.');
    }

    const senhaConfere = bcrypt.compareSync(senha, encontrado.senha_hash || '');
    if (!senhaConfere) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const { senha_hash, ...usuarioSemSenha } = encontrado;
    setUsuario(usuarioSemSenha);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioSemSenha));
    return usuarioSemSenha;
  }

  function logout() {
    setUsuario(null);
    window.localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
