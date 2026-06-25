import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import api from "../api";
import {
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  Star,
  MapPin,
  Play,
  ShieldCheck,
  TrendingUp,
  Activity,
  Medal,
  Clock,
  ArrowRight,
  Globe,
  Flame,
  Bolt,
  Crown,
  Check,
  Gamepad2,
  Swords,
  Target,
  LineChart,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ players: 0, matches: 0, halls: 0 });
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [openChallenges, setOpenChallenges] = useState<any[]>([]);
  const [recentWinners, setRecentWinners] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rankingsRes, matchesRes, finishedRes, challengesRes] =
          await Promise.all([
            api.get("/users/stats"),
            api.get("/users/rankings"),
            api.get("/matches?status=live"),
            api.get("/matches?status=finished"),
            api.get("/matches?status=open"),
          ]);

        setStats(statsRes.data);
        if (rankingsRes.data && rankingsRes.data.length > 0) {
          setTopPlayers(rankingsRes.data.slice(0, 3));
        } else {
          setTopPlayers([
            {
              id: 101,
              name: "Efren 'Bata'",
              rating: 5.0,
              points: 15200,
              wins: 120,
              losses: 15,
            },
            {
              id: 102,
              name: "Shane Van Boening",
              rating: 4.8,
              points: 14850,
              wins: 110,
              losses: 20,
            },
            {
              id: 103,
              name: "Jayson Shaw",
              rating: 4.7,
              points: 14100,
              wins: 105,
              losses: 25,
            },
          ]);
        }

        if (matchesRes.data && matchesRes.data.length > 0) {
          setLiveMatches(matchesRes.data.slice(0, 3));
        } else {
          setLiveMatches([
            {
              id: 1,
              player1: { name: "Alex 'The Shark'" },
              player2: { name: "John Doe" },
              poolHall: { name: "Elite Billiards" },
              score1: 3,
              score2: 2,
              stake: 50,
            },
            {
              id: 2,
              player1: { name: "Sarah Connor" },
              player2: { name: "Mike Tyson" },
              poolHall: { name: "Rack 'Em Up" },
              score1: 0,
              score2: 1,
              stake: 100,
            },
          ]);
        }

        if (challengesRes.data && challengesRes.data.length > 0) {
          setOpenChallenges(challengesRes.data.slice(0, 3));
        } else {
          setOpenChallenges([
            {
              id: 3,
              player1: { name: "GhostBreak" },
              poolHall: { name: "The Arena" },
              stake: 200,
              status: "open",
            },
            {
              id: 4,
              player1: { name: "ProHustler" },
              poolHall: { name: "Diamond Club" },
              stake: 0,
              status: "open",
            },
          ]);
        }

        if (finishedRes.data && finishedRes.data.length > 0) {
          const processedWins = finishedRes.data.map((m: any) => {
            const p1Score = m.score1 || 0;
            const p2Score = m.score2 || 0;
            const p1Name = m.player1?.name || m.player1Name || "Player 1";
            const p2Name = m.player2?.name || m.player2Name || "Player 2";

            if (p1Score > p2Score)
              return {
                winner: p1Name,
                loser: p2Name,
                score: `${p1Score}-${p2Score}`,
                pts: 50,
              };
            return {
              winner: p2Name,
              loser: p1Name,
              score: `${p2Score}-${p1Score}`,
              pts: 50,
            };
          });
          setRecentWinners(processedWins.slice(0, 4));
        } else {
          setRecentWinners([
            {
              winner: "LegendaryCue",
              loser: "FastBreak",
              score: "5-2",
              pts: 50,
            },
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

  const steps = [
    {
      number: "01",
      title: t("landing.steps.step1_title"),
      description: t("landing.steps.step1_desc"),
    },
    {
      number: "02",
      title: t("landing.steps.step2_title"),
      description: t("landing.steps.step2_desc"),
    },
    {
      number: "03",
      title: t("landing.steps.step3_title"),
      description: t("landing.steps.step3_desc"),
    },
    {
      number: "04",
      title: t("landing.steps.step4_title"),
      description: t("landing.steps.step4_desc"),
    },
  ];

  return (
    <div className="space-y-0 overflow-hidden pb-32 relative">
      {/* Hero Section with Live Action Feed */}
      <section className="relative z-10 min-h-[80vh] flex items-center justify-center pt-24 pb-20">
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

        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="space-y-10 text-center lg:text-left lg:col-span-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-2xl shadow-[0_0_30px_rgba(255,255,136,0.05)] self-center lg:self-start"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-400 flex items-center gap-1.5">
                <Flame
                  size={12}
                  className="inline mr-1 text-yellow-400 animate-pulse"
                />
                {t("landing.live_activity", {
                  matches: liveMatches.length,
                  challenges: openChallenges.length,
                })}
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
              <p className="text-gray-400 text-lg md:text-xl font-bold max-w-3xl lg:mx-0 mx-auto leading-relaxed opacity-80">
                {t("landing.hero_desc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4 w-full"
            >
              {user ? (
                <Link
                  to={
                    user.role === "owner" || user.role === "admin"
                      ? "/backoffice"
                      : "/arena"
                  }
                  className="group bg-accent text-primary px-6 sm:px-10 md:px-16 py-4 sm:py-5 md:py-7 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase tracking-tighter text-sm sm:text-lg md:text-2xl shadow-[0_0_60px_rgba(0,255,136,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative overflow-hidden whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3 select-none">
                    <span>{t("landing.go_dashboard")}</span>
                    <ChevronRight
                      className="group-hover:translate-x-2 transition-transform shrink-0"
                      size={20}
                    />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-accent text-primary px-6 sm:px-10 md:px-16 py-4 sm:py-5 md:py-7 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase tracking-tighter text-sm sm:text-lg md:text-2xl shadow-[0_0_60px_rgba(0,255,136,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative overflow-hidden whitespace-nowrap w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center gap-3 select-none">
                      <span>{t("landing.join_arena")}</span>
                      <Play
                        size={18}
                        fill="currentColor"
                        className="shrink-0"
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
                    className="bg-white/5 border border-white/10 text-white px-6 sm:px-10 md:px-16 py-4 sm:py-5 md:py-7 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase tracking-tighter text-sm sm:text-lg md:text-2xl hover:bg-white/10 transition-colors backdrop-blur-md active:scale-95 flex items-center justify-center whitespace-nowrap w-full sm:w-auto"
                  >
                    <span className="select-none">
                      {t("landing.player_login")}
                    </span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12 animate-in fade-in duration-500"
            >
              <QuickStat
                icon={<Users />}
                label={t("landing.stats.players")}
                value={stats.players.toLocaleString()}
                color="text-accent"
              />
              <QuickStat
                icon={<Trophy />}
                label={t("landing.stats.matches")}
                value={stats.matches.toLocaleString()}
                color="text-yellow-500"
              />
              <QuickStat
                icon={<MapPin />}
                label={t("landing.stats.halls")}
                value={stats.halls.toLocaleString()}
                color="text-cyan-400"
              />
              <QuickStat
                icon={<Flame />}
                label={t("landing.stats.daily_players")}
                value="2,500+"
                color="text-orange-500"
              />
            </motion.div>
          </div>

          {/* Right Column: Live Results Feed Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-4 w-full max-w-md mx-auto"
          >
            <div className="bg-secondary/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">
                  {t("landing.live_results_feed")}
                </h3>
              </div>

              <div className="space-y-4">
                {recentWinners.map((win, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                  >
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center border border-white/10 text-accent font-black shadow-lg shrink-0">
                      {win.winner ? win.winner[0] : "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase text-white truncate group-hover:text-accent transition-colors">
                        {win.winner}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest truncate mt-0.5">
                        {t("landing.defeated", { name: win.loser })}
                      </p>
                    </div>
                    <div className="text-right flex flex-col justify-center shrink-0">
                      <p className="text-xs font-black italic text-white">
                        {win.score}
                      </p>
                      <p className="text-[10px] text-accent font-black tracking-widest">
                        +{win.pts}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hall of Fame / Rankings Section */}
      <section className="relative z-10 px-4 max-w-7xl mx-auto space-y-16 py-24 border-y border-white/5">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Medal size={20} />
            {t("landing.climb_rankings")}
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            {t("landing.leaderboard_title_prefix")}{" "}
            <span className="text-accent">
              {t("landing.leaderboard_title_highlight")}
            </span>
          </h2>
          <p className="text-gray-400 text-sm font-bold max-w-2xl mx-auto">
            {t("landing.leaderboard_desc")}
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
                  {t("landing.top_player")}
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
                      <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-3xl md:text-4xl text-primary uppercase select-none">
                        {player.name ? player.name[0] : "P"}
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
                      {t("landing.points")}
                    </p>
                    <p className="text-xl md:text-2xl font-black italic text-white">
                      {player.points}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      {t("profile.win_rate")}
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
            {t("landing.view_full_leaderboard")}{" "}
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
                {t("landing.start_journey")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Live Matches & Challenges Section */}
      <section className="relative z-10 px-4 max-w-7xl mx-auto space-y-12 py-24 bg-gradient-to-b from-transparent to-secondary/10">
        {/* Active Open Challenges */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                <Swords className="text-yellow-500 animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                {t("hall.open_challenges")}
              </h2>
            </div>
            <Link
              to="/arena"
              className="hidden md:flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              {t("landing.view_all")} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openChallenges.map((challenge) => {
              const p1Name =
                challenge.player1?.name || challenge.player1Name || "Anonymous";
              const hallName = challenge.poolHall?.name || "The Arena";
              return (
                <motion.div
                  key={`challenge-${challenge.id}`}
                  whileHover={{ y: -5 }}
                  className="bg-secondary/60 backdrop-blur-xl border border-yellow-500/20 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[50px] pointer-events-none" />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-xl font-black border border-white/10 group-hover:border-yellow-500/50 transition-colors">
                        {p1Name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest">
                          {p1Name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-yellow-500" />{" "}
                          {hallName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        {t("landing.stake")}
                      </p>
                      <p className="text-lg font-black italic text-yellow-500">
                        {challenge.stake > 0
                          ? `${challenge.stake} PTS`
                          : t("landing.free")}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/arena"
                    className="block w-full py-3 text-center bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 font-black uppercase tracking-widest text-xs rounded-xl transition-colors"
                  >
                    {t("arena.accept_challenge")}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Active Matches */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                <Activity className="text-red-500 animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                {t("landing.live_arena_action")}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              {t("landing.matches_in_progress", { count: liveMatches.length })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {liveMatches.map((match) => {
              const p1Name =
                match.player1?.name || match.player1Name || "Player 1";
              const p2Name =
                match.player2?.name || match.player2Name || "Player 2";
              const hallName = match.poolHall?.name || "The Arena";
              const matchType =
                match.stake > 0
                  ? t("landing.stake_pts", { points: match.stake })
                  : t("landing.friendly_match");

              return (
                <motion.div
                  key={`live-${match.id}`}
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
                        <span className="text-3xl md:text-4xl font-black italic text-white drop-shadow-md">
                          {match.score1 || 0}
                        </span>
                        <span className="text-[10px] font-black italic text-accent uppercase tracking-widest">
                          VS
                        </span>
                        <span className="text-3xl md:text-4xl font-black italic text-white drop-shadow-md">
                          {match.score2 || 0}
                        </span>
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
        </div>

        {/* Live Completed Results (Live Results Feed) */}
        <div className="pt-16 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30">
                <CheckCircle className="text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                {t("landing.live_results_feed")}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs">
              <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
              Recent Victories
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentWinners.map((win, idx) => (
              <motion.div
                key={`completed-${idx}`}
                whileHover={{ y: -5 }}
                className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 space-y-4 relative group overflow-hidden shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-lg font-black border border-white/10 text-accent shadow-lg group-hover:border-accent/40 transition-colors">
                    {win.winner ? win.winner[0] : "P"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-white truncate group-hover:text-accent transition-colors">
                      {win.winner}
                    </p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest truncate mt-0.5">
                      {t("landing.defeated", { name: win.loser })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
                      SCORE
                    </p>
                    <p className="text-xl font-black italic text-white leading-none">
                      {win.score}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
                      POINTS
                    </p>
                    <p className="text-xl font-black italic text-accent leading-none">
                      +{win.pts}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments - Large Cards with Urgency */}
      <section className="relative z-10 py-20">
        <div className="absolute inset-0 bg-accent/5 -skew-y-2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
              {t("landing.sanctioned")} <br />
              <span className="text-yellow-500">
                {t("landing.tournaments")}.
              </span>
            </h2>
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-[0.4em] text-xs hover:gap-6 transition-all"
            >
              {t("landing.all_competitions")} <ChevronRight size={16} />
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
                  <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-2xl flex items-center gap-1.5">
                    <Flame size={12} className="text-red-500 animate-pulse" />
                    <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                      {t("landing.spots_left", { count: t_item.spotsLeft })}
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
                        {t("landing.prize_pool")}
                      </p>
                      <p className="text-4xl font-black italic text-white tracking-tighter">
                        {t_item.prize}
                      </p>
                    </div>
                    <Link
                      to="/tournaments"
                      className="bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-tighter text-lg hover:bg-accent transition-colors shadow-2xl"
                    >
                      {t("landing.reserve_slot")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Comparison */}
      <section className="relative z-10 px-4 max-w-7xl mx-auto py-24 space-y-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Crown size={20} />
            {t("landing.why_choose_us")}
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            {t("landing.the_difference_prefix")}{" "}
            <span className="text-accent">
              {t("landing.the_difference_highlight")}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              feature: t("landing.features_list.verified_players"),
              value: "✓",
            },
            {
              feature: t("landing.features_list.realtime_rankings"),
              value: "✓",
            },
            { feature: t("landing.features_list.instant_payouts"), value: "✓" },
            {
              feature: t("landing.features_list.fairplay_guarantee"),
              value: "✓",
            },
            { feature: t("landing.features_list.tournaments_247"), value: "✓" },
            {
              feature: t("landing.features_list.global_leaderboard"),
              value: "✓",
            },
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

      {/* Quick Start Section - How to Get Started */}
      <section className="relative z-10 bg-secondary/40 border-y border-white/5 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
              <Bolt size={18} />
              {t("landing.get_started_fast")}
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              {t("landing.join_steps_prefix")}{" "}
              <span className="text-accent">
                {t("landing.join_steps_highlight")}
              </span>
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
                {t("landing.join_arena")}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Beginner Benefits Section */}
      <section className="relative z-10 px-4 max-w-7xl mx-auto py-20 space-y-14">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-accent font-black uppercase tracking-[0.5em] text-xs">
            <Star size={18} />
            {t("landing.perfect_for_beginners")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            {t("landing.winning_journey_prefix")}{" "}
            <span className="text-accent">
              {t("landing.winning_journey_highlight")}
            </span>
          </h2>
          <p className="text-gray-400 text-sm font-bold max-w-2xl mx-auto">
            {t("landing.winning_journey_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard
            icon={<Target size={40} className="text-accent" />}
            title={t("landing.benefits.matched_title")}
            description={t("landing.benefits.matched_desc")}
          />
          <BenefitCard
            icon={<LineChart size={40} className="text-accent" />}
            title={t("landing.benefits.track_title")}
            description={t("landing.benefits.track_desc")}
          />
          <BenefitCard
            icon={<Trophy size={40} className="text-accent" />}
            title={t("landing.benefits.prizes_title")}
            description={t("landing.benefits.prizes_desc")}
          />
          <BenefitCard
            icon={<ShieldCheck size={40} className="text-accent" />}
            title={t("landing.benefits.fair_title")}
            description={t("landing.benefits.fair_desc")}
          />
          <BenefitCard
            icon={<MessageSquare size={40} className="text-accent" />}
            title={t("landing.benefits.community_title")}
            description={t("landing.benefits.community_desc")}
          />
          <BenefitCard
            icon={<Bolt size={40} className="text-accent" />}
            title={t("landing.benefits.instant_title")}
            description={t("landing.benefits.instant_desc")}
          />
        </div>

        <div className="text-center pt-6">
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-accent/10 border border-accent/30 text-accent px-8 py-3 rounded-xl font-black uppercase tracking-tighter text-sm hover:bg-accent/20 transition-all"
            >
              <Gamepad2 size={18} />
              {t("landing.create_free_account")}
            </Link>
          )}
        </div>
      </section>

      {/* Hall Owner CTA - Register Your Hall */}
      <section className="relative z-10 px-4 max-w-7xl mx-auto py-24 border-t border-white/5">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(0,255,136,0.1),_transparent)] bg-secondary/50 rounded-[5rem] p-16 md:p-32 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute -left-20 -bottom-20 opacity-5 -rotate-12">
            <ShieldCheck size={500} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.5em] text-xs">
                  <Globe size={18} />
                  {t("landing.partnership_protocol")}
                </div>
                <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter">
                  {t("landing.owner_cta.register_title_prefix")} <br />
                  <span className="text-accent">
                    {t("landing.owner_cta.register_title_highlight")}
                  </span>
                </h2>
                <p className="text-gray-400 text-xl font-bold uppercase tracking-widest leading-relaxed max-w-lg opacity-80">
                  {t("landing.owner_cta.desc")}
                </p>
              </div>
              <Link
                to="/apply-owner"
                className="inline-flex items-center gap-6 bg-white text-primary px-16 py-6 rounded-[2rem] font-black uppercase tracking-tighter text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                {t("landing.owner_cta.start_registration")}{" "}
                <ArrowRight size={28} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <OwnerFeature
                icon={<TrendingUp />}
                title={t("landing.owner_cta.analytics")}
              />
              <OwnerFeature
                icon={<Calendar />}
                title={t("landing.owner_cta.booking")}
              />
              <OwnerFeature
                icon={<Users />}
                title={t("landing.owner_cta.crm")}
              />
              <OwnerFeature
                icon={<Trophy />}
                title={t("landing.owner_cta.exposure")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 text-center py-40 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[80vw] h-[80vw] bg-accent/5 blur-[150px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <h2 className="text-[12vw] font-black italic uppercase tracking-tighter leading-none select-none">
            {t("landing.take_your_cue_prefix")}{" "}
            <span className="text-accent italic">
              {t("landing.take_your_cue_highlight")}
            </span>{" "}
            {t("landing.take_your_cue_suffix")}
          </h2>
          <div className="space-y-4">
            <Link
              to="/register"
              className="inline-block bg-accent text-primary px-24 py-10 rounded-[3rem] font-black uppercase tracking-tighter text-4xl shadow-[0_0_120px_rgba(0,255,136,0.6)] hover:scale-110 active:scale-95 transition-all"
            >
              {t("landing.enter_arena")}
            </Link>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              {t("landing.join_players_now", {
                count: stats.players.toLocaleString(),
              })}
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
