import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useToast } from '../store.jsx';
import { Campo, Logo } from '../ui.jsx';
import { ALUNOS, ESCOLAS, PERFIS, TURMAS, escolaPorId, turmaPorId } from '../data.js';
import { cpfValido, emailValido, mascaraCpf, mascaraTel, mascararNome } from '../util.js';

const PASSOS = ['Perfil', 'Seus dados', 'Vínculo', 'Revisão'];
const TIPOS = [
  ['aluno', 'Aluno', 'Acompanhe suas notas e sua frequência.'],
  ['responsavel', 'Responsável', 'Acompanhe o desempenho do seu filho.'],
  ['professor', 'Professor', 'Veja suas turmas e envie comunicados.'],
];
const PARENTESCOS = ['Mãe', 'Pai', 'Avó ou avô', 'Tio ou tia', 'Outro responsável legal'];
const hoje = new Date().toISOString().slice(0, 10);

export default function Cadastro() {
  const { cadastrar, emailExiste, usuarios } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [passo, setPasso] = useState(0);
  const [e, setE] = useState({});
  const [f, setF] = useState({
    perfil: '', nome: '', cpf: '', nasc: '', tel: '', email: '', senha: '', conf: '',
    matricula: '', parentesco: '', escolaId: '', turmaIds: [], aceite: false,
  });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const aluno = ALUNOS.find((a) => a.matricula === f.matricula.trim());
  const prof = f.perfil === 'professor';

  function validar(p) {
    const er = {};
    if (p === 0 && !f.perfil) er.perfil = 'Escolha um perfil para continuar.';
    if (p === 1) {
      if (f.nome.trim().split(/\s+/).length < 2) er.nome = 'Informe nome e sobrenome.';
      if (f.perfil !== 'aluno' && !cpfValido(f.cpf)) er.cpf = 'CPF inválido. Confira os 11 números.';
      if (!f.nasc) er.nasc = 'Informe a data de nascimento.';
      else if (f.nasc > hoje) er.nasc = 'A data não pode estar no futuro.';
      if (f.tel.replace(/\D/g, '').length < 10) er.tel = 'Informe o telefone com DDD.';
      if (!emailValido(f.email)) er.email = 'Informe um e-mail válido, como nome@email.com.';
      else if (emailExiste(f.email)) er.email = 'Este e-mail já tem conta. Entre ou use outro e-mail.';
      if (f.senha.length < 6) er.senha = 'Use pelo menos 6 caracteres.';
      if (f.conf !== f.senha) er.conf = 'As senhas não são iguais.';
    }
    if (p === 2) {
      if (prof) {
        if (!f.escolaId) er.escolaId = 'Escolha a escola.';
        if (!f.turmaIds.length) er.turmaIds = 'Marque pelo menos uma turma.';
      } else {
        if (!aluno) er.matricula = 'Matrícula não encontrada. Confira o número no boletim (exemplo: 2026-0001).';
        else if (f.perfil === 'aluno' && usuarios.some((u) => u.perfil === 'aluno' && u.alunoIds.includes(aluno.id))) er.matricula = 'Esta matrícula já tem conta de aluno.';
        if (f.perfil === 'responsavel' && !f.parentesco) er.parentesco = 'Informe o parentesco.';
      }
    }
    if (p === 3 && !f.aceite) er.aceite = 'É preciso aceitar para criar a conta.';
    return er;
  }

  const focarErro = () => setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0);

  function avancar(ev) {
    ev.preventDefault();
    const er = validar(passo);
    setE(er);
    if (Object.keys(er).length) { focarErro(); return; }
    if (passo < 3) { setPasso(passo + 1); return; }
    cadastrar({
      email: f.email.trim().toLowerCase(), senha: f.senha, perfil: f.perfil, nome: f.nome.trim(),
      cpf: f.cpf, tel: f.tel, nasc: f.nasc,
      ...(prof ? { escolaId: f.escolaId, turmaIds: f.turmaIds } : { alunoIds: [aluno.id], parentesco: f.parentesco }),
    });
    toast('Conta criada', `Bem-vindo(a), ${f.nome.trim().split(' ')[0]}.`);
    nav(PERFIS[f.perfil].home);
  }

  const turmasDaEscola = TURMAS.filter((t) => t.escolaId === f.escolaId);
  const alternar = (id) => set('turmaIds', f.turmaIds.includes(id) ? f.turmaIds.filter((x) => x !== id) : [...f.turmaIds, id]);

  return (
    <main className="entrar largo" id="conteudo">
      <Logo />
      <h1>Criar conta</h1>
      <ol className="passos" aria-label="Etapas do cadastro">
        {PASSOS.map((p, i) => (
          <li key={p} aria-current={i === passo ? 'step' : undefined} className={i < passo ? 'feito' : ''}>
            <span aria-hidden="true">{i < passo ? '✓' : i + 1}</span>{p}
          </li>
        ))}
      </ol>

      <form className="form" onSubmit={avancar} noValidate>
        {passo === 0 && (
          <fieldset>
            <legend>Quem é você?</legend>
            {TIPOS.map(([v, t, d]) => (
              <label key={v} className={`opcao ${f.perfil === v ? 'on' : ''}`}>
                <input type="radio" name="perfil" value={v} checked={f.perfil === v} onChange={() => set('perfil', v)} aria-invalid={e.perfil ? true : undefined} />
                <span><b>{t}</b><small>{d}</small></span>
              </label>
            ))}
            {e.perfil && <small className="erro" role="alert">{e.perfil}</small>}
            <p className="suave">Coordenação e Secretaria são criadas pela rede de ensino, não por aqui.</p>
          </fieldset>
        )}

        {passo === 1 && (
          <>
            <Campo id="nome" rotulo="Nome completo" autoComplete="name" value={f.nome} erro={e.nome} onChange={(x) => set('nome', x.target.value)} />
            {f.perfil !== 'aluno' && <Campo id="cpf" rotulo="CPF" inputMode="numeric" placeholder="000.000.000-00" value={f.cpf} erro={e.cpf} onChange={(x) => set('cpf', mascaraCpf(x.target.value))} />}
            <Campo id="nasc" rotulo="Data de nascimento" type="date" max={hoje} autoComplete="bday" value={f.nasc} erro={e.nasc} onChange={(x) => set('nasc', x.target.value)} />
            <Campo id="tel" rotulo="Telefone com DDD" type="tel" inputMode="tel" autoComplete="tel" placeholder="(81) 90000-0000" value={f.tel} erro={e.tel} onChange={(x) => set('tel', mascaraTel(x.target.value))} />
            <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" value={f.email} erro={e.email} onChange={(x) => set('email', x.target.value)} />
            <Campo id="senha" rotulo="Senha" type="password" autoComplete="new-password" dica="Mínimo de 6 caracteres." value={f.senha} erro={e.senha} onChange={(x) => set('senha', x.target.value)} />
            <Campo id="conf" rotulo="Repita a senha" type="password" autoComplete="new-password" value={f.conf} erro={e.conf} onChange={(x) => set('conf', x.target.value)} />
          </>
        )}

        {passo === 2 && (prof ? (
          <>
            <Campo id="escolaId" rotulo="Escola" as="select" value={f.escolaId} erro={e.escolaId} onChange={(x) => setF((y) => ({ ...y, escolaId: x.target.value, turmaIds: [] }))}>
              <option value="">Escolha a escola</option>
              {ESCOLAS.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </Campo>
            <fieldset>
              <legend>Turmas em que você dá aula</legend>
              {!f.escolaId && <p className="suave">Escolha a escola para ver as turmas.</p>}
              {turmasDaEscola.map((t) => (
                <label key={t.id} className={`opcao ${f.turmaIds.includes(t.id) ? 'on' : ''}`}>
                  <input type="checkbox" checked={f.turmaIds.includes(t.id)} onChange={() => alternar(t.id)} aria-invalid={e.turmaIds ? true : undefined} />
                  <span><b>{t.nome}</b></span>
                </label>
              ))}
              {e.turmaIds && <small className="erro" role="alert">{e.turmaIds}</small>}
            </fieldset>
          </>
        ) : (
          <>
            <Campo id="matricula" rotulo={f.perfil === 'aluno' ? 'Sua matrícula' : 'Matrícula do aluno'} placeholder="2026-0001" value={f.matricula} erro={e.matricula} dica="O número está no boletim ou na carteirinha." onChange={(x) => set('matricula', x.target.value)} />
            {aluno && !e.matricula && (
              <p className="achou" aria-live="polite">
                Matrícula encontrada: {mascararNome(aluno.nome)} · turma {turmaPorId(aluno.turmaId).nome} · {escolaPorId(turmaPorId(aluno.turmaId).escolaId).nome}
              </p>
            )}
            {f.perfil === 'responsavel' && (
              <Campo id="parentesco" rotulo="Parentesco" as="select" value={f.parentesco} erro={e.parentesco} onChange={(x) => set('parentesco', x.target.value)}>
                <option value="">Escolha uma opção</option>
                {PARENTESCOS.map((p) => <option key={p}>{p}</option>)}
              </Campo>
            )}
          </>
        ))}

        {passo === 3 && (
          <>
            <dl className="resumo">
              <dt>Perfil</dt><dd>{PERFIS[f.perfil].curto}</dd>
              <dt>Nome</dt><dd>{f.nome}</dd>
              <dt>E-mail</dt><dd>{f.email}</dd>
              <dt>Telefone</dt><dd>{f.tel}</dd>
              {prof
                ? <><dt>Escola</dt><dd>{escolaPorId(f.escolaId).nome}</dd><dt>Turmas</dt><dd>{f.turmaIds.map((i) => turmaPorId(i).nome).join(', ')}</dd></>
                : <><dt>Aluno</dt><dd>{aluno.nome} · turma {turmaPorId(aluno.turmaId).nome}</dd></>}
            </dl>
            <label className="aceite">
              <input type="checkbox" checked={f.aceite} aria-invalid={e.aceite ? true : undefined} onChange={(x) => set('aceite', x.target.checked)} />
              <span>Concordo com o uso dos meus dados e dos dados do aluno apenas para o acompanhamento escolar (LGPD).</span>
            </label>
            {e.aceite && <small className="erro" role="alert">{e.aceite}</small>}
          </>
        )}

        <div className="acoes">
          {passo > 0 && <button type="button" className="btn vazio" onClick={() => { setE({}); setPasso(passo - 1); }}>Voltar</button>}
          <button type="submit" className="btn">{passo === 3 ? 'Criar conta' : 'Continuar'}</button>
        </div>
        <p className="suave">Já tem conta? <Link to="/entrar">Entrar</Link></p>
      </form>
    </main>
  );
}
