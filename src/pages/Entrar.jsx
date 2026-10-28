import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Campo, Logo } from '../ui.jsx';
import { PERFIS } from '../data.js';

export default function Entrar() {
  const { entrar } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function enviar(ev) {
    ev.preventDefault();
    if (!entrar(email, senha)) setErro('E-mail ou senha incorretos. Confira os dados e tente de novo.');
  }

  return (
    <main className="entrar" id="conteudo">
      <Logo />
      {!perfil ? (
        <>
          <h1 className="sr-only">Entrar no EduTrack</h1>
          <p className="suave">Escolha seu perfil para entrar.</p>
          <ul className="perfis">
            {Object.entries(PERFIS).map(([k, p]) => (
              <li key={k}>
                <button type="button" onClick={() => { setPerfil(k); setEmail(''); setSenha(''); setErro(''); }}>
                  <span><b>{p.titulo}</b><small>{p.desc}</small></span>
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="suave">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </>
      ) : (
        <form onSubmit={enviar} noValidate className="form">
          <button type="button" className="btn vazio pequeno" onClick={() => setPerfil(null)}>Trocar perfil</button>
          <h1>Entrar como {PERFIS[perfil].curto.toLowerCase()}</h1>
          <Campo id="email" rotulo="E-mail" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Campo id="senha" rotulo="Senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erro} />
          <button className="btn" type="submit">Entrar</button>
          <p className="suave">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      )}
    </main>
  );
}
