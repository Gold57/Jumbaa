import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AuthLayout() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userLoggedIn = token !== null;

    if (!userLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, []);

  return null; // or your layout JSX
}
