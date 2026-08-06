"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";

type Hero = {
  id: string;
  name: string;
  title: string;
  odds: number;
  income: number;
  color: string;
  accent: string;
  archetype: "squire" | "mage" | "knight" | "rogue" | "guardian" | "valkyrie" | "king" | "emperor";
};

const HEROES: Hero[] = [
  { id: "jade", name: "Aprendiz de Jade", title: "Coração de Jade", odds: 2, income: 1, color: "#3fcf86", accent: "#d8b76e", archetype: "squire" },
  { id: "amber", name: "Feiticeira Âmbar", title: "Chama de Âmbar", odds: 10, income: 2, color: "#f5a843", accent: "#ffe0a1", archetype: "mage" },
  { id: "lunar", name: "Sentinela Lunar", title: "Vigia da Lua", odds: 100, income: 3, color: "#79a9ff", accent: "#dfeaff", archetype: "knight" },
  { id: "dusk", name: "Lâmina do Crepúsculo", title: "Passo do Crepúsculo", odds: 1_000, income: 4, color: "#8a58cc", accent: "#cc9dff", archetype: "rogue" },
  { id: "rune", name: "Guardião das Runas", title: "Muralha das Runas", odds: 10_000, income: 5, color: "#d58b43", accent: "#ffd28a", archetype: "guardian" },
  { id: "valkyrie", name: "Valquíria Celestial", title: "Lança Celestial", odds: 100_000, income: 6, color: "#c7d8ff", accent: "#fff3c4", archetype: "valkyrie" },
  { id: "abyss", name: "Rei do Abismo", title: "Senhor do Abismo", odds: 1_000_000, income: 7, color: "#a52e52", accent: "#ff7595", archetype: "king" },
  { id: "eclipse", name: "Imperador do Eclipse", title: "Aquele que Domina o Céu", odds: 10_000_000, income: 8, color: "#edc34c", accent: "#fff1a0", archetype: "emperor" },
];

type Save = { essence: number; rolls: number; owned: Record<string, number>; equipped: string; title: string; auto: boolean };
const DEFAULT_SAVE: Save = { essence: 0, rolls: 0, owned: { jade: 1 }, equipped: "jade", title: "jade", auto: false };

function fmt(value: number) { return Math.floor(value).toLocaleString("pt-BR"); }

function HeroModel({ hero }: { hero: Hero }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.35) * 0.035 - 1.2;
  });
  const heavy = ["guardian", "king", "emperor"].includes(hero.archetype);
  const caster = ["mage", "valkyrie"].includes(hero.archetype);
  const rogue = hero.archetype === "rogue";
  const royal = ["king", "emperor"].includes(hero.archetype);
  const armor = heavy ? "#171923" : "#252836";
  return (
    <group ref={group} scale={heavy ? 1.03 : 0.96}>
      {/* pernas e botas com proporção humanoide */}
      {[-0.28, 0.28].map((x) => <group key={`leg-${x}`} position={[x, -0.42, 0]}>
        <mesh castShadow><capsuleGeometry args={[0.19, 0.72, 8, 16]} /><meshStandardMaterial color={armor} metalness={0.72} roughness={0.3} /></mesh>
        <mesh castShadow position={[0, -0.5, -0.1]} scale={[1.15, 0.65, 1.5]}><sphereGeometry args={[0.24, 24, 18]} /><meshStandardMaterial color="#101119" metalness={0.8} roughness={0.24} /></mesh>
        <mesh position={[0, 0.03, -0.2]}><boxGeometry args={[0.25, 0.42, 0.05]} /><meshStandardMaterial color={hero.color} metalness={0.75} roughness={0.22} /></mesh>
      </group>)}
      {/* quadril, torso esculpido e peitoral */}
      <mesh castShadow position={[0, 0.16, 0]}><cylinderGeometry args={[0.48, 0.38, 0.38, 8]} /><meshStandardMaterial color="#11131b" metalness={0.8} roughness={0.25} /></mesh>
      <mesh castShadow position={[0, 0.82, 0]} scale={[heavy ? 1.08 : 0.94, 1, 0.72]}><cylinderGeometry args={[0.62, 0.43, 1.22, 8]} /><meshStandardMaterial color={armor} metalness={0.84} roughness={0.2} /></mesh>
      <mesh castShadow position={[0, 0.92, -0.43]} scale={[1, 1.15, 0.42]}><octahedronGeometry args={[0.38, 0]} /><meshStandardMaterial color={hero.color} metalness={0.62} roughness={0.18} emissive={hero.color} emissiveIntensity={0.28} /></mesh>
      <mesh position={[0, 0.83, -0.61]}><octahedronGeometry args={[0.105]} /><meshStandardMaterial color={hero.accent} emissive={hero.color} emissiveIntensity={2.4} /></mesh>
      {/* braços articulados e ombreiras */}
      {[-1, 1].map((side) => <group key={`arm-${side}`}>
        <mesh castShadow position={[side * 0.68, 1.08, 0]} scale={[1.15, 0.72, 1]}><sphereGeometry args={[heavy ? 0.34 : 0.29, 24, 18]} /><meshStandardMaterial color={hero.accent} metalness={0.9} roughness={0.16} /></mesh>
        <mesh castShadow position={[side * 0.76, 0.51, 0]} rotation={[0, 0, side * -0.1]}><capsuleGeometry args={[0.16, 0.7, 8, 14]} /><meshStandardMaterial color={armor} metalness={0.76} roughness={0.26} /></mesh>
        <mesh castShadow position={[side * 0.82, 0.02, -0.02]}><sphereGeometry args={[0.18, 18, 14]} /><meshStandardMaterial color="#12131b" metalness={0.7} /></mesh>
      </group>)}
      {/* cabeça, elmo e olhos */}
      <mesh castShadow position={[0, 1.78, 0]} scale={[0.86, 1, 0.86]}><sphereGeometry args={[0.39, 32, 24]} /><meshStandardMaterial color="#0d0f16" metalness={0.86} roughness={0.18} /></mesh>
      <mesh castShadow position={[0, 1.9, 0.03]} scale={[1, 0.72, 0.94]}><sphereGeometry args={[0.43, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={armor} metalness={0.92} roughness={0.16} /></mesh>
      <mesh position={[-0.13, 1.79, -0.35]}><boxGeometry args={[0.16, 0.055, 0.035]} /><meshStandardMaterial color={hero.color} emissive={hero.color} emissiveIntensity={4} /></mesh>
      <mesh position={[0.13, 1.79, -0.35]}><boxGeometry args={[0.16, 0.055, 0.035]} /><meshStandardMaterial color={hero.color} emissive={hero.color} emissiveIntensity={4} /></mesh>
      {caster && <><mesh castShadow position={[0, 2.2, 0]}><coneGeometry args={[0.5, 1.12, 10]} /><meshStandardMaterial color={hero.color} metalness={0.5} roughness={0.32} /></mesh><mesh castShadow position={[1.08, 0.72, 0]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.055, 0.075, 2.9, 12]} /><meshStandardMaterial color={hero.accent} metalness={0.72} /></mesh><mesh position={[1.22, 2.18, 0]}><octahedronGeometry args={[0.25]} /><meshStandardMaterial color={hero.color} emissive={hero.color} emissiveIntensity={2.5} /></mesh></>}
      {royal && <group position={[0, 2.2, 0]}>{[-0.3, 0, 0.3].map((x, i) => <mesh key={x} position={[x, i === 1 ? 0.18 : 0.06, 0]}><coneGeometry args={[0.11, i === 1 ? 0.62 : 0.48, 6]} /><meshStandardMaterial color={hero.accent} metalness={0.95} roughness={0.12} emissive={hero.color} emissiveIntensity={0.35} /></mesh>)}</group>}
      {rogue && <><mesh castShadow position={[0, 2.04, 0.06]}><coneGeometry args={[0.58, 0.9, 12]} /><meshStandardMaterial color="#17131f" roughness={0.42} /></mesh>{[-1, 1].map((side) => <mesh key={side} position={[side * 0.62, 0.16, -0.25]} rotation={[0.08, 0, side * -0.28]}><boxGeometry args={[0.08, 1.55, 0.18]} /><meshStandardMaterial color={hero.color} metalness={0.92} /></mesh>)}</>}
      {!caster && !rogue && <group position={[1.08, 0.52, 0]} rotation={[0, 0, -0.1]}><mesh castShadow><cylinderGeometry args={[0.055, 0.075, 2.65, 12]} /><meshStandardMaterial color="#4d3221" roughness={0.5} /></mesh><mesh castShadow position={[0, 1.05, 0]}><boxGeometry args={[heavy ? 0.48 : 0.22, 0.82, heavy ? 0.16 : 0.1]} /><meshStandardMaterial color={hero.accent} metalness={0.94} roughness={0.12} /></mesh></group>}
      <Sparkles count={35 + hero.income * 6} scale={[3, 3.5, 2]} size={2.4} speed={0.5} color={hero.color} />
    </group>
  );
}

function CharacterStage({ hero }: { hero: Hero }) {
  return <div className="stage" aria-label={`Protótipo 3D de ${hero.name}`}><Canvas shadows camera={{ position: [4.8, 2.6, 6.3], fov: 30 }}><ambientLight intensity={1.15} /><directionalLight castShadow position={[4, 7, 5]} intensity={3.2} color="#ffe0b2" /><pointLight position={[-3, 2, 2]} intensity={18} color={hero.color} /><Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.12}><HeroModel hero={hero} /></Float><mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]}><cylinderGeometry args={[2.15, 2.45, 0.28, 64]} /><meshStandardMaterial color="#18131f" metalness={0.65} roughness={0.32} /></mesh><ContactShadows position={[0, -1.34, 0]} opacity={0.72} scale={6} blur={2.5} far={5} /></Canvas></div>;
}

export default function GameClient() {
  const [save, setSave] = useState<Save>(DEFAULT_SAVE);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<"inventory" | "guide" | null>("inventory");
  const [result, setResult] = useState<Hero | "mist" | null>(null);
  const [rolling, setRolling] = useState(false);
  const [autoOn, setAutoOn] = useState(false);
  const hero = HEROES.find((item) => item.id === save.equipped) ?? HEROES[0];

  useEffect(() => { const raw = localStorage.getItem("arcana-save-v1"); if (raw) try { setSave({ ...DEFAULT_SAVE, ...JSON.parse(raw) }); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("arcana-save-v1", JSON.stringify(save)); }, [save, ready]);
  useEffect(() => { const timer = window.setInterval(() => setSave((s) => ({ ...s, essence: s.essence + (HEROES.find((h) => h.id === s.equipped)?.income ?? 1) })), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!result) return; const timer = window.setTimeout(() => setResult(null), 3000); return () => window.clearTimeout(timer); }, [result]);

  function roll() {
    if (rolling) return;
    setRolling(true); setResult(null);
    window.setTimeout(() => {
      const ticket = Math.random(); let cursor = 0; let won: Hero | undefined;
      for (const candidate of [...HEROES].reverse()) { cursor += 1 / candidate.odds; if (ticket <= cursor) { won = candidate; break; } }
      setSave((s) => won ? { ...s, rolls: s.rolls + 1, owned: { ...s.owned, [won.id]: (s.owned[won.id] ?? 0) + 1 }, essence: s.essence + ((s.owned[won.id] ?? 0) > 0 ? won.income * 4 : 0) } : { ...s, rolls: s.rolls + 1, essence: s.essence + 1 });
      setResult(won ?? "mist"); setRolling(false);
    }, 900);
  }

  useEffect(() => { if (!autoOn || !save.auto) return; const id = window.setInterval(roll, 1800); return () => clearInterval(id); });
  function buyAuto() { if (save.auto) return setAutoOn((v) => !v); if (save.essence >= 5000) setSave((s) => ({ ...s, essence: s.essence - 5000, auto: true })); }

  return <main className="game-shell">
    <div className="world" />
    <div className="vignette" />
    <header className="topbar"><div className="brand-small">ARCANA RNG</div><div className="brand-main">ARCANA RNG</div><div className="resources"><span>ESSÊNCIA <b>{fmt(save.essence)}</b></span><i /><span>INVOCAÇÕES <b>{fmt(save.rolls)}</b></span></div></header>
    <CharacterStage hero={hero} />
    <div className="hero-caption"><strong>{hero.name}</strong><span>{HEROES.find((h) => h.id === save.title)?.title ?? hero.title}</span><small>+{hero.income} essência por segundo</small></div>

    <aside className={`panel ${panel ? "open" : ""}`}>
      <div className="panel-heading"><span>{panel === "guide" ? "GUIA DE PERSONAGENS" : "COLEÇÃO"}</span><button onClick={() => setPanel(null)} aria-label="Fechar painel">×</button></div>
      <div className="panel-scroll">
        {(panel === "guide" ? HEROES : HEROES.filter((h) => save.owned[h.id])).map((item, index) => {
          const owned = Boolean(save.owned[item.id]);
          return <article className={`hero-card ${owned ? "owned" : "locked"}`} key={item.id} style={{ "--rarity": item.color } as React.CSSProperties}>
            <div className="rank">{panel === "guide" ? String(index + 1).padStart(2, "0") : fmt(save.owned[item.id])}</div>
            <div className="card-copy"><strong>{item.name}</strong><span>1 em {fmt(item.odds)}</span><small>+{item.income} essência/s</small></div>
            {panel !== "guide" && <div className="card-actions"><button onClick={() => setSave((s) => ({ ...s, equipped: item.id }))}>EQUIPAR</button><button onClick={() => setSave((s) => ({ ...s, title: item.id }))}>TÍTULO</button></div>}
            {panel === "guide" && <em>{owned ? "DESCOBERTO" : "NÃO DESCOBERTO"}</em>}
          </article>;
        })}
      </div>
    </aside>

    <nav className="nav-tabs"><button className={panel === "inventory" ? "active" : ""} onClick={() => setPanel(panel === "inventory" ? null : "inventory")}>INVENTÁRIO</button><button className={panel === "guide" ? "active" : ""} onClick={() => setPanel(panel === "guide" ? null : "guide")}>GUIA</button></nav>
    <button className={`auto-button ${autoOn ? "on" : ""}`} onClick={buyAuto}>{save.auto ? `AUTO-ROLL ${autoOn ? "ATIVO" : "INATIVO"}` : "DESBLOQUEAR AUTO-ROLL · 5.000"}</button>
    <button className={`summon-button ${rolling ? "rolling" : ""}`} onClick={roll} aria-label="Invocar personagem"><img src="/summon-cube.png" alt="" /></button>
    {result && <button className="result-card" onClick={() => setResult(null)} aria-label="Fechar resultado" style={{ "--result": result === "mist" ? "#9b8bb0" : result.color } as React.CSSProperties}><span>{result === "mist" ? "BRUMA RESIDUAL" : "PERSONAGEM INVOCADO"}</span><strong>{result === "mist" ? "+1 Essência" : result.name}</strong>{result !== "mist" && <small>RARIDADE · 1 EM {fmt(result.odds)}</small>}<em>CLIQUE PARA FECHAR</em></button>}
  </main>;
}
