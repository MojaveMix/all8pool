import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Bell, 
  Save,
  Info
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <Settings className="text-accent" size={32} />
            HALL CONFIGURATION
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Manage establishment rules and information</p>
        </div>
        <button className="bg-accent text-primary px-8 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-[0_10px_30px_rgba(0,255,136,0.2)] hover:scale-105 transition-transform flex items-center gap-2">
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="flex gap-8">
        {/* Settings Navigation */}
        <div className="w-64 space-y-2">
          <SettingsNavLink 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')} 
            icon={<Info size={18} />} 
            label="General Info" 
          />
          <SettingsNavLink 
            active={activeTab === 'hours'} 
            onClick={() => setActiveTab('hours')} 
            icon={<Clock size={18} />} 
            label="Opening Hours" 
          />
          <SettingsNavLink 
            active={activeTab === 'pricing'} 
            onClick={() => setActiveTab('pricing')} 
            icon={<DollarSign size={18} />} 
            label="Pricing Rules" 
          />
          <SettingsNavLink 
            active={activeTab === 'booking'} 
            onClick={() => setActiveTab('booking')} 
            icon={<ShieldCheck size={18} />} 
            label="Booking Limits" 
          />
          <SettingsNavLink 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
            icon={<Bell size={18} />} 
            label="Notifications" 
          />
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-secondary rounded-[2.5rem] border border-gray-800 p-12">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
                <Info className="text-accent" size={24} /> General Information
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <SettingsInput label="Pool Hall Name" placeholder="e.g. Master's Cue" defaultValue="The Green Room" />
                <SettingsInput label="Contact Email" placeholder="contact@hall.com" defaultValue="admin@greenroom.com" />
                <div className="col-span-2">
                  <SettingsInput label="Location Address" placeholder="123 Street, City" icon={<MapPin size={18} />} defaultValue="42 Billiard Ave, Los Angeles, CA" />
                </div>
                <div className="col-span-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">Description</label>
                   <textarea className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold h-32 resize-none">
                     Premium 8-ball and snooker lounge in the heart of downtown. 24 tables, pro-shop, and tournament events weekly.
                   </textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
                <Clock className="text-accent" size={24} /> Opening Hours
              </h3>
              <div className="space-y-4">
                 {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                   <div key={day} className="flex items-center justify-between p-4 bg-primary rounded-2xl border border-gray-800">
                     <span className="font-bold text-white w-32">{day}</span>
                     <div className="flex items-center gap-4">
                        <input type="time" defaultValue="10:00" className="bg-secondary border border-gray-800 p-2 rounded-xl text-xs font-bold outline-none focus:border-accent" />
                        <span className="text-gray-600 font-bold">to</span>
                        <input type="time" defaultValue="23:00" className="bg-secondary border border-gray-800 p-2 rounded-xl text-xs font-bold outline-none focus:border-accent" />
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent" />
                        <span className="text-[10px] font-black uppercase text-gray-500">Open</span>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
                <DollarSign className="text-accent" size={24} /> Pricing Strategy
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <SettingsInput label="Standard Hourly Rate ($)" defaultValue="12.00" type="number" />
                <SettingsInput label="Weekend Premium (%)" defaultValue="20" type="number" />
                <SettingsInput label="Member Discount (%)" defaultValue="15" type="number" />
                <SettingsInput label="Student Rate ($)" defaultValue="10.00" type="number" />
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-accent" size={24} /> Reservation Rules
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <SettingsInput label="Max Duration per Session (hrs)" defaultValue="4" type="number" />
                <SettingsInput label="Min Advance Booking (hrs)" defaultValue="1" type="number" />
                <SettingsInput label="Cancelation Window (hrs)" defaultValue="24" type="number" />
                <SettingsInput label="Max Active Bookings per User" defaultValue="2" type="number" />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
                <Bell className="text-accent" size={24} /> Notification Preferences
              </h3>
              <div className="space-y-6">
                 <NotificationToggle label="Email on New Booking" desc="Receive an email for every successful reservation." checked={true} />
                 <NotificationToggle label="SMS for Match Reminders" desc="Send players a text 1 hour before their match." checked={true} />
                 <NotificationToggle label="Weekly Performance Report" desc="Summary of revenue and bookings sent every Monday." checked={false} />
                 <NotificationToggle label="Low Inventory Alerts" desc="Notification when shop supplies are running low." checked={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsNavLink = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
      active ? 'bg-accent text-primary shadow-lg' : 'text-gray-400 hover:bg-secondary hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const SettingsInput = ({ label, icon, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
      <input 
        className={`w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold ${icon ? 'pl-12' : ''}`}
        {...props}
      />
    </div>
  </div>
);

const NotificationToggle = ({ label, desc, checked }: any) => (
  <div className="flex items-center justify-between p-6 bg-primary rounded-[2rem] border border-gray-800">
    <div>
      <p className="font-bold text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
    </div>
  </div>
);

export default SettingsPage;
