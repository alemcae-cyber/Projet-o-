import { createContext, useContext, useMemo, useState } from 'react';
import { USUARIOS_SEED } from './data.js';

const Ctx = createContext(null);
const ler = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem storage */ } };

// Login simples para desenvolvimento: a senha fica no navegador.
// Com back-end, login e cadastro chamam a API.
export function AuthProvider({ children }) {
  const [extras, setExtras] = useState(() => ler('edutrack.users', []));
  const [email, setEmail] = useState(() => ler('edutrack.session', null));
  const usuarios = useMemo(() => [...USUARIOS_SEED, ...extras], [extras]);
  const user = usuarios.find((u) => u.email === email) || null;

  const entrar = (e, senha) => {
    const u = usuarios.find((x) => x.email === e.trim().toLowerCase() && x.senha === senha);
    if (!u) return false;
    setEmail(u.email); gravar('edutrack.session', u.email);
    return true;
  };
  const sair = () => { setEmail(null); gravar('edutrack.session', null); };
  const cadastrar = (novo) => {
    const lista = [...extras, novo];
    setExtras(lista); gravar('edutrack.users', lista);
    setEmail(novo.email); gravar('edutrack.session', novo.email);
  };
  const emailExiste = (e) => usuarios.some((u) => u.email === e.trim().toLowerCase());

  return <Ctx.Provider value={{ user, usuarios, entrar, sair, cadastrar, emailExiste }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
