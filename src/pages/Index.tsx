import { useState } from "react";
import Icon from "@/components/ui/icon";

type Screen = "auth" | "main";
type AuthMode = "login" | "register";
type Tab = "games" | "profile";

const GAMES = [
  {
    id: 1,
    title: "NEON STRIKER",
    genre: "Шутер",
    rating: 4.8,
    players: "12.4K",
    image: "https://cdn.poehali.dev/projects/682bbacc-4f37-46b2-a232-968efb6ae286/files/4db7cc8b-b88b-4672-adba-bdbf0081b753.jpg",
    tag: "Хит",
    tagColor: "text-neon-cyan border-neon-cyan",
    description: "Киберпанк шутер в мире будущего. Сражайся на улицах неонового города.",
  },
  {
    id: 2,
    title: "DRAGON REALM",
    genre: "RPG",
    rating: 4.9,
    players: "34.1K",
    image: "https://cdn.poehali.dev/projects/682bbacc-4f37-46b2-a232-968efb6ae286/files/7f9d3ce5-7e6d-4481-8a84-83fa35e06cfe.jpg",
    tag: "Новинка",
    tagColor: "text-neon-purple border-neon-purple",
    description: "Эпическая RPG с открытым миром. Стань легендой в мире драконов.",
  },
  {
    id: 3,
    title: "TURBO RUSH",
    genre: "Гонки",
    rating: 4.6,
    players: "8.9K",
    image: "https://cdn.poehali.dev/projects/682bbacc-4f37-46b2-a232-968efb6ae286/files/cf9aa45b-6af3-46cf-a0c5-511d0f04ccf9.jpg",
    tag: "Мультиплеер",
    tagColor: "text-neon-green border-neon-green",
    description: "Гонки на скорости света по ночным трассам. Только нервы из стали.",
  },
  {
    id: 4,
    title: "VOID BREACH",
    genre: "Battle Royale",
    rating: 4.7,
    players: "51.2K",
    image: "https://cdn.poehali.dev/projects/682bbacc-4f37-46b2-a232-968efb6ae286/files/bd0dde87-e7a5-4801-9afb-9ebc09905076.jpg",
    tag: "Популярное",
    tagColor: "text-neon-pink border-neon-pink",
    description: "100 игроков, 1 победитель. Война в постапокалиптическом мире.",
  },
];

const ACHIEVEMENTS = [
  { icon: "Sword", label: "Воин", color: "text-neon-cyan" },
  { icon: "Shield", label: "Защитник", color: "text-neon-purple" },
  { icon: "Star", label: "Звезда", color: "text-yellow-400" },
  { icon: "Zap", label: "Молния", color: "text-neon-green" },
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>("auth");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [tab, setTab] = useState<Tab>("games");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string>("Гость");
  const [isGuest, setIsGuest] = useState(false);

  const handleLogin = () => {
    if (username || email) {
      setCurrentUser(username || email.split("@")[0] || "Игрок");
      setIsGuest(false);
      setScreen("main");
    }
  };

  const handleRegister = () => {
    if (username && email && password) {
      setCurrentUser(username);
      setIsGuest(false);
      setScreen("main");
    }
  };

  const handleGuest = () => {
    setCurrentUser("Гость_" + Math.floor(Math.random() * 9999));
    setIsGuest(true);
    setScreen("main");
  };

  const handleLogout = () => {
    setScreen("auth");
    setUsername("");
    setEmail("");
    setPassword("");
    setTab("games");
  };

  if (screen === "auth") {
    return (
      <div className="min-h-screen bg-dark-bg bg-grid flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00ffff, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #bf00ff, transparent)" }} />

        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 border-neon-cyan rotate-45 animate-pulse-neon" />
              <h1 className="font-orbitron text-3xl font-black neon-cyan tracking-wider">NEXUS</h1>
              <div className="w-8 h-8 border-2 border-neon-purple rotate-45" />
            </div>
            <p className="text-muted-foreground font-rajdhani tracking-[0.3em] text-sm uppercase">
              Gaming Portal
            </p>
          </div>

          <div className="glass-card rounded-lg p-8 animate-fade-in-up-delay-1">
            <div className="flex mb-6 border border-dark-border rounded-sm overflow-hidden">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2.5 font-orbitron text-xs tracking-widest uppercase transition-all duration-300 ${
                  authMode === "login"
                    ? "bg-neon-cyan text-dark-bg font-black"
                    : "text-muted-foreground hover:text-neon-cyan"
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2.5 font-orbitron text-xs tracking-widest uppercase transition-all duration-300 ${
                  authMode === "register"
                    ? "bg-neon-cyan text-dark-bg font-black"
                    : "text-muted-foreground hover:text-neon-cyan"
                }`}
              >
                Регистрация
              </button>
            </div>

            <div className="space-y-4">
              {authMode === "register" && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-orbitron tracking-widest text-muted-foreground mb-1.5 uppercase">
                    Никнейм
                  </label>
                  <input
                    className="input-neon w-full px-4 py-3 rounded-sm"
                    placeholder="PLAYER_001"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-orbitron tracking-widest text-muted-foreground mb-1.5 uppercase">
                  {authMode === "login" ? "Никнейм или Email" : "Email"}
                </label>
                <input
                  className="input-neon w-full px-4 py-3 rounded-sm"
                  placeholder={authMode === "login" ? "player@nexus.gg" : "you@nexus.gg"}
                  value={authMode === "login" ? username : email}
                  onChange={(e) =>
                    authMode === "login" ? setUsername(e.target.value) : setEmail(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-orbitron tracking-widest text-muted-foreground mb-1.5 uppercase">
                  Пароль
                </label>
                <input
                  type="password"
                  className="input-neon w-full px-4 py-3 rounded-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={authMode === "login" ? handleLogin : handleRegister}
                className="btn-solid-cyan w-full py-3.5 rounded-sm text-sm tracking-widest mt-2"
              >
                {authMode === "login" ? "Войти в систему" : "Создать аккаунт"}
              </button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-dark-border" />
                <span className="text-xs text-muted-foreground font-orbitron">OR</span>
                <div className="flex-1 h-px bg-dark-border" />
              </div>

              <button
                onClick={handleGuest}
                className="btn-neon btn-neon-purple w-full py-3 rounded-sm text-xs tracking-widest"
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="UserRound" size={14} />
                  Войти как гость
                </span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 font-rajdhani tracking-wider animate-fade-in-up-delay-2">
            NEXUS GAMES © 2026 — ENTER THE MATRIX
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg bg-grid">
      <header className="sticky top-0 z-50 glass-card border-b border-dark-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-neon-cyan rotate-45 animate-pulse-neon" />
            <span className="font-orbitron text-lg font-black neon-cyan tracking-wider">NEXUS</span>
          </div>

          <nav className="flex gap-1">
            <button
              onClick={() => setTab("games")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-orbitron text-xs tracking-wider uppercase transition-all duration-300 ${
                tab === "games"
                  ? "bg-neon-cyan text-dark-bg font-black"
                  : "text-muted-foreground hover:text-neon-cyan border border-transparent hover:border-neon-cyan/30"
              }`}
            >
              <Icon name="Gamepad2" size={14} />
              Игры
            </button>
            <button
              onClick={() => setTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-orbitron text-xs tracking-wider uppercase transition-all duration-300 ${
                tab === "profile"
                  ? "bg-neon-purple text-white font-black"
                  : "text-muted-foreground hover:text-neon-purple border border-transparent hover:border-neon-purple/30"
              }`}
            >
              <Icon name="User" size={14} />
              Профиль
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-orbitron text-xs text-neon-cyan tracking-wider">{currentUser}</p>
              {isGuest && (
                <p className="text-xs text-muted-foreground font-rajdhani">гостевой режим</p>
              )}
            </div>
            <div className="w-8 h-8 rounded-sm bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
              <Icon name="UserCircle" size={18} className="text-neon-cyan" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-sm border border-dark-border text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-all duration-300"
              title="Выйти"
            >
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "games" && (
          <div>
            <div className="mb-10 animate-fade-in-up">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="font-orbitron text-xs text-neon-cyan tracking-[0.4em] uppercase mb-1">
                    Добро пожаловать
                  </p>
                  <h2 className="font-orbitron text-3xl font-black text-white">
                    КАТАЛОГ <span className="neon-cyan">ИГР</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="font-rajdhani text-sm tracking-wider">106.6K онлайн</span>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-neon-cyan via-neon-purple to-transparent mt-4" />
            </div>

            <div className="relative mb-8 animate-fade-in-up-delay-1">
              <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan/50" />
              <input
                className="input-neon w-full pl-10 pr-4 py-3 rounded-sm max-w-md"
                placeholder="Поиск игр..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {GAMES.map((game, i) => (
                <div
                  key={game.id}
                  className="game-card rounded-sm cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards", opacity: 0 }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                    <span className={`absolute top-2 right-2 tag-badge border rounded-sm ${game.tagColor}`}>
                      {game.tag}
                    </span>
                    <span className="absolute bottom-2 left-2 font-orbitron text-xs text-muted-foreground bg-dark-bg/80 px-2 py-1 rounded-sm">
                      {game.genre}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-orbitron text-sm font-bold text-white tracking-wider mb-1">
                      {game.title}
                    </h3>
                    <p className="font-rajdhani text-xs text-muted-foreground mb-3 leading-relaxed">
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={12} className="text-yellow-400" />
                        <span className="font-orbitron text-xs text-yellow-400">{game.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Users" size={12} />
                        <span className="font-rajdhani text-xs">{game.players}</span>
                      </div>
                    </div>

                    <button className="btn-neon w-full py-2 rounded-sm text-xs tracking-widest">
                      Играть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="animate-scale-in">
            <div className="mb-8">
              <p className="font-orbitron text-xs text-neon-purple tracking-[0.4em] uppercase mb-1">Аккаунт</p>
              <h2 className="font-orbitron text-3xl font-black text-white">
                МОЙ <span className="neon-purple">ПРОФИЛЬ</span>
              </h2>
              <div className="h-px bg-gradient-to-r from-neon-purple via-neon-pink to-transparent mt-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="glass-card rounded-sm p-6 text-center neon-border-purple">
                  <div className="relative inline-block mb-4 animate-float">
                    <div
                      className="w-24 h-24 rounded-sm border-2 border-neon-purple bg-neon-purple/10 flex items-center justify-center mx-auto"
                      style={{ boxShadow: "0 0 20px rgba(191,0,255,0.3)" }}
                    >
                      <Icon name="UserCircle" size={48} className="text-neon-purple" />
                    </div>
                    {!isGuest && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-dark-bg" />
                    )}
                  </div>

                  <h3 className="font-orbitron text-xl font-black text-white tracking-wider mb-1">
                    {currentUser}
                  </h3>
                  <p className="font-rajdhani text-sm text-muted-foreground tracking-wider mb-4">
                    {isGuest ? "Гостевой аккаунт" : "Игрок уровня 1"}
                  </p>

                  {isGuest ? (
                    <div className="border border-yellow-500/30 rounded-sm p-3 bg-yellow-500/5 mb-4">
                      <p className="font-rajdhani text-xs text-yellow-400 text-center">
                        Зарегистрируйся, чтобы сохранять прогресс
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Игр", value: "0" },
                        { label: "Побед", value: "0" },
                        { label: "Часов", value: "0" },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="font-orbitron text-lg font-black text-neon-purple">{stat.value}</p>
                          <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {isGuest ? (
                    <button
                      onClick={handleLogout}
                      className="btn-solid-cyan w-full py-2.5 rounded-sm text-xs tracking-widest"
                    >
                      Создать аккаунт
                    </button>
                  ) : (
                    <button className="btn-neon btn-neon-purple w-full py-2.5 rounded-sm text-xs tracking-widest">
                      Редактировать
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-sm p-6">
                  <h4 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Icon name="Trophy" size={16} className="text-yellow-400" />
                    Достижения
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ACHIEVEMENTS.map((ach) => (
                      <div
                        key={ach.label}
                        className="flex flex-col items-center gap-2 p-3 border border-dark-border rounded-sm hover:border-neon-cyan/30 transition-all duration-300 opacity-40 cursor-not-allowed"
                      >
                        <Icon name={ach.icon} size={24} className={ach.color} />
                        <span className="font-orbitron text-xs text-muted-foreground">{ach.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-rajdhani text-xs text-muted-foreground mt-3 text-center tracking-wider">
                    Играй, чтобы разблокировать достижения
                  </p>
                </div>

                <div className="glass-card rounded-sm p-6">
                  <h4 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Icon name="Activity" size={16} className="text-neon-cyan" />
                    Последняя активность
                  </h4>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Icon name="Gamepad2" size={40} className="text-dark-border mb-3" />
                    <p className="font-orbitron text-xs text-muted-foreground tracking-wider">
                      Нет игровой активности
                    </p>
                    <button
                      onClick={() => setTab("games")}
                      className="btn-neon mt-4 px-6 py-2 rounded-sm text-xs tracking-widest"
                    >
                      Найти игру
                    </button>
                  </div>
                </div>

                <div className="glass-card rounded-sm p-6">
                  <h4 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Icon name="Settings" size={16} className="text-neon-purple" />
                    Настройки аккаунта
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Уведомления", icon: "Bell" },
                      { label: "Приватность", icon: "Lock" },
                      { label: "Безопасность", icon: "Shield" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 border border-dark-border rounded-sm hover:border-neon-purple/30 cursor-pointer transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            name={item.icon}
                            size={16}
                            className="text-muted-foreground group-hover:text-neon-purple transition-colors"
                          />
                          <span className="font-rajdhani text-sm text-muted-foreground group-hover:text-white transition-colors tracking-wider">
                            {item.label}
                          </span>
                        </div>
                        <Icon
                          name="ChevronRight"
                          size={14}
                          className="text-dark-border group-hover:text-neon-purple transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}