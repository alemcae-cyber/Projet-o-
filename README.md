# EduTrack PE

Plataforma de acompanhamento escolar para a rede municipal de Lagoa do Carro.
Projeto acadêmico de ADS (UNIT).

## Como rodar

```bash
npm install
npm run dev
```

Para gerar a versão final: `npm run build`.

## Contas de teste

Senha de todas: `123456`

| Perfil | E-mail |
|---|---|
| Aluno | ana@escola.pe |
| Responsável | responsavel@email.com |
| Professor | professor@escola.pe |
| Coordenação | coordenacao@escola.pe |
| Secretaria | secretaria@edutrack.pe |

Para testar o cadastro de aluno ou responsável, use uma matrícula de `src/data.js` (exemplo: `2026-0003`).

## Estrutura

- `src/data.js`: dados de teste e cálculos (frequência, média, alertas)
- `src/auth.jsx`: login e cadastro
- `src/store.jsx`: comunicados e mensagens de confirmação
- `src/ui.jsx`: componentes (logo, gráfico, barras, campos, ícones)
- `src/pages/`: uma tela por arquivo
