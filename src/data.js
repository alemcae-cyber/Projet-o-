// Dados fictícios. Quando houver back-end, troque estas listas por chamadas à API.
export const BIM = ['1º bim', '2º bim', '3º bim', '4º bim'];
export const DISCIPLINAS = ['Português', 'Matemática', 'Ciências', 'História'];

export const ESCOLAS = [
  { id: 'e1', nome: 'E. M. Rosa Silva' },
  { id: 'e2', nome: 'E. M. Antônio Carlos' },
  { id: 'e3', nome: 'E. M. Santa Luzia' },
  { id: 'e4', nome: 'E. M. Padre Cícero' },
];
export const TURMAS = [
  { id: 't1', nome: '6ºA', escolaId: 'e1' },
  { id: 't2', nome: '7ºB', escolaId: 'e1' },
  { id: 't3', nome: '6ºB', escolaId: 'e2' },
  { id: 't4', nome: '8ºA', escolaId: 'e3' },
  { id: 't5', nome: '9ºA', escolaId: 'e4' },
];

const OFF = [0.3, -0.4, 0.1, 0];
const lim = (v) => Math.max(0, Math.min(10, Math.round(v * 10) / 10));
const mk = (n, nome, turmaId, freq, base) => ({
  id: 's' + n,
  matricula: `2026-${String(n).padStart(4, '0')}`,
  nome, turmaId, freq,
  notas: Object.fromEntries(DISCIPLINAS.map((d, i) => [d, base.map((v) => lim(v + OFF[i]))])),
});
export const ALUNOS = [
  mk(1, 'Pedro Lima', 't2', [88, 82, 74, 65], [7.1, 6.8, 6.3, 5.8]),
  mk(2, 'Ana Souza', 't1', [96, 95, 97, 96], [8.4, 8.6, 8.8, 9.0]),
  mk(3, 'Carla Mendes', 't1', [85, 80, 72, 68], [7.5, 7.2, 6.9, 6.6]),
  mk(4, 'Lucas Ferreira', 't2', [92, 90, 91, 93], [7.8, 8.0, 7.9, 8.2]),
  mk(5, 'Marina Alves', 't2', [94, 93, 95, 94], [8.9, 9.1, 9.0, 9.3]),
  mk(6, 'João Barros', 't3', [90, 89, 86, 88], [7.0, 7.2, 7.1, 7.4]),
  mk(7, 'Beatriz Nunes', 't3', [97, 96, 96, 98], [9.2, 9.0, 9.4, 9.5]),
  mk(8, 'Rafael Costa', 't4', [82, 84, 80, 83], [6.8, 6.6, 7.0, 6.9]),
  mk(9, 'Helena Dias', 't4', [91, 92, 90, 93], [8.1, 8.3, 8.2, 8.5]),
  mk(10, 'Davi Moura', 't5', [87, 85, 88, 86], [7.3, 7.5, 7.2, 7.6]),
];

export const PERFIS = {
  secretaria: { titulo: 'Secretaria de Educação (todas as escolas)', curto: 'Secretaria', exemplo: 'secretaria@edutrack.pe', home: '/painel' },
  coordenacao: { titulo: 'Coordenação escolar', curto: 'Coordenação', exemplo: 'coordenacao@escola.pe', home: '/painel' },
  professor: { titulo: 'Professor', curto: 'Professor', exemplo: 'professor@escola.pe', home: '/alunos' },
  responsavel: { titulo: 'Responsável (pai de Pedro)', curto: 'Responsável', exemplo: 'responsavel@email.com', home: '/desempenho' },
  aluno: { titulo: 'Aluno (Ana Souza)', curto: 'Aluno', exemplo: 'ana@escola.pe', home: '/desempenho' },
};

// [rota, ícone, texto do menu, texto curto do menu do celular]
export const NAV = {
  aluno: [['/desempenho', '🎓', 'Meu desempenho', 'Início'], ['/comunicados', '📢', 'Comunicados', 'Avisos']],
  responsavel: [['/desempenho', '👪', 'Meu filho', 'Meu filho'], ['/comunicados', '📢', 'Comunicados', 'Avisos']],
  professor: [['/alunos', '🎓', 'Turmas e alunos', 'Turmas'], ['/comunicados', '📢', 'Comunicados', 'Avisos']],
  coordenacao: [['/painel', '📊', 'Painel', 'Painel'], ['/alunos', '🎓', 'Alunos', 'Alunos'], ['/comunicados', '📢', 'Comunicados', 'Avisos']],
  secretaria: [['/painel', '📊', 'Painel', 'Painel'], ['/comunicados', '📢', 'Comunicados', 'Avisos']],
};

// Senha de todos os usuários de exemplo: 123456
export const USUARIOS_SEED = [
  { email: 'secretaria@edutrack.pe', senha: '123456', perfil: 'secretaria', nome: 'Secretaria de Educação' },
  { email: 'coordenacao@escola.pe', senha: '123456', perfil: 'coordenacao', nome: 'Coordenação', escolaId: 'e1' },
  { email: 'professor@escola.pe', senha: '123456', perfil: 'professor', nome: 'Professora Marta', escolaId: 'e1', turmaIds: ['t1', 't2'] },
  { email: 'responsavel@email.com', senha: '123456', perfil: 'responsavel', nome: 'Responsável de Pedro', alunoIds: ['s1'] },
  { email: 'ana@escola.pe', senha: '123456', perfil: 'aluno', nome: 'Ana Souza', alunoIds: ['s2'] },
];

export const AVISOS_SEED = [
  { id: 1, titulo: 'Reunião de pais e mestres', texto: 'Dia 12 de novembro, às 18h, na sua escola. Traga o boletim do 3º bimestre.', autor: 'Secretaria de Educação', data: '27/10/2026', alvo: 'todos' },
  { id: 2, titulo: 'Reforço de Matemática', texto: 'Aulas de reforço às terças e quintas, das 14h às 15h, para o 6º e o 7º ano.', autor: 'Coordenação', data: '22/10/2026', alvo: 'e1' },
  { id: 3, titulo: 'Entrega de boletins', texto: 'Os boletins do 3º bimestre já estão disponíveis na secretaria da escola.', autor: 'Coordenação', data: '15/10/2026', alvo: 'e1' },
];

// ---------- consultas ----------
export const alunoPorId = (id) => ALUNOS.find((a) => a.id === id);
export const turmaPorId = (id) => TURMAS.find((t) => t.id === id);
export const escolaPorId = (id) => ESCOLAS.find((e) => e.id === id);

const media = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
export const r1 = (n) => Math.round(n * 10) / 10;
export const freqAtual = (a) => a.freq[a.freq.length - 1];
export const geral = (a) => BIM.map((_, i) => r1(media(DISCIPLINAS.map((d) => a.notas[d][i]))));
export const mediaAluno = (a) => r1(media(geral(a)));
export const freqMedia = (l) => Math.round(media(l.map(freqAtual)));
export const notaMedia = (l) => r1(media(l.map(mediaAluno)));
export const serie = (l) => ({
  freq: BIM.map((_, i) => r1(media(l.map((a) => a.freq[i])))),
  nota: BIM.map((_, i) => r1(media(l.map((a) => geral(a)[i])))),
});
export const porDisciplina = (l) =>
  DISCIPLINAS.map((d) => ({ nome: d, media: r1(media(l.flatMap((a) => a.notas[d]))) }));

export function alertas(a) {
  const m = [], f = a.freq, n = geral(a), k = f.length - 1;
  if (freqAtual(a) < 75) m.push('Frequência abaixo de 75%');
  if (f[k] < f[k - 1] - 3) m.push('queda recente de frequência');
  if (n[k] < n[k - 1] - 0.2) m.push('queda de nota');
  return m;
}
export const textoAlerta = (a) => `${alertas(a).join('; ')}. Recomenda-se que a equipe avalie a situação.`;

export function podeVer(u, a) {
  const t = turmaPorId(a.turmaId);
  if (u.perfil === 'secretaria') return true;
  if (u.perfil === 'coordenacao') return t.escolaId === u.escolaId;
  if (u.perfil === 'professor') return u.turmaIds.includes(a.turmaId);
  return (u.alunoIds || []).includes(a.id);
}
export function escolaDoUsuario(u) {
  if (u.escolaId) return u.escolaId;
  const a = alunoPorId((u.alunoIds || [])[0]);
  return a ? turmaPorId(a.turmaId).escolaId : null;
}
