import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Barra, Card, Kpi, LineChart } from '../ui.jsx';
import { ALUNOS, BIM, ESCOLAS, TURMAS, alertas, escolaPorId, freqAtual, freqMedia, notaMedia, serie, turmaPorId } from '../data.js';

export default function Painel() {
  const { user } = useAuth();
  const rede = user.perfil === 'secretaria';
  const lista = rede ? ALUNOS : ALUNOS.filter((a) => turmaPorId(a.turmaId).escolaId === user.escolaId);
  const turmas = TURMAS.filter((t) => lista.some((a) => a.turmaId === t.id));
  const aten = lista.filter((a) => alertas(a).length).sort((a, b) => freqAtual(a) - freqAtual(b));
  const s = serie(lista);
  const fm = freqMedia(lista);
  const barras = rede
    ? ESCOLAS.map((e) => ({ rotulo: e.nome, valor: freqMedia(ALUNOS.filter((a) => turmaPorId(a.turmaId).escolaId === e.id)) }))
    : turmas.map((t) => ({ rotulo: t.nome, valor: freqMedia(lista.filter((a) => a.turmaId === t.id)) }));

  return (
    <div className="col">
      <h1>Painel</h1>
      <div className="banner">
        <h2>{rede ? 'Olá, Secretaria' : 'Olá, Coordenação'}</h2>
        <p>Acompanhe frequência e desempenho {rede ? 'da rede' : 'da escola'}.</p>
      </div>
      <div className="kpis">
        <Kpi rotulo="Estudantes" valor={lista.length} />
        <Kpi rotulo="Turmas" valor={turmas.length} />
        <Kpi rotulo="Frequência média" valor={`${fm}%`} tom={fm < 75 ? 'ruim' : ''} />
        <Kpi rotulo="Média das notas" valor={notaMedia(lista).toFixed(1)} />
        <Kpi rotulo="Em alerta" valor={aten.length} tom={aten.length ? 'ruim' : ''} />
      </div>
      <div className="duas">
        <Card titulo={rede ? 'Frequência por escola' : 'Frequência por turma'}>
          {barras.map((b) => <Barra key={b.rotulo} rotulo={b.rotulo} valor={b.valor} sufixo="%" tom={b.valor < 75 ? 'ruim' : ''} />)}
        </Card>
        <Card titulo="Estudantes em atenção">
          {aten.length === 0 && <p className="suave">Nenhum estudante em atenção agora.</p>}
          <ul className="lista">
            {aten.slice(0, 6).map((a) => {
              const t = turmaPorId(a.turmaId);
              const linha = (
                <>
                  <span><b>{a.nome}</b><small>{t.nome}{rede ? ` · ${escolaPorId(t.escolaId).nome}` : ''}</small></span>
                  <strong className="ruim">{freqAtual(a)}%</strong>
                </>
              );
              return <li key={a.id}>{rede ? <div className="linha">{linha}</div> : <Link className="linha" to={`/alunos/${a.id}`}>{linha}</Link>}</li>;
            })}
          </ul>
        </Card>
      </div>
      <Card titulo="Evolução">
        <LineChart
          labels={BIM}
          desc="Evolução da frequência e das notas por bimestre"
          series={[
            { nome: 'Frequência (%)', cor: '#8b5cf6', texto: '#6d28d9', valores: s.freq, escala: 1 },
            { nome: 'Notas por bimestre', cor: '#fbbf24', texto: '#8a5a12', valores: s.nota, escala: 10 },
          ]}
        />
      </Card>
    </div>
  );
}
