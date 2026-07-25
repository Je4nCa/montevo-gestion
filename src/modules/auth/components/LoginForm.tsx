import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MONTEVITO_URL } from '@/shared/lib/assets';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function LoginForm() {
  const [enviando, setEnviando] = useState(false);
  const loginConGoogle = useAuthStore((s) => s.loginConGoogle);
  const error = useAuthStore((s) => s.error);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  async function handleClick() {
    setEnviando(true);
    await loginConGoogle();
    setEnviando(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-montevo-negroPuro px-4">
      <Card className="w-full max-w-sm bg-montevo-crema">
        <CardHeader className="items-center text-center">
          <img src={MONTEVITO_URL} alt="Montevo Studio" className="mb-2 h-16 w-16 object-contain" />
          <CardTitle className="font-display text-2xl">montevo · studio</CardTitle>
          <CardDescription>Ingresa con tu cuenta de Google para gestionar los clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-3 bg-white"
              onClick={handleClick}
              disabled={enviando}
            >
              <GoogleIcon />
              {enviando ? 'Entrando…' : 'Continuar con Google'}
            </Button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
