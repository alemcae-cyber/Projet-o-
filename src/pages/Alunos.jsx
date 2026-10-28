import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Campo } from '../ui.jsx';
import { ALUNOS, TURMAS, alertas, freqAtual, freqMedia, mediaAluno, notaMedia, podeVer, turmaPorId } from '../data.js';

export default function Alunos() {
  const { user } = useAuth();
  const base = ALUNOS.filter((a) => podeVer(user, a));
  const turmas = TURMAS.filter((t) => base.some((a) => a.turmaId === t.id));
  const [turma, setTurma] = useState('todas');
  const [q, setQ] = useState('');
  const lista = base.filter((a) => (turma === 'todas' || a.turmaId === turma) && a.nome.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="col">
      <h1>{user.perfil === 'professor' ? 'Turmas e alunos' : 'Alunos'}</h1>
      <div className="turmas" role="group" aria-label="Filtrar por turma">
        <button type="button" aria-pressed={turma === 'todas'} onClick={() => setTurma('todas')}>
          <b>Todas</b><small>Freq. {freqMedia(base)}% · Média {notaMedia(base).toFixed(1)}</small>
        </button>
        {turmas.map((t) => {
          const l = base.filter((a) => a.turmaId === t.id);
          return (
            <button key={t.id} type="button" aria-pressed={turma === t.id} onClick={() => setTurma(t.id)}>
              <b>{t.nome}</b><small>Freq. {freqMedia(l)}% · Média {notaMedia(l).toFixed(1)}</small>
            </button>
          );
        })}
      </div>
      <Campo id="busca" rotulo="Buscar aluno" type="search" placeholder="Digite o nome" value={q} onChange={(e) => setQ(e.target.value)} />
      <p className="suave" aria-live="polite">{lista.length} {lista.length === 1 ? 'aluno' : 'alunos'}</p>
      {lista.length === 0 && <p>Nenhum aluno encontrado. Limpe a busca ou escolha outra turma.</p>}
      <ul className="lista">
        {lista.map((a) => {
          const em = alertas(a).length > 0;
          return (
            <li key={a.id}>
              <Link className="linha" to={`/alunos/${a.id}`}>
                <span><b>{a.nome}</b><small>{turmaPorId(a.turmaId).nome} · matrícula {a.matricula}</small></span>
                <span className="nums">
                  <strong className={freqAtual(a) < 75 ? 'ruim' : ''}>{freqAtual(a)}%</strong>
                  <small>Média {mediaAluno(a).toFixed(1)}</small>
                </span>
                <span className={`selo ${em ? 'ruim' : 'ok'}`}>{em ? '⚠ Em atenção' : '✓ Em dia'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
