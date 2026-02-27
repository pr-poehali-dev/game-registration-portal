import { useEffect, useRef, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  size: number;
  color: string;
  type: "drone" | "tank" | "speeder";
  hit: boolean;
  dying: boolean;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Player {
  x: number;
  y: number;
}

interface GameState {
  score: number;
  wave: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
  started: boolean;
}

let idCounter = 0;
const nextId = () => ++idCounter;

const ENEMY_TYPES = {
  drone: { hp: 1, size: 18, color: "#00ffff", speed: 1.2, score: 10 },
  tank: { hp: 4, size: 28, color: "#bf00ff", speed: 0.6, score: 30 },
  speeder: { hp: 1, size: 14, color: "#ff00aa", speed: 2.2, score: 20 },
};

interface Props {
  onClose: () => void;
}

export default function NeonStrikerGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>({
    score: 0, wave: 1, lives: 3, gameOver: false, paused: false, started: false,
  });
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const playerRef = useRef<Player>({ x: 400, y: 500 });
  const mouseRef = useRef({ x: 400, y: 300 });
  const animFrameRef = useRef<number>(0);
  const lastShotRef = useRef(0);
  const waveTimerRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());

  const [displayState, setDisplayState] = useState<GameState>({
    score: 0, wave: 1, lives: 3, gameOver: false, paused: false, started: false,
  });

  const syncDisplay = useCallback(() => {
    setDisplayState({ ...stateRef.current });
  }, []);

  const spawnWave = useCallback((wave: number, W: number, H: number) => {
    const enemies: Enemy[] = [];
    const count = 4 + wave * 2;
    for (let i = 0; i < count; i++) {
      const types: Array<"drone" | "tank" | "speeder"> = ["drone", "drone", "speeder", ...(wave > 1 ? ["tank" as const] : [])];
      const type = types[Math.floor(Math.random() * types.length)];
      const cfg = ENEMY_TYPES[type];
      const angle = Math.random() * Math.PI * 2;
      enemies.push({
        id: nextId(),
        x: Math.random() * (W - 60) + 30,
        y: -40 - Math.random() * 200,
        vx: (Math.random() - 0.5) * cfg.speed * 0.5,
        vy: cfg.speed + Math.random() * 0.5,
        hp: cfg.hp,
        maxHp: cfg.hp,
        size: cfg.size,
        color: cfg.color,
        type,
        hit: false,
        dying: false,
      });
      void angle;
    }
    enemiesRef.current = [...enemiesRef.current, ...enemies];
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 3;
      particlesRef.current.push({
        id: nextId(),
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = { score: 0, wave: 1, lives: 3, gameOver: false, paused: false, started: true };
    enemiesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    waveTimerRef.current = 0;
    const canvas = canvasRef.current;
    if (canvas) {
      playerRef.current = { x: canvas.width / 2, y: canvas.height - 80 };
      spawnWave(1, canvas.width, canvas.height);
    }
    syncDisplay();
  }, [spawnWave, syncDisplay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 800;
      canvas.height = rect?.height || 600;
      playerRef.current.x = canvas.width / 2;
      playerRef.current.y = canvas.height - 80;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onClick = (e: MouseEvent) => {
      if (!stateRef.current.started || stateRef.current.gameOver || stateRef.current.paused) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const now = Date.now();
      if (now - lastShotRef.current < 200) return;
      lastShotRef.current = now;
      const px = playerRef.current.x;
      const py = playerRef.current.y;
      const dx = mx - px;
      const dy = my - py;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = 14;
      bulletsRef.current.push({
        id: nextId(),
        x: px, y: py,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
      });
      spawnParticles(px, py, "#00ffff", 3);
    };
    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    const drawNeonRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, glow = 10) => {
      ctx.shadowBlur = glow;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      ctx.shadowBlur = 0;
    };

    const drawNeonCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, filled = false) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      if (filled) {
        ctx.fillStyle = color + "33";
        ctx.fill();
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => {
      ctx.strokeStyle = "rgba(0,255,255,0.04)";
      ctx.lineWidth = 1;
      const offset = (t * 0.3) % 50;
      for (let x = 0; x < W; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = -offset; y < H; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    };

    const drawEnemy = (ctx: CanvasRenderingContext2D, e: Enemy) => {
      const { x, y, size, color, type, hp, maxHp, hit } = e;
      const alpha = hit ? 1 : 0.85;
      ctx.globalAlpha = alpha;

      if (type === "drone") {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.strokeStyle = hit ? "#ffffff" : color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.7, y + size * 0.5);
        ctx.lineTo(x, y + size * 0.2);
        ctx.lineTo(x - size * 0.7, y + size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = color + "22";
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (type === "tank") {
        drawNeonRect(ctx, x, y, size * 2, size * 1.6, hit ? "#ffffff" : color, 18);
        ctx.strokeStyle = (hit ? "#ffffff" : color) + "88";
        ctx.lineWidth = 1;
        ctx.strokeRect(x - size * 0.7, y - size * 0.4, size * 1.4, size * 0.8);
        ctx.beginPath();
        ctx.moveTo(x, y - size * 0.8 - 8);
        ctx.lineTo(x, y - size * 0.8);
        ctx.strokeStyle = hit ? "#ffffff" : color;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.strokeStyle = hit ? "#ffffff" : color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - size * 1.2);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = color + "15";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (hp < maxHp) {
        const bw = size * 2;
        const bh = 3;
        ctx.fillStyle = "#111";
        ctx.fillRect(x - bw / 2, y - size - 10, bw, bh);
        ctx.fillStyle = color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = color;
        ctx.fillRect(x - bw / 2, y - size - 10, bw * (hp / maxHp), bh);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    };

    const drawPlayer = (ctx: CanvasRenderingContext2D, px: number, py: number, mx: number, my: number) => {
      const angle = Math.atan2(my - py, mx - px) + Math.PI / 2;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ffff";
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(14, 14);
      ctx.lineTo(0, 6);
      ctx.lineTo(-14, 14);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(0,255,255,0.12)";
      ctx.fill();
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(0, 4, 5, 0, Math.PI * 2);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    let t = 0;
    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      const state = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;
      t++;

      ctx.fillStyle = "#050810";
      ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H, t);

      if (!state.started) {
        ctx.fillStyle = "rgba(0,255,255,0.08)";
        ctx.fillRect(0, 0, W, H);
        return;
      }

      if (state.gameOver) {
        ctx.font = "bold 36px Orbitron, monospace";
        ctx.fillStyle = "#ff00aa";
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#ff00aa";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
        ctx.font = "16px Orbitron, monospace";
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.fillText(`СЧЁТ: ${state.score}`, W / 2, H / 2 + 20);
        ctx.shadowBlur = 0;
        return;
      }

      if (state.paused) {
        ctx.font = "bold 28px Orbitron, monospace";
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ffff";
        ctx.textAlign = "center";
        ctx.fillText("ПАУЗА", W / 2, H / 2);
        ctx.shadowBlur = 0;
        return;
      }

      const speed = 4;
      const px = playerRef.current;
      if (keysRef.current.has("a") || keysRef.current.has("arrowleft")) px.x = Math.max(20, px.x - speed);
      if (keysRef.current.has("d") || keysRef.current.has("arrowright")) px.x = Math.min(W - 20, px.x + speed);
      if (keysRef.current.has("w") || keysRef.current.has("arrowup")) px.y = Math.max(20, px.y - speed);
      if (keysRef.current.has("s") || keysRef.current.has("arrowdown")) px.y = Math.min(H - 20, px.y + speed);

      waveTimerRef.current++;
      if (enemiesRef.current.length === 0 && waveTimerRef.current > 60) {
        stateRef.current.wave++;
        waveTimerRef.current = 0;
        spawnWave(stateRef.current.wave, W, H);
        syncDisplay();
      }

      bulletsRef.current = bulletsRef.current.filter(b => {
        b.x += b.vx; b.y += b.vy;
        return b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10;
      });

      enemiesRef.current = enemiesRef.current.filter(e => {
        if (e.dying) return false;
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < e.size) { e.x = e.size; e.vx *= -1; }
        if (e.x > W - e.size) { e.x = W - e.size; e.vx *= -1; }
        if (e.y > H + 60) {
          stateRef.current.lives--;
          spawnParticles(e.x, H - 20, e.color, 12);
          if (stateRef.current.lives <= 0) {
            stateRef.current.gameOver = true;
          }
          syncDisplay();
          return false;
        }
        e.hit = false;
        return true;
      });

      const bulletsToRemove = new Set<number>();
      const enemiesToRemove = new Set<number>();

      bulletsRef.current.forEach(b => {
        enemiesRef.current.forEach(e => {
          const dx = b.x - e.x;
          const dy = b.y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < e.size + 5) {
            bulletsToRemove.add(b.id);
            e.hp--;
            e.hit = true;
            spawnParticles(b.x, b.y, e.color, 5);
            if (e.hp <= 0) {
              enemiesToRemove.add(e.id);
              spawnParticles(e.x, e.y, e.color, 15);
              const cfg = ENEMY_TYPES[e.type];
              stateRef.current.score += cfg.score * stateRef.current.wave;
              syncDisplay();
            }
          }
        });
      });

      bulletsRef.current = bulletsRef.current.filter(b => !bulletsToRemove.has(b.id));
      enemiesRef.current = enemiesRef.current.filter(e => !enemiesToRemove.has(e.id));

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy *= 0.95;
        p.life--;
        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        return p.life > 0;
      });

      enemiesRef.current.forEach(e => drawEnemy(ctx, e));

      bulletsRef.current.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ffff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      drawPlayer(ctx, playerRef.current.x, playerRef.current.y, mouseRef.current.x, mouseRef.current.y);

      const crossX = mouseRef.current.x;
      const crossY = mouseRef.current.y;
      const cs = 10;
      ctx.strokeStyle = "rgba(0,255,255,0.7)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00ffff";
      ctx.beginPath(); ctx.moveTo(crossX - cs, crossY); ctx.lineTo(crossX + cs, crossY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(crossX, crossY - cs); ctx.lineTo(crossX, crossY + cs); ctx.stroke();
      drawNeonCircle(ctx, crossX, crossY, 8, "rgba(0,255,255,0.5)");
      ctx.shadowBlur = 0;
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
    };
  }, [spawnWave, spawnParticles, syncDisplay]);

  const togglePause = () => {
    if (!stateRef.current.started || stateRef.current.gameOver) return;
    stateRef.current.paused = !stateRef.current.paused;
    syncDisplay();
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col" style={{ fontFamily: "Orbitron, monospace" }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-2 glass-card border-b border-neon-cyan/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-neon-cyan rotate-45" style={{ boxShadow: "0 0 8px #00ffff" }} />
          <span className="font-orbitron text-sm font-black neon-cyan tracking-widest">NEON STRIKER</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground tracking-widest">СЧЁТ</div>
            <div className="font-orbitron text-sm font-black text-neon-cyan">{displayState.score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground tracking-widest">ВОЛНА</div>
            <div className="font-orbitron text-sm font-black text-neon-purple">{displayState.wave}</div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: i < displayState.lives ? "#00ffff" : "#1a2a3a",
                  boxShadow: i < displayState.lives ? "0 0 8px #00ffff" : "none",
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="btn-neon px-3 py-1.5 rounded-sm text-xs"
          >
            <Icon name={displayState.paused ? "Play" : "Pause"} size={12} />
          </button>
          <button
            onClick={onClose}
            className="btn-neon btn-neon-purple px-3 py-1.5 rounded-sm text-xs tracking-widest"
          >
            ВЫЙТИ
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden" style={{ cursor: "none" }}>
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Start overlay */}
        {!displayState.started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm">
            <div className="text-center animate-fade-in-up">
              <div className="mb-6">
                <h2 className="font-orbitron text-4xl font-black neon-cyan tracking-widest mb-2">NEON STRIKER</h2>
                <p className="font-rajdhani text-muted-foreground tracking-widest text-sm">
                  Уничтожай врагов · Кликай для стрельбы · WASD для движения
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
                {[
                  { color: "#00ffff", label: "Дрон", points: "10 очков", shape: "▲" },
                  { color: "#bf00ff", label: "Танк", points: "30 очков", shape: "■" },
                  { color: "#ff00aa", label: "Спидер", points: "20 очков", shape: "△" },
                ].map(e => (
                  <div key={e.label} className="glass-card rounded-sm p-3 text-center border" style={{ borderColor: e.color + "44" }}>
                    <div className="text-2xl mb-1" style={{ color: e.color, textShadow: `0 0 10px ${e.color}` }}>{e.shape}</div>
                    <div className="font-orbitron text-xs font-bold" style={{ color: e.color }}>{e.label}</div>
                    <div className="font-rajdhani text-xs text-muted-foreground">{e.points}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={startGame}
                className="btn-solid-cyan px-12 py-4 rounded-sm text-sm tracking-widest animate-pulse-neon"
              >
                НАЧАТЬ ИГРУ
              </button>
            </div>
          </div>
        )}

        {/* Game Over overlay */}
        {displayState.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/85 backdrop-blur-sm">
            <div className="text-center animate-scale-in">
              <h2 className="font-orbitron text-4xl font-black mb-2" style={{ color: "#ff00aa", textShadow: "0 0 30px #ff00aa" }}>
                GAME OVER
              </h2>
              <p className="font-rajdhani text-muted-foreground tracking-widest mb-1">Волна {displayState.wave}</p>
              <p className="font-orbitron text-2xl font-black neon-cyan mb-6">
                {displayState.score} очков
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={startGame} className="btn-solid-cyan px-8 py-3 rounded-sm text-xs tracking-widest">
                  ЗАНОВО
                </button>
                <button onClick={onClose} className="btn-neon btn-neon-purple px-8 py-3 rounded-sm text-xs tracking-widest">
                  ВЫЙТИ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="px-4 py-1.5 border-t border-dark-border shrink-0">
        <p className="font-rajdhani text-xs text-muted-foreground tracking-widest text-center">
          WASD / ←↑↓→ — движение &nbsp;|&nbsp; КЛИК — выстрел &nbsp;|&nbsp; P — пауза
        </p>
      </div>
    </div>
  );
}
