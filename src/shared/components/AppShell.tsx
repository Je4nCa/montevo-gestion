import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Users } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { cn } from '@/shared/lib/utils';
import { MONTEVITO_URL } from '@/shared/lib/assets';

export function AppShell({ children }: { children: ReactNode }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex items-center justify-between bg-montevo-negroPuro px-4 py-3 text-montevo-crema md:w-64 md:flex-col md:items-start md:justify-start md:gap-8 md:px-6 md:py-8">
        <div className="flex items-center gap-2">
          <img src={MONTEVITO_URL} alt="" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg">montevo · studio</span>
        </div>

        <nav className="flex items-center gap-1 md:w-full md:flex-col md:items-stretch md:gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-montevo-cafeOscuro/40',
                isActive && 'bg-montevo-cafe text-montevo-crema',
              )
            }
          >
            <Users className="h-4 w-4" />
            Clientes
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-montevo-crema/80 transition-colors hover:bg-montevo-cafeOscuro/40 hover:text-montevo-crema md:w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </header>

      <main className="flex-1 bg-montevo-crema px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
