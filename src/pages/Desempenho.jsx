import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Campo, Segmentos } from '../ui.jsx';
import Visao from './Visao.jsx';
import { ALUNOS, ESCOLAS, TURMAS, alunoPorId, escolaPorId, freqMedia, turmaPorId } from '../data.js';

export default function Desempenho() {
  const { user } = useAuth();
  const filhos = (user.alunoIds || []).map(alunoPorId).filter(Boolean);
  const [fid, setFid] = useState(filhos[0]?.id);
  const [escopo, setEscopo] = useState('individual');
  const a = filhos.find((f) => f.id === fid) || filhos[0];

  if (!a) {
    return (
      <div className="col">
        <h1>Nenhum aluno vinculado</h1>
        <p className="suave">Peça à secretaria da escola para vincular a matrícula à sua conta.</p>
        <Link className="btn vazio" to="/comunicados">Ver comunicados</Link>
      </div>
    );
  }

  const eAluno = user.perfil === 'aluno';
  const turma = turmaPorId(a.turmaId), escola = escolaPorId(turma.escolaId);
  const doTurma = ALUNOS.filter((x) => x.turmaId === a.turmaId);
  const lista = escopo === 'individual' ? [a] : escopo === 'turma' ? doTurma : ALUNOS;
  const titulo = { individual: a.nome, turma: `Turma ${turma.nome}`, rede: 'Rede municipal' }[escopo];
  const sub = {
    individual: `Turma ${turma.nome} · ${escola.nome}`,
    turma: `${escola.nome} · ${doTurma.length} alunos`,
    rede: `${ESCOLAS.length} escolas · ${ALUNOS.length} alunos`,
  }[escopo];
  const ranking = escopo === 'rede'
    ? TURMAS.map((t) => ({ rotulo: `${t.nome} · ${escolaPorId(t.escolaId).nome}`, valor: freqMedia(ALUNOS.filter((x) => x.turmaId === t.id)) }))
    : null;

  return (
    <div className="col">
      <header className="cab">
        <h1>{titulo}</h1>
        <p className="suave">{sub}</p>
      </header>
      <div className="barra-filtros">
        <Segmentos
          rotulo="O que você quer ver"
          valor={escopo}
          onChange={setEscopo}
          itens={[['individual', eAluno ? 'Eu' : 'Meu filho'], ['turma', 'Turma'], ['rede', 'Toda a rede']]}
        />
        {filhos.length > 1 && (
          <Campo id="filho" rotulo="Filho" as="select" value={fid} onChange={(e) => setFid(e.target.value)}>
            {filhos.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </Campo>
        )}
      </div>
      <Visao
        lista={lista}
        individual={escopo === 'individual'}
        turmaLista={doTurma}
        ranking={ranking}
        rankingTitulo="Frequência por turma"
        acao={<Link className="btn vazio" to="/comunicados">Ver comunicados</Link>}
      />
    </div>
  );
}
