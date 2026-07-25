import { create } from 'zustand';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';
import { CORREO_AUTORIZADO } from '@/shared/constants/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginConGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  error: null,
  loginConGoogle: async () => {
    set({ error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== CORREO_AUTORIZADO) {
        await signOut(auth);
        set({ error: 'Esta aplicación es privada y solo un correo tiene acceso.' });
      }
    } catch (err) {
      console.error('Error de Google Sign-In:', err);
      set({ error: 'No se pudo iniciar sesión. Intenta de nuevo.' });
    }
  },
  logout: async () => {
    await signOut(auth);
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});
