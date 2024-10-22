import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import { useAuthStore} from "@/store/auth";

export default function DashboardAdmin() {

  const authUser = useAuthStore((state) => state.userAuth);
  const setUserAuth = useAuthStore((state) => state.setUserAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (authUser?.roleId !== 1 || !isLoggedIn ) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [authUser, isLoggedIn, router]);

  const handleLogIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setUserAuth({
      id: "920959db-c4fe-482e-83bf-ea4fce08c215",
      name: "Will",
      lastName: "Zapata",
      email: "will@example.com",
      roleId: 1,
    });
  }

  const handleLogOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    useAuthStore.getState().logout();
  }

  if (showLoginMessage) {
    return <div>Inicia sesión. Redirigiendo a la página de login...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div className={'bg-amber-300'}>
        User: {authUser?.name ?? <span>Null</span>}
      </div>

      <button onClick={handleLogOut}>
        Log out
      </button>

      <button onClick={handleLogIn}>
        Log in
      </button>
    </>
  );
}
