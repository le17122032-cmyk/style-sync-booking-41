import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { userProfileDB, type DBUserProfile } from "@/lib/indexedDB";
import { localUsersDB } from "@/lib/localAuth";

interface AuthContextType {
  user: DBUserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DBUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const sessionEmail = localStorage.getItem("stylesync_session");
    if (sessionEmail) {
      userProfileDB.get().then((profile) => {
        if (profile) setUser(profile);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const storedUser = await localUsersDB.getByEmail(email);
    if (!storedUser) return { error: "No existe una cuenta con ese correo" };

    const hash = await hashPassword(password);
    if (hash !== storedUser.passwordHash) return { error: "Contraseña incorrecta" };

    const profile: DBUserProfile = {
      id: "current",
      name: storedUser.name,
      email: storedUser.email,
    };
    await userProfileDB.save(profile);
    localStorage.setItem("stylesync_session", email);
    setUser(profile);
    return {};
  };

  const register = async (name: string, email: string, password: string) => {
    const existing = await localUsersDB.getByEmail(email);
    if (existing) return { error: "Ya existe una cuenta con ese correo" };

    const hash = await hashPassword(password);
    await localUsersDB.save({ email, name, passwordHash: hash });

    const profile: DBUserProfile = { id: "current", name, email };
    await userProfileDB.save(profile);
    localStorage.setItem("stylesync_session", email);
    setUser(profile);
    return {};
  };

  const logout = async () => {
    await userProfileDB.delete();
    localStorage.removeItem("stylesync_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "stylesync_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
