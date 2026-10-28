# EduTrack PE — front-end (React)

Protótipo navegável baseado nas telas do Figma "EduTrack PE – Telas (web e mobile)".
Dados fictícios (arquivo `src/data.js`). Senha dos usuários de exemplo: `123456`.

## Rodar

```bash
npm install
npm run dev
```

## Gerar versão final

```bash
npm run build
```

## Perfis de exemplo
| Perfil | E-mail |
|---|---|
| Aluno | ana@escola.pe |
| Responsável | responsavel@email.com |
| Professor | professor@escola.pe |
| Coordenação | coordenacao@escola.pe |
| Secretaria | secretaria@edutrack.pe |

Para testar o cadastro de aluno/responsável use uma matrícula de `src/data.js` (ex.: `2026-0003`).

## Estrutura
- `src/data.js` — dados de exemplo e funções de cálculo (frequência, média, alertas)
- `src/auth.jsx` — login e cadastro (localStorage, só para protótipo)
- `src/store.jsx` — avisos e mensagens de confirmação (toast)
- `src/ui.jsx` — componentes: Logo, Kpi, Card, Barra, LineChart, Campo...
- `src/pages/` — uma tela por arquivo (Visao.jsx é o bloco de desempenho reutilizado)
