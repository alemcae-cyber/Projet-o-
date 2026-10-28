import { useEffect, useRef, useState } from 'react';

export const Logo = () => (
  <span className="logo">
    <svg width="42" height="34" viewBox="0 0 42 34" aria-hidden="true">
      <g transform="rotate(-28 20 12)">
        <rect x="8" y="7" width="26" height="10" rx="3" fill="#7c3aed" />
        <rect x="27" y="7" width="7" height="10" rx="2" fill="#a78bfa" />
        <rect x="2" y="9" width="8" height="6" rx="2" fill="#5b21b6" />
      </g>
      <path d="M20 20 12 33M20 20 28 33M20 20V33" stroke="#737a8c" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <b><span>Edu</span><span>Track</span></b>
  </span>
);

export const Card = ({ titulo, children, className = '' }) => (
  <section className={`card ${className}`}>{titulo && <h2>{titulo}</h2>}{children}</section>
);

export function Kpi({ rotulo, valor, tom, dica }) {
  const ruim = tom === 'ruim' ? 'ruim' : '';
  return (
    <div className="kpi">
      <span>{rotulo}</span>
      <strong className={ruim}>{valor}</strong>
      {dica && <small className={ruim}>{dica}</small>}
    </div>
  );
}

export const Alerta = ({ titulo, tom = 'ruim', children }) => (
  <div className={`alerta ${tom}`} role="note"><strong>{titulo}</strong><p>{children}</p></div>
);

export const Segmentos = ({ rotulo, valor, onChange, itens }) => (
  <div className="segmentos" role="group" aria-label={rotulo}>
    {itens.map(([v, t]) => (
      <button key={v} type="button" aria-pressed={valor === v} onClick={() => onChange(v)}>{t}</button>
    ))}
  </div>
);

export function Barra({ rotulo, valor, max = 100, sufixo = '', tom, marca }) {
  const pc = (v) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  const txt = max === 10 ? valor.toFixed(1) : valor;
  return (
    <div className="barra">
      <span>{rotulo}</span>
      <div className="trilho" role="meter" aria-label={rotulo} aria-valuemin={0} aria-valuemax={max} aria-valuenow={valor} aria-valuetext={`${txt}${sufixo}`}>
        <i className={tom} style={{ width: pc(valor) }} />
        {marca != null && <u title={`Média da turma: ${marca}${sufixo}`} style={{ left: pc(marca) }} />}
      </div>
      <b className={tom === 'ruim' ? 'ruim' : ''}>{txt}{sufixo}</b>
    </div>
  );
}

export function Campo({ id, rotulo, erro, dica, as: T = 'input', children, ...p }) {
  const d = erro ? `${id}-e` : dica ? `${id}-d` : undefined;
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <T id={id} name={id} aria-invalid={erro ? true : undefined} aria-describedby={d} {...p}>{children}</T>
      {dica && !erro && <small id={`${id}-d`}>{dica}</small>}
      {erro && <small id={`${id}-e`} className="erro" role="alert">{erro}</small>}
    </div>
  );
}

function useLargura() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const f = () => setW(Math.max(260, Math.floor(el.clientWidth)));
    f();
    const ro = new ResizeObserver(f);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function LineChart({ labels, series, desc }) {
  const [ref, W] = useLargura();
  const H = 170, P = { l: 34, r: 14, t: 12, b: 26 };
  const x = (i) => P.l + (i * (W - P.l - P.r)) / (labels.length - 1);
  const y = (v) => P.t + (1 - v / 100) * (H - P.t - P.b);
  return (
    <figure className="chart" ref={ref}>
      <svg width={W} height={H} role="img" aria-label={desc}>
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} className="grid" />
            <text x={P.l - 8} y={y(g) + 4} textAnchor="end" className="tick">{g}</text>
          </g>
        ))}
        {labels.map((l, i) => <text key={l} x={x(i)} y={H - 6} textAnchor="middle" className="tick">{l}</text>)}
        {series.map((s) => {
          const pts = s.valores.map((v, i) => [x(i), y(v * s.escala)]);
          return (
            <g key={s.nome}>
              <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={s.cor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke={s.cor} strokeWidth="2.5">
                  <title>{`${s.nome} · ${labels[i]}: ${s.valores[i]}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="legend">
        {series.map((s) => <span key={s.nome} style={{ color: s.texto }}><i style={{ background: s.cor }} />{s.nome}</span>)}
      </figcaption>
      <p className="nota">Frequência em %. Notas de 0 a 10 aparecem na mesma altura (10 = 100).</p>
      <table className="sr-only">
        <caption>{desc}</caption>
        <thead><tr><th>Período</th>{series.map((s) => <th key={s.nome}>{s.nome}</th>)}</tr></thead>
        <tbody>{labels.map((l, i) => <tr key={l}><td>{l}</td>{series.map((s) => <td key={s.nome}>{s.valores[i]}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
}

const ICONES = {
  painel: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  aluno: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
  familia: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17.5 14.5c2.5 0 4 1.5 4 4.5" /></>,
  avisos: <><path d="M6 17v-6a6 6 0 1 1 12 0v6l2 2H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
};
export const Icone = ({ nome }) => (
  <svg className="icone" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONES[nome]}
  </svg>
);
