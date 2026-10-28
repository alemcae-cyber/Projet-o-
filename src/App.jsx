import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import { StoreProvider } from './store.jsx';
import Layout from './Layout.jsx';
import Entrar from './pages/Entrar.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Desempenho from './pages/Desempenho.jsx';
import Painel from './pages/Painel.jsx';
import Alunos from './pages/Alunos.jsx';
import Ficha from './pages/Ficha.jsx';
import Comunicados from './pages/Comunicados.jsx';
import { PERFIS } from './data.js';

function Guarda({ perfis, children }) {
  const { user } = useAuth();
  return perfis.includes(user.perfil) ? children : <Navigate to={PERFIS[user.perfil].home} replace />;
}

export function Rotas() {
  const { user } = useAuth();
  const home = user ? PERFIS[user.perfil].home : '/entrar';
  return (
    <Routes>
      <Route path="/entrar" element={user ? <Navigate to={home} replace /> : <Entrar />} />
      <Route path="/cadastro" element={user ? <Navigate to={home} replace /> : <Cadastro />} />
      <Route element={user ? <Layout /> : <Navigate to="/entrar" replace />}>
        <Route path="/desempenho" element={<Guarda perfis={['aluno', 'responsavel']}><Desempenho /></Guarda>} />
        <Route path="/painel" element={<Guarda perfis={['coordenacao', 'secretaria']}><Painel /></Guarda>} />
        <Route path="/alunos" element={<Guarda perfis={['coordenacao', 'professor']}><Alunos /></Guarda>} />
        <Route path="/alunos/:id" element={<Guarda perfis={['coordenacao', 'professor']}><Ficha /></Guarda>} />
        <Route path="/comunicados" element={<Comunicados />} />
      </Route>
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </StoreProvider>
  );
}
