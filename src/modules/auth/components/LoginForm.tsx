import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MONTEVITO_URL } from '@/shared/lib/assets';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const ok = await login(email, password);
    setEnviando(false);
    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-montevo-negroPuro px-4">
      <Card className="w-full max-w-sm bg-montevo-crema">
        <CardHeader className="items-center text-center">
          <img src={MONTEVITO_URL} alt="Montevo Studio" className="mb-2 h-16 w-16 object-contain" />
          <CardTitle className="font-display text-2xl">montevo · studio</CardTitle>
          <CardDescription>Ingresa a tu cuenta para gestionar los clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              {error && (
                <p className="text-sm text-destructive">
                  Correo o contraseña incorrectos. Intenta de nuevo.
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
