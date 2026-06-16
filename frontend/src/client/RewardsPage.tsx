import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../store/AuthContext';
import { Gift, Coins, Coffee, Package, Tag, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'consumable' | 'equipment' | 'discount' | 'other';
  image: string | null;
  poolHall?: { name: string };
}

const RewardsPage = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMoney, setUserMoney] = useState<number>(0);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchRewards();
    fetchUserMoney();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/rewards');
      setRewards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMoney = async () => {
    try {
      const res = await api.get('/users/me');
      setUserMoney(res.data.virtualMoney);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (userMoney < reward.cost) return;

    try {
      setRedeeming(reward.id);
      const res = await api.post(`/rewards/${reward.id}/redeem`);
      setUserMoney(res.data.balance);
      setMessage({ type: 'success', text: `Successfully redeemed ${reward.name}!` });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to redeem reward' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRedeeming(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consumable': return <Coffee className="text-orange-400" />;
      case 'equipment': return <Package className="text-blue-400" />;
      case 'discount': return <Tag className="text-emerald-400" />;
      default: return <Gift className="text-purple-400" />;
    }
  };

  if (loading) return (
    <div className="py-20">
      <LoadingSpinner message="Loading Rewards..." />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-secondary/30 p-10 rounded-[3rem] border border-white/5">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
            <Gift className="text-accent" size={48} />
            Rewards Shop
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Redeem your virtual fortune for real perks</p>
        </div>

        <div className="bg-yellow-500/10 p-6 rounded-[2rem] border-2 border-yellow-500/20 flex flex-col items-center gap-1 shadow-2xl shadow-yellow-500/5">
          <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Your Balance</p>
          <div className="flex items-center gap-3">
             <Coins size={32} className="text-yellow-500" />
             <span className="text-4xl font-black italic text-white">{userMoney.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
           {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
           <p className="font-bold uppercase tracking-wider text-sm">{message.text}</p>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rewards.map((reward) => (
          <div key={reward.id} className="group bg-secondary/40 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-accent/30 transition-all flex flex-col">
            <div className="h-48 bg-primary/60 relative overflow-hidden flex items-center justify-center">
              {reward.image ? (
                <img src={reward.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="opacity-20 group-hover:opacity-40 transition-opacity">
                   <ShoppingBag size={80} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                 {getCategoryIcon(reward.category)}
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">{reward.category}</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-accent transition-colors">{reward.name}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{reward.description}</p>
              </div>

              {reward.poolHall && (
                <div className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 w-fit">
                   Valid at: {reward.poolHall.name}
                </div>
              )}

              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Price</span>
                    <div className="flex items-center gap-1.5">
                       <Coins size={16} className="text-yellow-500" />
                       <span className="text-2xl font-black italic text-white">{reward.cost.toLocaleString()}</span>
                    </div>
                 </div>

                 <button
                   onClick={() => handleRedeem(reward)}
                   disabled={userMoney < reward.cost || redeeming === reward.id}
                   className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs italic transition-all ${
                     userMoney >= reward.cost 
                     ? 'bg-accent text-primary hover:scale-105 active:scale-95 shadow-lg shadow-accent/20' 
                     : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                   }`}
                 >
                   {redeeming === reward.id ? 'Processing...' : userMoney >= reward.cost ? 'Redeem Now' : 'Not Enough'}
                 </button>
              </div>
            </div>
          </div>
        ))}

        {rewards.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
             <ShoppingBag size={64} className="mx-auto text-gray-800" />
             <p className="text-gray-500 font-bold uppercase tracking-widest">The shop is empty. Check back later!</p>
          </div>
        )}
      </div>

      {/* Suggestion Section */}
      <div className="bg-gradient-to-r from-accent/10 to-transparent p-12 rounded-[3rem] border border-accent/20">
         <div className="max-w-3xl space-y-6">
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Pro Player Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <p className="text-accent font-black uppercase tracking-widest text-xs">Winning Big</p>
                  <p className="text-gray-400 text-sm">Challenge other players with <span className="text-white italic">High Stakes</span> matches to double your fortune instantly.</p>
               </div>
               <div className="space-y-2">
                  <p className="text-emerald-400 font-black uppercase tracking-widest text-xs">Daily Grinding</p>
                  <p className="text-gray-400 text-sm">Even small matches award a <span className="text-white italic">Base Reward</span>. Consistency is key to the elite rankings.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RewardsPage;
