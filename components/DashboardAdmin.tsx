import {useAuth} from "@/hooks/useAuth";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";

export default function DashboardAdmin() {
  const {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn
  } = useAuth();

  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (authUser?.roleId !== 2) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  // const handleLogIn = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   setIsLoggedIn(true);
  //   setAuthUser({
  //     name: "Will",
  //     lastName: "Zapata",
  //     email: "will@example.com",
  //     roleId: 1,
  //     roleName: "admin",
  //   });
  // }

  const handleLogOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoggedIn(false);
    setAuthUser(null);
  }

  if (showLoginMessage) {
    return <div>Inicia sesión. Redirigiendo a la página de login...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div>
        User: {authUser?.name ?? <span>Null</span>}
      </div>

      <button onClick={handleLogOut}>
        Log out
      </button>

      {/*<button onClick={handleLogIn}>*/}
      {/*  Log in*/}
      {/*</button>*/}
    </>
  );
}
