"use client";

import { AuthSession } from "@/schema/auth";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useSession, useUser } from "../hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";

type AuthContextProps = {
  session?: AuthSession | null;
  setSession: (session: AuthSession) => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  session: null,
  setSession: () => {},
  refresh: () => {},
});

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, setSession, isAuthenticated, clearSession } = useSession();
  const { refetch, isFetching, data, error } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isFetching) return;
    if (data && !error) {
      setSession({ user: data });
    } else {
      clearSession();
    }
  }, [isFetching, data, error, setSession, clearSession]);

  useEffect(() => {
    if (isFetching) return;
    console.log(session)
    const authenticated = isAuthenticated();
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    if (authenticated && session?.user.hasOnBoarded) {
      if (isPublic || pathname.startsWith("/onboarding")) {
        router.replace("/dashboard");
      }
    } else if (authenticated) {
      if (!pathname.startsWith("/onboarding")) {
        router.replace("/onboarding");
      }
    } else if (!isPublic) {
      router.replace("/login");
    }
  }, [isFetching, session, pathname, router, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ session, setSession, refresh: refetch }}>
      {!isFetching ? children : <>Loading...</>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext provider is added as a wrapper component");
  }

  return auth;
}
