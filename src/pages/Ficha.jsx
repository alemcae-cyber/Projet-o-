import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useToast } from '../store.jsx';
import Visao from './Visao.jsx';
import { ALUNOS, alertas, alunoPorId, escolaPorId, podeVer, turmaPorId } from '../data.js';

export default function Ficha() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const a = alunoPorId(id);
  if (!a || !podeVer(user, a)) {
    return (
      <div className="col">
        <h1>Aluno não encontrado</h1>
        <p className="suave">Ele não existe ou não faz parte das suas turmas.</p>
        <Link className="btn vazio" to="/alunos">Voltar para alunos</Link>
      </div>
    );
  }
  const t = turmaPorId(a.turmaId);
  const plano = user.perfil === 'coordenacao' && alertas(a).length > 0;
  return (
    <div className="col">
      <Link className="btn vazio pequeno" to="/alunos">Voltar</Link>
      <header className="cab">
        <h1>{a.nome}</h1>
        <p className="suave">Turma {t.nome} · {escolaPorId(t.escolaId).nome} · matrícula {a.matricula}</p>
      </header>
      <Visao
        lista={[a]}
        individual
        turmaLista={ALUNOS.filter((x) => x.turmaId === a.turmaId)}
        acao={plano && (
          <button type="button" className="btn" onClick={() => toast('Plano salvo', `O plano de acompanhamento de ${a.nome} foi criado.`)}>
            Criar plano de acompanhamento
          </button>
        )}
      />
    </div>
  );
}
