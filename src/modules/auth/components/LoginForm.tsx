import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MONTEVITO_URL } from '@/shared/lib/assets';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(password);
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
          <CardDescription>Ingresa tu clave para gestionar los clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Clave de acceso</Label>
              <Input
                id="password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              {error && (
                <p className="text-sm text-destructive">Clave incorrecta. Intenta de nuevo.</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
