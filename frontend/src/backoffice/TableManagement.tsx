import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { 
  Plus, 
  Settings, 
  Play, 
  Square, 
  LayoutGrid, 
  Edit3,
  Search
} from 'lucide-react';

interface Table {
  id: string;
  number: number;
  type: '8-ball' | '9-ball' | 'snooker';
  status: 'available' | 'occupied' | 'soon_available' | 'maintenance';
  pricePerHour: number;
}

const TableManagement = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [tables, setTables] = useState<Table[]>([]);
  const [hallCurrency, setHallCurrency] = useState('USD');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    type: '8-ball' as '8-ball',
    pricePerHour: '12',
  });

  const [showMatchModal, setShowMatchModal] = useState<Table | null>(null);
  const [player1Name, setPlayer1Name] = useState('');
  const [player1Id, setPlayer1Id] = useState<string | null>(null);
  const [player2Name, setPlayer2Name] = useState('');
  const [player2Id, setPlayer2Id] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<1 | 2>(1);
  const [isQuickResult, setIsQuickResult] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    if (hallId) fetchTables();
  }, [hallId]);

  const fetchTables = async () => {
    try {
      const res = await api.get(`/pool-halls/my`);
      const hall = res.data.find((h: any) => h.id === hallId);
      if (hall) {
        setTables(hall.tables);
        setHallCurrency(hall.currency || 'USD');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tables', { ...formData, poolHallId: hallId });
      setShowModal(false);
      fetchTables();
    } catch (err) {
      alert('Failed to add table');
    }
  };

  const updateStatus = async (tableId: string, status: string) => {
    try {
      await api.patch(`/tables/${tableId}/status`, { status });
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const startMatch = async () => {
    if (!showMatchModal) return;
    if ((player1Id && player2Id && player1Id === player2Id) ||
        (!player1Id && !player2Id && player1Name && player2Name && player1Name.toLowerCase() === player2Name.toLowerCase())) {
      alert('A player cannot play against themselves');
      return;
    }
    try {
      await api.post('/matches', {
        tableId: showMatchModal.id,
        poolHallId: hallId,
        player1Id,
        player1Name,
        player2Id,
        player2Name,
        status: isQuickResult ? 'finished' : undefined,
        score1: isQuickResult ? score1 : 0,
        score2: isQuickResult ? score2 : 0
      });
      setShowMatchModal(null);
      setIsQuickResult(false);
      setScore1(0);
      setScore2(0);
      fetchTables();
      alert(isQuickResult ? 'Result recorded!' : 'Match started!');
    } catch (err) {
      alert('Failed to process match');
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users?search=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectUser = (user: any) => {
    if (activePlayerIndex === 1) {
      if (player2Id === user.id) {
        alert('A player cannot play against themselves');
        return;
      }
      setPlayer1Id(user.id);
      setPlayer1Name(user.name);
    } else {
      if (player1Id === user.id) {
        alert('A player cannot play against themselves');
        return;
      }
      setPlayer2Id(user.id);
      setPlayer2Name(user.name);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <LayoutGrid className="text-accent" size={32} />
            TABLE ASSET MANAGEMENT
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Configure and monitor your billiard assets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} /> Add New Table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tables.map((table) => (
          <ProfessionalTableCard 
            key={table.id} 
            table={table} 
            currency={hallCurrency}
            onUpdateStatus={(status) => updateStatus(table.id, status)} 
            onStartMatch={() => setShowMatchModal(table)}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight">ADD NEW TABLE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Table Number</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Table Category</label>
                <select
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="8-ball">8-Ball American</option>
                  <option value="9-ball">9-Ball Pro</option>
                  <option value="snooker">English Snooker</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hourly Rate ({hallCurrency})</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">{hallCurrency}</div>
                   <input
                    type="number"
                    placeholder="12.00"
                    className="w-full bg-primary border border-gray-800 pl-14 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">REGISTER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMatchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-lg p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black italic text-accent tracking-tight uppercase">
                {isQuickResult ? 'Record Result' : 'Start Match'} - Table #{showMatchModal.number}
              </h3>
              <button 
                onClick={() => setIsQuickResult(!isQuickResult)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${isQuickResult ? 'bg-accent text-primary border-accent' : 'bg-primary text-gray-500 border-gray-800'}`}
              >
                {isQuickResult ? 'Switch to Live Match' : 'Switch to Quick Result'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activePlayerIndex === 1 ? 'border-accent bg-accent/5' : 'border-gray-800 bg-primary'}`} onClick={() => setActivePlayerIndex(1)}>
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Player 1</p>
                  <p className="text-lg font-black">{player1Name || 'Set Player 1'}</p>
                  {isQuickResult && (
                    <div className="mt-4">
                       <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">Final Score</label>
                       <input 
                        type="number" 
                        className="w-full bg-secondary border border-gray-800 p-2 rounded-lg text-white font-black text-center"
                        value={score1}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setScore1(Number(e.target.value))}
                       />
                    </div>
                  )}
                </div>
                <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activePlayerIndex === 2 ? 'border-accent bg-accent/5' : 'border-gray-800 bg-primary'}`} onClick={() => setActivePlayerIndex(2)}>
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Player 2</p>
                  <p className="text-lg font-black">{player2Name || 'Set Player 2'}</p>
                  {isQuickResult && (
                    <div className="mt-4">
                       <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">Final Score</label>
                       <input 
                        type="number" 
                        className="w-full bg-secondary border border-gray-800 p-2 rounded-lg text-white font-black text-center"
                        value={score2}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setScore2(Number(e.target.value))}
                       />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 bg-primary/50 p-6 rounded-[2rem] border border-gray-800">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Search Player {activePlayerIndex}</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      placeholder="Name or email..."
                      className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                      value={searchQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {searchResults.map(user => (
                        <button key={user.id} onClick={() => selectUser(user)} className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors">
                          <span className="text-sm font-bold">{user.name}</span>
                          <Plus size={14} className="text-accent" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-primary px-4 text-gray-500">OR DYNAMIC</span></div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Guest Name"
                    className="flex-1 bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={activePlayerIndex === 1 ? (player1Id ? '' : player1Name) : (player2Id ? '' : player2Name)}
                    onChange={(e) => {
                      if (activePlayerIndex === 1) { setPlayer1Name(e.target.value); setPlayer1Id(null); }
                      else { setPlayer2Name(e.target.value); setPlayer2Id(null); }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      // Guest name is already updated via onChange
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="bg-gray-800 px-6 rounded-2xl font-bold text-xs uppercase hover:bg-gray-700"
                  >
                    Set
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => {
                  setShowMatchModal(null);
                  setIsQuickResult(false);
                  setPlayer1Name('');
                  setPlayer1Id(null);
                  setPlayer2Name('');
                  setPlayer2Id(null);
                  setScore1(0);
                  setScore2(0);
                }} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors">Cancel</button>
                <button 
                  onClick={async () => {
                    await startMatch();
                    setPlayer1Name('');
                    setPlayer1Id(null);
                    setPlayer2Name('');
                    setPlayer2Id(null);
                  }}
                  disabled={!player1Name || (isQuickResult && !player2Name)}
                  className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isQuickResult ? 'RECORD RESULT' : 'START MATCH'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfessionalTableCard = ({ table, currency, onUpdateStatus, onStartMatch }: { 
  table: Table, 
  currency: string,
  onUpdateStatus: (status: string) => void,
  onStartMatch: () => void
}) => {
  const statusColors = {
    available: 'bg-success/10 text-success border-success/20',
    occupied: 'bg-danger/10 text-danger border-danger/20',
    soon_available: 'bg-warning/10 text-warning border-warning/20',
    maintenance: 'bg-gray-800 text-gray-400 border-gray-700'
  };

  return (
    <div className="bg-secondary rounded-[2.5rem] p-8 border border-gray-800 group hover:border-accent/40 transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 block">ASSET ID</span>
          <h4 className="text-4xl font-black italic tracking-tighter text-white">#{table.number}</h4>
        </div>
        <button className="p-3 bg-primary border border-gray-800 rounded-2xl text-gray-500 hover:text-white transition-colors">
          <Edit3 size={18} />
        </button>
      </div>

      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border mb-6 inline-block ${statusColors[table.status]}`}>
        {table.status.replace('_', ' ')}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-primary rounded-2xl border border-gray-800">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Type</p>
          <p className="text-sm font-black text-white">{table.type.toUpperCase()}</p>
        </div>
        <div className="p-4 bg-primary rounded-2xl border border-gray-800">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Rate</p>
          <p className="text-sm font-black text-accent">{currency}{table.pricePerHour}<span className="text-[10px] text-gray-600">/hr</span></p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-800/50">
        {table.status === 'occupied' ? (
          <button 
            onClick={() => onUpdateStatus('available')}
            className="flex-1 flex items-center justify-center gap-2 bg-danger/10 text-danger border border-danger/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all"
          >
            <Square size={14} /> Stop Match
          </button>
        ) : (
          <button 
            onClick={onStartMatch}
            className="flex-1 flex items-center justify-center gap-2 bg-success/10 text-success border border-success/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all"
          >
            <Play size={14} /> Start Match
          </button>
        )}
        <button 
          onClick={() => onUpdateStatus('maintenance')}
          className="p-3 bg-primary border border-gray-800 rounded-xl text-gray-500 hover:text-warning transition-colors"
          title="Maintenance Mode"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default TableManagement;
