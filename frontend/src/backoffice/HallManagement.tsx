import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, MapPin, Phone, Clock, LayoutGrid } from 'lucide-react';

interface PoolHall {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  openingTime: string;
  closingTime: string;
}

const HallManagement = () => {
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    openingTime: '09:00',
    closingTime: '23:00',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pool-halls', formData);
      setShowModal(false);
      fetchHalls();
    } catch (err) {
      alert('Failed to create pool hall');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Pool Halls</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
        >
          <Plus size={20} /> Add Pool Hall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-secondary p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors">
            <h3 className="text-xl font-bold text-accent mb-4">{hall.name}</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2"><MapPin size={16} /> {hall.address}, {hall.city}</div>
              <div className="flex items-center gap-2"><Phone size={16} /> {hall.phone}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {hall.openingTime} - {hall.closingTime}</div>
            </div>
            <button 
              onClick={() => window.location.href = `/backoffice/dashboard?hallId=${hall.id}`}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <LayoutGrid size={18} /> Manage Hall
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-8 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-accent mb-6">Register Pool Hall</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Hall Name"
                className="w-full bg-primary border border-gray-700 p-2 rounded text-white"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                placeholder="Address"
                className="w-full bg-primary border border-gray-700 p-2 rounded text-white"
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
              <input
                placeholder="City"
                className="w-full bg-primary border border-gray-700 p-2 rounded text-white"
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
              <input
                placeholder="Phone"
                className="w-full bg-primary border border-gray-700 p-2 rounded text-white"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <div className="flex gap-4">
                <input
                  type="time"
                  className="w-1/2 bg-primary border border-gray-700 p-2 rounded text-white"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                />
                <input
                  type="time"
                  className="w-1/2 bg-primary border border-gray-700 p-2 rounded text-white"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-white py-2 rounded">Cancel</button>
                <button type="submit" className="flex-1 bg-accent text-primary font-bold py-2 rounded">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallManagement;
