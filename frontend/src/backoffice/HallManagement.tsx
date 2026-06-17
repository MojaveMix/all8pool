import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../store/AuthContext';
import { Plus, MapPin, Phone, Clock, LayoutGrid } from 'lucide-react';

interface PoolHall {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  promotionType: 'none' | 'percentage' | 'free';
  promotionValue: number;
  currency: string;
}

const HallManagement = () => {
  const { user } = useAuth();
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHall, setEditingHall] = useState<PoolHall | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    openingTime: '09:00',
    closingTime: '23:00',
    promotionType: 'none',
    promotionValue: 0,
    currency: 'USD',
  });

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const res = await api.get('/pool-halls/my');
      setHalls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (hall: PoolHall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      address: hall.address,
      city: hall.city,
      phone: hall.phone || '',
      openingTime: hall.openingTime,
      closingTime: hall.closingTime,
      promotionType: hall.promotionType,
      promotionValue: hall.promotionValue,
      currency: hall?.currency || 'USD',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHall) {
        await api.put(`/pool-halls/${editingHall.id}`, formData);
      } else {
        await api.post('/pool-halls', formData);
      }
      setShowModal(false);
      setEditingHall(null);
      fetchHalls();
    } catch (err) {
      alert('Failed to save pool hall');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">
          {user?.role === 'admin' ? 'Global Hall Registry' : 'My Billiard Centers'}
        </h2>
        <button
          onClick={() => {
            setEditingHall(null);
            setFormData({
              name: '',
              address: '',
              city: '',
              phone: '',
              openingTime: '09:00',
              closingTime: '23:00',
              promotionType: 'none',
              promotionValue: 0,
              currency: 'USD',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Hall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {halls.map((hall) => (
          <div key={hall.id} className="group relative bg-secondary rounded-[2.5rem] p-8 border border-gray-800 hover:border-accent/40 transition-all overflow-hidden">
            {hall.promotionType !== 'none' && (
               <div className="absolute -right-12 top-6 bg-accent text-primary px-12 py-1 rotate-45 font-black text-[10px] uppercase tracking-widest shadow-xl">
                  {hall.promotionType === 'free' ? 'FREE' : `${hall.promotionValue}% OFF`}
               </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{hall.name}</h3>
              <span className="bg-primary px-3 py-1 rounded-lg text-accent text-[10px] font-black border border-white/5 uppercase">{hall.currency || 'USD'}</span>
            </div>
            
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{hall.address}, {hall.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span className="text-sm font-medium">{hall.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-accent shrink-0" />
                <span className="text-sm font-medium font-mono uppercase tracking-tighter">{hall.openingTime} - {hall.closingTime}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
               <button 
                  onClick={() => window.location.href = `/backoffice/dashboard?hallId=${hall.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-black uppercase text-xs hover:bg-gray-800 transition-colors border border-gray-800"
               >
                  <LayoutGrid size={16} /> Dashboard
               </button>
               <button 
                  onClick={() => openEditModal(hall)}
                  className="px-4 bg-gray-800 text-white rounded-xl hover:text-accent transition-colors border border-gray-700"
               >
                  Edit
               </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight uppercase">
               {editingHall ? 'Edit' : 'Register'} Pool Hall
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hall Name</label>
                <input
                  placeholder="The Pro Arena"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Currency</label>
                    <select
                      className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      required
                    >
                       <option value="USD">USD ($)</option>
                       <option value="MAD">MAD (DH)</option>
                       <option value="EUR">EUR (€)</option>
                       <option value="GBP">GBP (£)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                    <input
                      placeholder="+33..."
                      className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                    <input
                      placeholder="Paris"
                      className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Opening - Closing</label>
                    <div className="flex gap-2">
                       <input 
                          type="time" 
                          className="w-full bg-primary border border-gray-800 p-2 rounded-xl text-white outline-none focus:border-accent font-bold text-xs"
                          value={formData.openingTime}
                          onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                       />
                       <input 
                          type="time" 
                          className="w-full bg-primary border border-gray-800 p-2 rounded-xl text-white outline-none focus:border-accent font-bold text-xs"
                          value={formData.closingTime}
                          onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Address</label>
                <input
                  placeholder="Street name, number..."
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">PROMOTION DEAL</label>
                 <div className="grid grid-cols-2 gap-4">
                    <select 
                       className="bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                       value={formData.promotionType}
                       onChange={(e) => setFormData({...formData, promotionType: e.target.value as any})}
                    >
                       <option value="none">No Promotion</option>
                       <option value="percentage">Percentage Discount</option>
                       <option value="free">Free Match</option>
                    </select>
                    {formData.promotionType === 'percentage' && (
                       <div className="relative">
                          <input 
                             type="number"
                             placeholder="e.g. 50"
                             className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                             value={formData.promotionValue}
                             onChange={(e) => setFormData({...formData, promotionValue: Number(e.target.value)})}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-black">%</span>
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
                   {editingHall ? 'UPDATE' : 'REGISTER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallManagement;
