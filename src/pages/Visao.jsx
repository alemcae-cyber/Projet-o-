import { Alerta, Barra, Card, Kpi, LineChart } from '../ui.jsx';
import { ALUNOS, BIM, alertas, freqMedia, notaMedia, porDisciplina, serie, textoAlerta } from '../data.js';

// Bloco de desempenho reutilizado por aluno, responsável, professor e coordenação.
// lista = alunos do recorte (1 aluno, uma turma, uma escola ou a rede toda).
export default function Visao({ lista, individual, turmaLista, ranking, rankingTitulo, acao }) {
  const s = serie(lista);
  const fm = freqMedia(lista), nm = notaMedia(lista);
  const aten = lista.filter((a) => alertas(a).length).length;
  const disc = porDisciplina(lista);
  const discT = individual && turmaLista ? porDisciplina(turmaLista) : null;
  const nome1 = individual ? lista[0].nome.split(' ')[0] : '';
  const al = individual ? alertas(lista[0]) : [];

  return (
    <>
      <div className="kpis">
        <Kpi rotulo="Frequência" valor={`${fm}%`} tom={fm < 75 ? 'ruim' : ''} dica={fm < 75 ? 'Abaixo do mínimo de 75%' : ''} />
        <Kpi rotulo="Média" valor={nm.toFixed(1)} />
        {!individual && <Kpi rotulo="Alunos" valor={lista.length} />}
        {!individual && <Kpi rotulo="Em atenção" valor={aten} tom={aten ? 'ruim' : ''} />}
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

      <Card titulo="Notas por disciplina">
        {disc.map((d, i) => (
          <Barra key={d.nome} rotulo={d.nome} valor={d.media} max={10} tom={d.media < 6 ? 'ruim' : ''} marca={discT ? discT[i].media : undefined} />
        ))}
        {discT && <p className="nota">O traço escuro marca a média da turma.</p>}
      </Card>

      {individual && turmaLista && (
        <Card titulo={`${nome1} em relação à turma e à rede`}>
          <h3>Frequência</h3>
          <Barra rotulo={nome1} valor={fm} sufixo="%" tom={fm < 75 ? 'ruim' : ''} />
          <Barra rotulo="Turma" valor={freqMedia(turmaLista)} sufixo="%" />
          <Barra rotulo="Rede" valor={freqMedia(ALUNOS)} sufixo="%" />
          <h3>Média</h3>
          <Barra rotulo={nome1} valor={nm} max={10} />
          <Barra rotulo="Turma" valor={notaMedia(turmaLista)} max={10} />
          <Barra rotulo="Rede" valor={notaMedia(ALUNOS)} max={10} />
        </Card>
      )}

      {ranking && (
        <Card titulo={rankingTitulo}>
          {ranking.map((r) => <Barra key={r.rotulo} rotulo={r.rotulo} valor={r.valor} sufixo="%" tom={r.valor < 75 ? 'ruim' : ''} />)}
        </Card>
      )}

      {individual ? (
        al.length
          ? <Alerta titulo="Alerta pedagógico">{textoAlerta(lista[0])}</Alerta>
          : <Alerta tom="ok" titulo="Tudo em dia">Frequência e notas estão dentro do esperado.</Alerta>
      ) : aten ? (
        <Alerta titulo="Sinais de atenção">{`${aten} de ${lista.length} alunos têm frequência abaixo de 75% ou notas em queda.`}</Alerta>
      ) : (
        <Alerta tom="ok" titulo="Tudo em dia">Nenhum aluno com sinal de atenção neste recorte.</Alerta>
      )}
      {acao}
    </>
  );
}
