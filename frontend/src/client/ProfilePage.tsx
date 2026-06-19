import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../api";
import {
  User as UserIcon,
  Trophy,
  Star,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowLeft,
  Medal,
  Coins,
  Zap,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  wins: number;
  losses: number;
  rating: number;
  unpaidCount?: number;
  rank: number;
  virtualMoney: number;
  points: number;
}

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: authUser, loading: authLoading, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || (authUser && userId === authUser.id);

  useEffect(() => {
    // Wait for auth to initialize before deciding if it's own profile
    if (!userId && !authUser && authLoading) return; 
    
    if (userId === "undefined" || userId === "null") {
      console.error("Invalid user ID provided");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userId, authUser, authLoading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Ensure we don't call /api/users/undefined
      if (!isOwnProfile && (!userId || userId === "undefined")) {
        setLoading(false);
        return;
      }

      const endpoint = isOwnProfile ? "/users/me" : `/users/${userId}`;
      const res = await api.get(endpoint);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await api.put("/users/me", { avatar: base64String });
        if (res.data?.user && isOwnProfile) {
          updateUser({ avatar: res.data.user.avatar });
        }
        fetchProfile();
      } catch (err) {
        console.error("Failed to update avatar", err);
        alert("Failed to update photo");
      }
    };
    reader.readAsDataURL(file);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`${
              star <= Math.round(rating)
                ? "fill-accent text-accent"
                : "text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="py-20">
        <LoadingSpinner message={t('profile.loading')} />
      </div>
    );
  if (!profile)
    return <div className="text-center py-20 font-black uppercase tracking-widest text-gray-500">{t('profile.not_found')}</div>;

  const winRate =
    profile.wins + profile.losses > 0
      ? ((profile.wins / (profile.wins + profile.losses)) * 100).toFixed(1)
      : "0";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isOwnProfile && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} /> {t('profile.back')}
        </button>
      )}

      {/* Header Card */}
      <div className="bg-secondary/50 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <UserIcon size={200} />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-primary rounded-[2.5rem] border-4 border-accent/30 flex items-center justify-center overflow-hidden shadow-2xl relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-5xl text-primary uppercase select-none">
                {profile.name ? profile.name[0] : 'P'}
              </div>
            )}
            {isOwnProfile && (
              <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest gap-2 select-none">
                <Camera size={20} className="text-accent animate-bounce" />
                <span>Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="text-center md:text-left space-y-4">
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase">
                {profile.name}
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest">
                {isOwnProfile ? profile.email : "Sanctioned Pro Player"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl border border-accent/20 flex items-center gap-2">
                <Trophy size={18} />
                <span className="font-black italic text-xl">
                  {t('profile.rank')} #{profile.rank}
                </span>
              </div>
              <div className="bg-white/5 text-white px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 font-black uppercase text-sm italic">
                {profile.wins} {t('profile.wins')} / {profile.losses} {t('profile.losses')}
              </div>
              <div className="bg-primary text-white px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <Zap size={18} className="text-accent" />
                <span className="font-black italic text-xl">
                  {profile.points || 0} <span className="text-[10px] uppercase not-italic opacity-70">Points</span>
                </span>
              </div>
              <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/20 flex items-center gap-2">
                <Coins size={18} />
                <span className="font-black italic text-xl">
                  {(profile.virtualMoney || 0).toLocaleString()} <span className="text-[10px] uppercase not-italic opacity-70">{t('profile.coins')}</span>
                </span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                Reputation & Skill
              </p>
              {renderStars(profile.rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<TrendingUp className="text-accent" />}
          label={t('profile.win_rate')}
          value={`${winRate}%`}
          subValue="Match Performance"
        />
        <StatCard
          icon={<Star className="text-yellow-400" />}
          label={t('profile.mastery')}
          value={parseFloat(profile.rating.toString()).toFixed(1)}
          subValue="Out of 5.0"
        />
        {isOwnProfile ? (
          <StatCard
            icon={
              <AlertCircle
                className={
                  (profile.unpaidCount || 0) > 0
                    ? "text-red-500"
                    : "text-gray-500"
                }
              />
            }
            label={t('profile.payment_status')}
            value={profile.unpaidCount || 0}
            subValue="Unpaid Penalties"
          />
        ) : (
          <StatCard
            icon={<Medal className="text-accent" />}
            label="Status"
            value="Active"
            subValue="Verified Player"
          />
        )}
      </div>

      {/* Recent Matches */}
      <div className="bg-secondary/30 rounded-[2rem] p-8 border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black italic uppercase text-white flex items-center gap-3">
            <Calendar className="text-accent" />
            {t('profile.history')}
          </h3>
        </div>
        <div className="space-y-4">
          <p className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-white/5 rounded-2xl">
            {isOwnProfile
              ? "No recent match data recorded yet."
              : `No recent matches found for ${profile.name}.`}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
}) => (
  <div className="bg-secondary/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-3xl font-black text-white italic">{value}</p>
      <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">
        {subValue}
      </p>
    </div>
  </div>
);

export default ProfilePage;
