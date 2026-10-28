import { useState } from 'react';
import { useAuth } from '../auth.jsx';
import { useAvisos, useToast } from '../store.jsx';
import { Campo } from '../ui.jsx';
import { ESCOLAS, escolaDoUsuario, escolaPorId } from '../data.js';

export default function Comunicados() {
  const { user } = useAuth();
  const { avisos, publicar } = useAvisos();
  const toast = useToast();
  const minha = escolaDoUsuario(user);
  const pode = ['professor', 'coordenacao', 'secretaria'].includes(user.perfil);
  const destinos = user.perfil === 'secretaria'
    ? [['todos', 'Toda a rede'], ...ESCOLAS.map((e) => [e.id, e.nome])]
    : [[minha, 'Minha escola']];
  const [f, setF] = useState({ titulo: '', texto: '', alvo: destinos[0][0] });
  const [e, setE] = useState({});

  const visiveis = avisos.filter((v) => user.perfil === 'secretaria' || v.alvo === 'todos' || v.alvo === minha);

  function enviar(ev) {
    ev.preventDefault();
    const er = {};
    if (!f.titulo.trim()) er.titulo = 'Escreva um título.';
    if (f.texto.trim().length < 10) er.texto = 'Escreva a mensagem (mínimo de 10 letras).';
    setE(er);
    if (Object.keys(er).length) return;
    publicar({ id: Date.now(), titulo: f.titulo.trim(), texto: f.texto.trim(), autor: user.nome, data: new Date().toLocaleDateString('pt-BR'), alvo: f.alvo });
    setF({ ...f, titulo: '', texto: '' });
    toast('Comunicado enviado', 'Seu comunicado já aparece para os destinatários.');
  }

  return (
    <div className="col">
      <h1>Comunicados</h1>
      {pode && (
        <form className="card form" onSubmit={enviar} noValidate>
          <h2>Novo comunicado</h2>
          <Campo id="titulo" rotulo="Título" value={f.titulo} erro={e.titulo} onChange={(x) => setF({ ...f, titulo: x.target.value })} />
          <Campo id="texto" rotulo="Mensagem" as="textarea" rows={4} value={f.texto} erro={e.texto} onChange={(x) => setF({ ...f, texto: x.target.value })} />
          <Campo id="alvo" rotulo="Enviar para" as="select" value={f.alvo} onChange={(x) => setF({ ...f, alvo: x.target.value })}>
            {destinos.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </Campo>
          <button className="btn" type="submit">Enviar comunicado</button>
        </form>
      )}
      {visiveis.length === 0 && <p className="suave">Nenhum comunicado por enquanto.</p>}
      {visiveis.map((v) => (
        <article className="card aviso" key={v.id}>
          <h2>{v.titulo}</h2>
          <p>{v.texto}</p>
          <small>{v.autor} · {v.data} · {v.alvo === 'todos' ? 'Toda a rede' : escolaPorId(v.alvo)?.nome}</small>
        </article>
      ))}
    </div>
  );
}
