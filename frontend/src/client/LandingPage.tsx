import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import {
  Trophy,
  Target,
  Users,
  Calendar,
  ChevronRight,
  Star,
  MapPin,
  Play,
  Zap,
  ShieldCheck,
  TrendingUp,
  Activity,
  Medal,
  Clock,
  ArrowRight,
  Layout,
  MousePointer2,
  Lock,
  Globe,
  Flame,
  Sparkles,
  Bolt,
  Crown,
  TrendingDown,
  Check,
  Gamepad2,
} from "lucide-react";

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ players: 0, matches: 0, halls: 0 });
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [recentWinners, setRecentWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rankingsRes, matchesRes, finishedRes] = await Promise.all([
          api.get("/users/stats"),
          api.get("/users/rankings"),
          api.get("/matches?status=live"),
          api.get("/matches?status=finished")
        ]);
        
        setStats(statsRes.data);
        setTopPlayers(rankingsRes.data.slice(0, 3));

        if (matchesRes.data && matchesRes.data.length > 0) {
          setLiveMatches(matchesRes.data.slice(0, 3));
        } else {
          setLiveMatches([
            { id: 1, player1: { name: "Alex 'The Shark'" }, player2: { name: "John Doe" }, poolHall: { name: "Elite Billiards" }, score1: 3, score2: 2, stake: 50 },
            { id: 2, player1: { name: "Sarah Connor" }, player2: { name: "Mike Tyson" }, poolHall: { name: "Rack 'Em Up" }, score1: 0, score2: 1, stake: 100 },
            { id: 3, player1: { name: "CueMaster" }, player2: { name: "Shadow" }, poolHall: { name: "The Arena" }, score1: 5, score2: 5, stake: 0 },
          ]);
        }

        if (finishedRes.data && finishedRes.data.length > 0) {
           const processedWins = finishedRes.data.map((m: any) => {
             const p1Score = m.score1 || 0;
             const p2Score = m.score2 || 0;
             const p1Name = m.player1?.name || m.player1Name || "Player 1";
             const p2Name = m.player2?.name || m.player2Name || "Player 2";
             
             if (p1Score > p2Score) return { winner: p1Name, loser: p2Name, score: `${p1Score}-${p2Score}`, pts: 50 };
             return { winner: p2Name, loser: p1Name, score: `${p2Score}-${p1Score}`, pts: 50 };
           });
           setRecentWinners(processedWins.slice(0, 4));
        } else {
           setRecentWinners([
             { winner: "LegendaryCue", loser: "FastBreak", score: "5-2", pts: 50 },
             { winner: "PoolPrince", loser: "Shark", score: "8-4", pts: 50 },
             { winner: "Shadow", loser: "Rookie99", score: "3-0", pts: 50 },
             { winner: "MasterMind", loser: "8Baller", score: "7-6", pts: 50 },
           ]);
        }

      } catch (err) {
        console.error("Error fetching landing page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tournaments = [
    {
      title: "Summer Open 2026",
      prize: "$5,000",
      date: "June 25",
      status: "Open",
      spotsLeft: 8,
    },
    {
      title: "Masters Championship",
      prize: "$10,000",
      date: "July 12",
      status: "Closing Soon",
      spotsLeft: 3,
    },
  ];

  const successStories = [
    {
      name: "Marcus J.",
      achievement: "Climbed 1000 Ranks in 3 Months",
      earnings: "$2,400 earned",
      icon: "🚀",
    },
    {
      name: "Elena K.",
      achievement: "Tournament Champion 2x",
      earnings: "$8,500 winnings",
      icon: "👑",
    },
    {
      name: "David M.",
      achievement: "Hall Elite Member",
      earnings: "$5,200 earned",
      icon: "⚡",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your player profile in 60 seconds",
    },
    {
      number: "02",
      title: "Choose Match",
      description: "Find opponents at your skill level or challenge pros",
    },
    {
      number: "03",
      title: "Compete",
      description: "Play, win, and watch your ranking climb instantly",
    },
    {
      number: "04",
      title: "Earn Rewards",
      description: "Cash out your winnings or climb the global leaderboard",
    },
  ];

  const liveFeed = [
    { time: "2m ago", action: "🎯 Alex 'The Shark' won 2,500 PTS" },
    { time: "5m ago", action: "👑 Sarah Connor ranked up to Top 50" },
    { time: "8m ago", action: "🏆 New tournament slot claimed" },
    { time: "12m ago", action: "⚡ 156 matches completed today" },
  ];

  return (
    <div className="space-y-0 overflow-hidden pb-32 relative">
      {/* Hero Section with Live Action Feed */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.15)_0%,_transparent_70%)]" />

        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 text-center space-y-10 max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-2xl shadow-[0_0_30px_rgba(255,255,136,0.05)]"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-400">
              🔥 {liveMatches.length} Matches Live Right Now
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-tight uppercase select-none">
              {t("landing.hero_title")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-cyan-500 drop-shadow-[0_0_50px_rgba(0,255,136,0.4)]">
                {t("landing.hero_subtitle")}
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-bold max-w-3xl mx-auto leading-relaxed opacity-80">
              Compete with Players Worldwide • Climb the Rankings • Win Real
              Prizes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
          >
            {user ? (
              <Link
                to={
                  user.role === "owner" || user.role === "admin"
                    ? "/backoffice"
                    : "/arena"
                }
                className="group bg-accent text-primary px-16 py-7 rounded-[2rem] font-black uppercase tracking-tighter text-2xl shadow-[0_0_60px_rgba(0,255,136,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                {t("landing.go_dashboard")}{" "}
                <ChevronRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={32}
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group bg-accent text-primary px-16 py-7 rounded-[2rem] font-black uppercase tracking-tighter text-2xl shadow-[0_0_60px_rgba(0,255,136,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4 relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {t("landing.join_arena")}{" "}
                    <Play
                      size={32}
                      fill="currentColor"
                      className="inline ml-2"
                    />
                  </span>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-accent/20 -z-10"
                  />
                </Link>
                <Link
                  to="/login"
                  className="bg-white/5 border border-white/10 text-white px-16 py-7 rounded-[2rem] font-black uppercase tracking-tighter text-2xl hover:bg-white/10 transition-colors backdrop-blur-md active:scale-95"
                >
                  {t("landing.player_login")}
                </Link>
              </>
            )}
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12"
          >
            <QuickStat
              icon={<Users />}
              label="Active Players"
              value={stats.players.toLocaleString()}
              color="text-accent"
            />
            <QuickStat
              icon={<Trophy />}
              label="Live Matches"
              value={stats.matches.toLocaleString()}
              color="text-yellow-500"
            />
            <QuickStat
              icon={<MapPin />}
              label="Global Halls"
              value={stats.halls.toLocaleString()}
              color="text-cyan-400"
            />
            <QuickStat
              icon={<Flame />}
              label="Daily Players"
              value="2,500+"
              color="text-orange-500"
            />
          </motion.div>
        </div>

        {/* Live Action Feed - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute left-8 top-1/3 hidden 2xl:block transform -translate-y-1/2 z-20"
        >
          <div className="bg-secondary/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 w-80 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">🔴 Live Results Feed</h3>
            </div>
            
            <div className="space-y-4">
              {recentWinners.map((win, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + idx * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center border border-white/10 text-accent font-black shadow-lg">
                    {win.winner[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-white truncate group-hover:text-accent transition-colors">{win.winner}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest truncate">Defeated {win.loser}</p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-xs font-black italic text-white">{win.score}</p>
                    <p className="text-[10px] text-accent font-black tracking-widest">+{win.pts}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Hall of Fame / Rankings Section - NOW AT TOP */}
      <section className="px-4 max-w-7xl mx-auto space-y-16 py-24 border-y border-white/5">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Medal size={20} />
            Climb The Rankings
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            See Who's <span className="text-accent">Leading</span>
          </h2>
          <p className="text-gray-400 text-sm font-bold max-w-2xl mx-auto">
            Real players competing for glory. You could be next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topPlayers.map((player, idx) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-secondary/30 backdrop-blur-2xl border ${idx === 0 ? "border-accent/40 shadow-[0_0_50px_rgba(0,255,136,0.1)] md:scale-105" : "border-white/10"} rounded-[3rem] p-8 md:p-10 group overflow-hidden`}
            >
              {idx === 0 && (
                <div className="absolute top-0 left-0 bg-accent text-primary px-6 py-2 font-black italic uppercase text-xs rounded-br-3xl">
                  #1 Player
                </div>
              )}

              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div
                    className={`w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] bg-primary border-4 ${idx === 0 ? "border-accent" : idx === 1 ? "border-gray-400" : "border-orange-500"} overflow-hidden shadow-2xl`}
                  >
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-black text-white/10">
                        #{idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-xl">
                    <Trophy
                      className={
                        idx === 0
                          ? "text-accent"
                          : idx === 1
                            ? "text-gray-400"
                            : "text-orange-500"
                      }
                      size={24}
                    />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter group-hover:text-accent transition-colors">
                    {player.name}
                  </h3>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= Math.round(player.rating)
                            ? "fill-accent text-accent"
                            : "text-white/10"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 w-full gap-3 pt-4">
                  <div className="bg-white/5 p-3 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      Points
                    </p>
                    <p className="text-xl md:text-2xl font-black italic text-white">
                      {player.points}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      Win Rate
                    </p>
                    <p className="text-xl md:text-2xl font-black italic text-accent">
                      {(
                        (player.wins / (player.wins + player.losses || 1)) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <Link
            to="/ranking"
            className="inline-flex items-center gap-4 bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
          >
            View Full Leaderboard{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>
          {!user && (
            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-accent/10 border border-accent/30 text-accent px-8 py-3 rounded-xl font-black uppercase tracking-tighter text-sm hover:bg-accent/20 transition-all"
              >
                <Gamepad2 size={18} />
                Start Your Journey
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Start Section - How to Get Started */}
      <section className="bg-secondary/40 border-y border-white/5 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
              <Bolt size={18} />
              Get Started Fast
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              Join in 4 <span className="text-accent">Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-secondary/50 border border-white/10 rounded-2xl p-6 space-y-4 h-full hover:border-accent/30 transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.1)]">
                  <div className="text-5xl md:text-6xl font-black italic text-white/10 group-hover:text-accent/20 transition-colors">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-black italic uppercase text-white tracking-tighter">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">
                      {step.description}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <ChevronRight size={28} className="text-accent/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-accent text-primary px-12 py-4 rounded-2xl font-black uppercase tracking-tighter text-lg hover:scale-105 transition-transform shadow-lg shadow-accent/30"
              >
                <Play size={20} fill="currentColor" />
                Start Playing Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Beginner Benefits Section */}
      <section className="px-4 max-w-7xl mx-auto py-20 space-y-14">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Star size={18} />
            Perfect For New Players
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            Start Your <span className="text-accent">Winning Journey</span>
          </h2>
          <p className="text-gray-400 text-sm font-bold max-w-2xl mx-auto">
            We help beginner and intermediate players grow their skills and
            ranking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard
            icon="🎯"
            title="Matched Players"
            description="Get paired with players at your exact skill level for fair competition"
          />
          <BenefitCard
            icon="📊"
            title="Track Progress"
            description="Watch your ranking climb instantly after every win"
          />
          <BenefitCard
            icon="🏆"
            title="Win Real Prizes"
            description="Earn points and cash rewards as you climb the leaderboard"
          />
          <BenefitCard
            icon="🛡️"
            title="Fair Play"
            description="Verified players and secure scoring to ensure honest competition"
          />
          <BenefitCard
            icon="💬"
            title="Active Community"
            description="Connect with competitive pool players worldwide"
          />
          <BenefitCard
            icon="⚡"
            title="Instant Matches"
            description="Find a game anytime with thousands of active players"
          />
        </div>

        <div className="text-center pt-6">
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-accent/10 border border-accent/30 text-accent px-8 py-3 rounded-xl font-black uppercase tracking-tighter text-sm hover:bg-accent/20 transition-all"
            >
              <Gamepad2 size={18} />
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-accent/5 py-24 px-4 border-y border-accent/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
              <Sparkles size={20} />
              Real Success Stories
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Players Like <span className="text-accent">You</span> Winning
            </h2>
            <p className="text-gray-400 text-lg font-bold max-w-2xl mx-auto">
              See what's possible when you join the elite competitive community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary/50 border border-white/10 rounded-[2.5rem] p-10 space-y-6 hover:border-accent/30 transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.1)]"
              >
                <div className="text-6xl">{story.icon}</div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                    {story.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                    {story.achievement}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <Zap size={16} className="text-accent" />
                    <span className="text-accent font-black text-lg">
                      {story.earnings}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need to Dominate - Feature Grid */}
      <section className="bg-gradient-to-b from-primary via-secondary/20 to-primary py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                Everything You Need <br />
                <span className="text-accent">To Dominate.</span>
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-lg">
                Integrated Suite for the Modern Player
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ModernFeature
              icon={<Layout />}
              title="Pro Dashboard"
              desc="Analyze every break, bank, and victory with precision data."
            />
            <ModernFeature
              icon={<MousePointer2 />}
              title="Quick Booking"
              desc="Reserve your favorite table in seconds, anytime, anywhere."
            />
            <ModernFeature
              icon={<Lock />}
              title="Secured Match"
              desc="Fair play guaranteed with verified score reporting protocols."
            />
            <QuickStat
              icon={<Globe />}
              label="Global Network"
              value="45+ Cities"
              color="text-cyan-400"
              className="bg-secondary/40 p-10 rounded-[3rem] border border-white/5"
            />
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="px-4 max-w-7xl mx-auto space-y-12 py-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <Activity className="text-red-500 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Live Arena Action
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            {liveMatches.length} Matches in Progress
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveMatches.map((match) => {
            const p1Name =
              match.player1?.name || match.player1Name || "Player 1";
            const p2Name =
              match.player2?.name || match.player2Name || "Player 2";
            const scoreText = `${match.score1 || 0} - ${match.score2 || 0}`;
            const hallName = match.poolHall?.name || "The Arena";
            const matchType =
              match.stake > 0 ? `Stake: ${match.stake} PTS` : "Friendly Match";

            return (
              <motion.div
                key={match.id}
                whileHover={{ y: -10 }}
                className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 space-y-8 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6">
                  <div className="text-[10px] font-black text-accent uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                    {matchType}
                  </div>
                </div>

                <div className="flex justify-between items-center text-center">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center text-2xl font-black border border-white/10 group-hover:border-accent/50 transition-colors shadow-xl">
                      {p1Name[0]}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest truncate w-full px-2 mx-auto">
                      {p1Name}
                    </p>
                  </div>
                  
                  <div className="px-2 md:px-4 shrink-0 flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center gap-3 bg-primary/40 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-3xl md:text-4xl font-black italic text-white drop-shadow-md">{match.score1 || 0}</span>
                      <span className="text-[10px] font-black italic text-accent uppercase tracking-widest">VS</span>
                      <span className="text-3xl md:text-4xl font-black italic text-white drop-shadow-md">{match.score2 || 0}</span>
                    </div>
                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-accent animate-shimmer" />
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center text-2xl font-black border border-white/10 group-hover:border-accent/50 transition-colors shadow-xl">
                      {p2Name[0]}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest truncate w-full px-2 mx-auto">
                      {p2Name}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={16} className="text-accent" />
                    {hallName}
                  </div>
                  <Link
                    to="/arena"
                    className="p-3 bg-accent text-primary rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                  >
                    <Play size={16} fill="currentColor" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tournaments - Large Cards with Urgency */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-accent/5 -skew-y-2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
              Sanctioned <br />
              <span className="text-yellow-500">Tournaments.</span>
            </h2>
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-[0.4em] text-xs hover:gap-6 transition-all"
            >
              All Competitions <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {tournaments.map((t_item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="group bg-secondary/50 rounded-[4rem] p-16 border border-white/10 hover:border-yellow-500/30 transition-all relative overflow-hidden flex flex-col md:flex-row items-center gap-12"
              >
                {t_item.spotsLeft <= 3 && (
                  <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-2xl">
                    <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                      🔥 {t_item.spotsLeft} Spots Left
                    </span>
                  </div>
                )}

                <div className="absolute -right-20 -top-20 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700">
                  <Trophy size={400} />
                </div>

                <div className="w-40 h-40 rounded-[3rem] bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 shadow-2xl">
                  <Calendar size={64} className="text-yellow-500" />
                </div>

                <div className="flex-1 space-y-8 text-center md:text-left relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span className="px-4 py-1.5 bg-yellow-500 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                        {t_item.status}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Clock size={14} /> {t_item.date}
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter">
                      {t_item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-10">
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                        Prize Pool
                      </p>
                      <p className="text-4xl font-black italic text-white tracking-tighter">
                        {t_item.prize}
                      </p>
                    </div>
                    <Link
                      to="/tournaments"
                      className="bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-tighter text-lg hover:bg-accent transition-colors shadow-2xl"
                    >
                      Reserve Slot
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Comparison */}
      <section className="px-4 max-w-7xl mx-auto py-24 space-y-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Crown size={20} />
            Why Choose Us
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            The <span className="text-accent">Difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { feature: "Verified Players", value: "✓" },
            { feature: "Real-Time Rankings", value: "✓" },
            { feature: "Instant Payouts", value: "✓" },
            { feature: "Fair Play Guarantee", value: "✓" },
            { feature: "24/7 Tournaments", value: "✓" },
            { feature: "Global Leaderboard", value: "✓" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 p-6 bg-secondary/30 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Check className="text-accent font-black" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black italic text-white uppercase tracking-tighter">
                  {item.feature}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hall Owner CTA - Register Your Hall */}
      <section className="px-4 max-w-7xl mx-auto py-24">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(0,255,136,0.1),_transparent)] bg-secondary/50 rounded-[5rem] p-16 md:p-32 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute -left-20 -bottom-20 opacity-5 -rotate-12">
            <ShieldCheck size={500} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.5em] text-xs">
                  <Globe size={18} />
                  Partnership Protocol
                </div>
                <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter">
                  Register <br />
                  <span className="text-accent">Your Hall.</span>
                </h2>
                <p className="text-gray-400 text-xl font-bold uppercase tracking-widest leading-relaxed max-w-lg opacity-80">
                  Professional infrastructure for modern venues. Monetize every
                  table, host sanctioned events, and grow your empire.
                </p>
              </div>
              <Link
                to="/apply-owner"
                className="inline-flex items-center gap-6 bg-white text-primary px-16 py-6 rounded-[2rem] font-black uppercase tracking-tighter text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Start Registration <ArrowRight size={28} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <OwnerFeature icon={<TrendingUp />} title="Dynamic Analytics" />
              <OwnerFeature icon={<Calendar />} title="Booking Suite" />
              <OwnerFeature icon={<Users />} title="Player Network" />
              <OwnerFeature icon={<Trophy />} title="Event Engine" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-40 relative px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[80vw] h-[80vw] bg-accent/5 blur-[150px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <h2 className="text-[12vw] font-black italic uppercase tracking-tighter leading-none select-none">
            TAKE <span className="text-accent italic">YOUR</span> CUE.
          </h2>
          <div className="space-y-4">
            <Link
              to="/register"
              className="inline-block bg-accent text-primary px-24 py-10 rounded-[3rem] font-black uppercase tracking-tighter text-4xl shadow-[0_0_120px_rgba(0,255,136,0.6)] hover:scale-110 active:scale-95 transition-all"
            >
              Enter The Arena
            </Link>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Join {stats.players.toLocaleString()} competitive players now
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const QuickStat = ({ icon, label, value, color, className = "" }: any) => (
  <div className={`space-y-2 group ${className}`}>
    <div
      className={`${color} group-hover:scale-110 transition-transform flex justify-center md:justify-start`}
    >
      {icon}
    </div>
    <div className="text-center md:text-left">
      <p className="text-3xl md:text-4xl font-black italic text-white tracking-tighter">
        {value}
      </p>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
        {label}
      </p>
    </div>
  </div>
);

const ModernFeature = ({ icon, title, desc }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-secondary/30 p-10 rounded-[3rem] border border-white/5 space-y-6 hover:border-accent/30 transition-colors group"
  >
    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
      {icon}
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">
        {title}
      </h3>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
        {desc}
      </p>
    </div>
  </motion.div>
);

const OwnerFeature = ({ icon, title }: any) => (
  <div className="p-8 bg-primary/40 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-accent/30 transition-colors">
    <div className="text-accent group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-xl font-black uppercase italic text-white tracking-tighter">
      {title}
    </p>
    <div className="w-8 h-1 bg-white/5 rounded-full group-hover:w-full transition-all duration-500" />
  </div>
);

const BenefitCard = ({ icon, title, description }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    viewport={{ once: true }}
    className="bg-secondary/30 border border-white/10 rounded-2xl p-8 space-y-4 hover:border-accent/30 transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] group"
  >
    <div className="text-4xl">{icon}</div>
    <div className="space-y-3">
      <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

export default LandingPage;
