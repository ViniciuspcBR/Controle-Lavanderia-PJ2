import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace('/login');
    }
  }, [carregando, usuario, router]);

  if (carregando || !usuario) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-ink-soft)',
        fontFamily: 'var(--font-body)',
      }}>
        Carregando…
      </div>
    );
  }

  return children;
}
