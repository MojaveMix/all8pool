import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useTranslation } from 'react-i18next';
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
  ShieldCheck
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Target className="text-accent" size={32} />,
      title: t('landing.features.booking_title'),
      description: t('landing.features.booking_desc')
    },
    {
      icon: <Users className="text-accent" size={32} />,
      title: t('landing.features.arena_title'),
      description: t('landing.features.arena_desc')
    },
    {
      icon: <Trophy className="text-accent" size={32} />,
      title: t('landing.features.ranking_title'),
      description: t('landing.features.ranking_desc')
    }
  ];

  return (
    <div className="space-y-32 -mt-10">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.1)_0%,_transparent_70%)]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-5xl px-4 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
             <Zap className="text-accent" size={16} />
             <span className="text-xs font-black uppercase tracking-[0.3em]">{t('landing.evolution')}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-tight uppercase">
            {t('landing.hero_title')}<br />
            <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">{t('landing.hero_subtitle')}</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl font-bold max-w-2xl mx-auto uppercase tracking-wide leading-relaxed">
            {t('landing.hero_desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            {user ? (
               <Link 
                to={user.role === 'owner' || user.role === 'admin' ? '/backoffice' : '/arena'} 
                className="bg-accent text-primary px-10 py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-[0_0_50px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform flex items-center gap-3"
               >
                 {t('landing.go_dashboard')} <ChevronRight size={24} />
               </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-accent text-primary px-10 py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-[0_0_50px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform flex items-center gap-3"
                >
                  {t('landing.join_arena')} <Play size={24} fill="currentColor" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter text-xl hover:bg-white/10 transition-colors"
                >
                  {t('landing.player_login')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating Decoration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-30">
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-100" />
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-200" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
         <div className="text-center space-y-2">
            <p className="text-5xl font-black italic text-white">50+</p>
            <p className="text-sm md:text-base font-black text-gray-400 uppercase tracking-widest">{t('landing.stats.halls')}</p>
         </div>
         <div className="text-center space-y-2">
            <p className="text-5xl font-black italic text-white">10k+</p>
            <p className="text-sm md:text-base font-black text-gray-400 uppercase tracking-widest">{t('landing.stats.players')}</p>
         </div>
         <div className="text-center space-y-2">
            <p className="text-5xl font-black italic text-white">24/7</p>
            <p className="text-sm md:text-base font-black text-gray-400 uppercase tracking-widest">{t('landing.stats.matches')}</p>
         </div>
         <div className="text-center space-y-2">
            <p className="text-5xl font-black italic text-white">100%</p>
            <p className="text-sm md:text-base font-black text-gray-400 uppercase tracking-widest">{t('landing.stats.experience')}</p>
         </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t('landing.features_title')}</h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {features.map((f, i) => (
            <div key={i} className="bg-secondary/40 p-10 rounded-[3rem] border border-white/5 space-y-6 hover:border-accent/30 transition-colors group">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-3xl font-black italic uppercase">{f.title}</h3>
              <p className="text-gray-400 font-bold leading-relaxed uppercase text-base tracking-wider">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hall Owner CTA */}
      <section className="bg-gradient-to-br from-secondary/80 to-primary rounded-[4rem] p-12 md:p-24 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12">
           <ShieldCheck size={400} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter">
              {t('landing.owner_cta.title')} <br />
              <span className="text-accent">{t('landing.owner_cta.subtitle')}</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              {t('landing.owner_cta.desc')}
            </p>
            <Link 
              to="/apply-owner" 
              className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:scale-105 transition-transform shadow-xl"
            >
              {t('landing.owner_cta.btn')} <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-primary/60 rounded-3xl border border-white/5 space-y-2">
                <Star className="text-accent" size={20} />
                <p className="text-sm font-black uppercase italic">{t('landing.owner_cta.analytics')}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{t('landing.owner_cta.analytics_desc')}</p>
             </div>
             <div className="p-6 bg-primary/60 rounded-3xl border border-white/5 space-y-2">
                <Calendar className="text-accent" size={20} />
                <p className="text-sm font-black uppercase italic">{t('landing.owner_cta.booking')}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{t('landing.owner_cta.booking_desc')}</p>
             </div>
             <div className="p-6 bg-primary/60 rounded-3xl border border-white/5 space-y-2">
                <Users className="text-accent" size={20} />
                <p className="text-sm font-black uppercase italic">{t('landing.owner_cta.crm')}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{t('landing.owner_cta.crm_desc')}</p>
             </div>
             <div className="p-6 bg-primary/60 rounded-3xl border border-white/5 space-y-2">
                <MapPin className="text-accent" size={20} />
                <p className="text-sm font-black uppercase italic">{t('landing.owner_cta.exposure')}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{t('landing.owner_cta.exposure_desc')}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 space-y-10">
         <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">{t('landing.final_cta')}</h2>
         <Link to="/register" className="inline-block bg-accent text-primary px-16 py-6 rounded-3xl font-black uppercase tracking-tighter text-2xl shadow-[0_0_70px_rgba(0,255,136,0.4)] hover:scale-105 transition-transform">
            {t('landing.get_cue')}
         </Link>
      </section>
    </div>
  );
};

export default LandingPage;
