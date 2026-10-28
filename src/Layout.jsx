import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { Logo } from './ui.jsx';
import { NAV, PERFIS } from './data.js';

export default function Layout() {
  const { user, sair } = useAuth();
  const itens = NAV[user.perfil];
  const perfil = PERFIS[user.perfil].curto;
  const cls = ({ isActive }) => (isActive ? 'ativo' : undefined);
  return (
    <div className="app">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <aside className="menu">
        <Logo />
        <p className="perfil">Perfil: {perfil}</p>
        <nav aria-label="Principal">
          {itens.map(([to, ic, txt]) => <NavLink key={to} to={to} className={cls}><span aria-hidden="true">{ic}</span>{txt}</NavLink>)}
        </nav>
        <button type="button" className="sair" onClick={sair}>Sair</button>
      </aside>
      <header className="topo">
        <Logo />
        <span>{perfil}</span>
        <button type="button" className="sair" onClick={sair}>Sair</button>
      </header>
      <main id="conteudo" tabIndex={-1}><Outlet /></main>
      <nav className="abas" aria-label="Principal no celular">
        {itens.map(([to, ic, , curto]) => <NavLink key={to} to={to} className={cls}><span aria-hidden="true">{ic}</span>{curto}</NavLink>)}
      </nav>
    </div>
  );
}
