import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AVISOS_SEED } from './data.js';

const T = createContext(() => {});
const A = createContext({ avisos: [], publicar() {} });

export function StoreProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [avisos, setAvisos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edutrack.avisos')) || AVISOS_SEED; } catch { return AVISOS_SEED; }
  });
  const mostrar = useCallback((titulo, texto) => setToast({ titulo, texto, k: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);
  const publicar = (a) => setAvisos((l) => {
    const n = [a, ...l];
    try { localStorage.setItem('edutrack.avisos', JSON.stringify(n)); } catch { /* sem storage */ }
    return n;
  });

  return (
    <T.Provider value={mostrar}>
      <A.Provider value={{ avisos, publicar }}>
        {children}
        <div className="toast-area" role="status" aria-live="polite">
          {toast && (
            <div className="toast" key={toast.k}>
              <strong>{toast.titulo}</strong>
              <p>{toast.texto}</p>
              <button type="button" className="btn" onClick={() => setToast(null)}>OK</button>
            </div>
          )}
        </div>
      </A.Provider>
    </T.Provider>
  );
}
export const useToast = () => useContext(T);
export const useAvisos = () => useContext(A);
