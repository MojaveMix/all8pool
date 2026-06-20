import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Users, Plus, ChevronRight, Star, Check, X, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../api';
import CustomAlert from '../shared/CustomAlert';
import { TournamentBracket } from '../shared/TournamentBracket';

const TournamentsPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: 16,
    entryFee: 0,
  });
  const [alertConfig, setAlertConfig] = useState<any>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (type: string, title: string, message: string, onConfirm?: () => void, confirmText?: string) => {
    setAlertConfig({ isOpen: true, type, title, message, onConfirm, confirmText });
  };

  const tournamentIdParam = searchParams.get('tournamentId');

  useEffect(() => {
    if (hallId) fetchTournaments();
  }, [hallId, tournamentIdParam]);

  const fetchTournaments = async () => {
    try {
      const res = await api.get(`/tournaments?poolHallId=${hallId}`);
      setTournaments(res.data);
      if (tournamentIdParam) {
        const found = res.data.find((t: any) => t.id === tournamentIdParam);
        if (found) setSelectedTournament(found);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tournaments', { ...formData, poolHallId: hallId });
      setShowCreateModal(false);
      setFormData({ name: '', size: 16, entryFee: 0 });
      fetchTournaments();
    } catch (error) {
      alert('Failed to create tournament');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament) return;
    showAlert(
      'warning',
      'Confirm Update',
      "Are you sure you want to update this tournament's details?",
      async () => {
        try {
          const res = await api.put(`/tournaments/${selectedTournament.id}`, formData);
          setShowEditModal(false);
          setFormData({ name: '', size: 16, entryFee: 0 });
          setSelectedTournament(res.data);
          fetchTournaments();
          showAlert('success', 'Updated', 'Tournament details updated successfully.');
        } catch (error) {
          showAlert('error', 'Error', 'Failed to update tournament.');
        }
      },
      'Save'
    );
  };

  const handleDelete = async (id: string) => {
    showAlert(
      'error',
      'Delete Tournament',
      "Are you sure you want to DELETE this tournament? This action is permanent and will remove all players and brackets.",
      async () => {
        try {
          await api.delete(`/tournaments/${id}`);
          setSelectedTournament(null);
          fetchTournaments();
          showAlert('success', 'Deleted', 'Tournament has been deleted successfully.');
        } catch (error) {
          showAlert('error', 'Error', 'Failed to delete tournament.');
        }
      },
      'Delete'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
          <Trophy className="text-accent" size={32} />
          TOURNAMENT ARENA
        </h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} /> Create Tournament
        </button>
      </div>

      {selectedTournament ? (
        <TournamentDetails 
          tournament={selectedTournament} 
          onBack={() => {
            setSelectedTournament(null);
            fetchTournaments(); // Refresh list after managing
          }} 
          onRefresh={() => {
            api.get(`/tournaments?poolHallId=${hallId}`).then(res => {
              setTournaments(res.data);
              setSelectedTournament(res.data.find((t: any) => t.id === selectedTournament.id));
            });
          }}
          onEdit={() => {
            setFormData({
              name: selectedTournament.name,
              size: selectedTournament.size,
              entryFee: selectedTournament.entryFee,
            });
            setShowEditModal(true);
          }}
          onDelete={() => handleDelete(selectedTournament.id)}
          showAlert={showAlert}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} onSelect={() => setSelectedTournament(t)} />
          ))}
          {tournaments.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              No tournaments found. Create one!
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight">CREATE TOURNAMENT</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tournament Name</label>
                <input
                  type="text"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Players Size</label>
                <select
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: Number(e.target.value)})}
                >
                  <option value={8}>8 Players</option>
                  <option value={16}>16 Players</option>
                  <option value={32}>32 Players</option>
                  <option value={64}>64 Players</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Entry Fee</label>
                <input
                  type="number"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({...formData, entryFee: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">CREATE</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight">EDIT TOURNAMENT</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tournament Name</label>
                <input
                  type="text"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Players Size</label>
                <select
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: Number(e.target.value)})}
                >
                  <option value={8}>8 Players</option>
                  <option value={16}>16 Players</option>
                  <option value={32}>32 Players</option>
                  <option value={64}>64 Players</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Entry Fee</label>
                <input
                  type="number"
                  className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({...formData, entryFee: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => { setShowEditModal(false); setFormData({ name: '', size: 16, entryFee: 0 }); }} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">SAVE CHANGES</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        onConfirm={alertConfig.onConfirm}
        confirmText={alertConfig.confirmText}
      />
    </div>
  );
};

const TournamentCard = ({ tournament, onSelect }: any) => {
  const approvedCount = tournament.players ? tournament.players.filter((p: any) => p.status === 'approved').length : 0;
  
  return (
    <div className="bg-secondary rounded-[2.5rem] p-8 border border-gray-800 hover:border-accent/40 transition-all group relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy size={120} />
      </div>

      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 self-start ${
        tournament.status === 'ongoing' ? 'bg-success/10 text-success border border-success/20' : 
        tournament.status === 'upcoming' ? 'bg-accent/10 text-accent border border-accent/20' : 
        'bg-gray-800 text-gray-400'
      }`}>
        {tournament.status}
      </div>

      <h3 className="text-2xl font-black italic text-white mb-2">{tournament.name}</h3>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
          <Users size={16} /> {approvedCount}/{tournament.size} Players
        </div>
        <div className="flex items-center gap-2 text-accent text-sm font-bold">
          <Star size={16} /> Fee: ${tournament.entryFee}
        </div>
        <div className="flex items-center gap-2 text-warning text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          {tournament.size - approvedCount} Empty Places Left
        </div>
      </div>

      <button 
        onClick={onSelect}
        className="w-full flex items-center justify-center gap-2 bg-primary border border-gray-800 py-4 rounded-2xl font-black uppercase tracking-tighter group-hover:bg-accent group-hover:text-primary transition-all mt-auto"
      >
        Manage Tournament
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const TournamentDetails = ({ tournament, onBack, onRefresh, onEdit, onDelete, showAlert }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleStatusChange = async (playerId: string, status: string) => {
    try {
      await api.put(`/tournaments/${tournament.id}/players/${playerId}/status`, { status });
      onRefresh();
    } catch (err) {
      showAlert('error', 'Error', 'Failed to update player status.');
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

  const manualAddPlayer = async (userId: string) => {
    try {
      await api.post(`/tournaments/${tournament.id}/players`, { playerId: userId });
      setSearchQuery('');
      setSearchResults([]);
      onRefresh();
      showAlert('success', 'Player Added', 'Player has been added to the tournament.');
    } catch (err) {
      showAlert('error', 'Error', 'Failed to add player.');
    }
  };

  const pendingPlayers = tournament.players?.filter((p: any) => p.status === 'pending') || [];
  const approvedPlayers = tournament.players?.filter((p: any) => p.status === 'approved') || [];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
        <ChevronRight className="rotate-180" size={16} /> Back to Arena
      </button>

      <div className="bg-secondary rounded-[3rem] p-12 border border-gray-800 relative overflow-hidden">
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <button 
              onClick={onEdit} 
              className="p-3 bg-primary border border-gray-800 rounded-xl hover:border-accent text-gray-400 hover:text-accent transition-all"
              title="Edit Tournament"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-3 bg-primary border border-gray-800 rounded-xl hover:border-danger text-gray-400 hover:text-danger transition-all"
              title="Delete Tournament"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter uppercase pr-24">{tournament.name}</h3>
          <p className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
            {approvedPlayers.length} / {tournament.size} Players Registered ({tournament.size - approvedPlayers.length} Empty Slots Remaining)
          </p>
        </div>

        <div className="mb-12 border-b border-gray-800 pb-8">
          <h4 className="text-xl font-black italic text-accent uppercase tracking-tight mb-6">Tournament Bracket (FIFA Style)</h4>
          <TournamentBracket size={tournament.size} players={approvedPlayers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pending Requests */}
          <div className="space-y-6">
            <h4 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-2">
              <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm">{pendingPlayers.length}</span>
              Pending Requests
            </h4>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {pendingPlayers.map((entry: any) => (
                <div key={entry.id} className="bg-primary p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{entry.player?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{entry.player?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusChange(entry.playerId, 'approved')} className="p-2 bg-success/10 text-success rounded-xl hover:bg-success hover:text-white transition-colors">
                      <Check size={18} />
                    </button>
                    <button onClick={() => handleStatusChange(entry.playerId, 'rejected')} className="p-2 bg-danger/10 text-danger rounded-xl hover:bg-danger hover:text-white transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {pendingPlayers.length === 0 && <p className="text-gray-500 italic">No pending requests.</p>}
            </div>
          </div>

          {/* Approved & Add Manual */}
          <div className="space-y-6">
            <h4 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-2">
              <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm">{approvedPlayers.length}</span>
              Approved Players & Slots
            </h4>

            {/* Manual Add */}
            <div className="bg-primary/50 p-6 rounded-[2rem] border border-gray-800 space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Manually Add Player</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                  value={searchQuery}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                />
              </div>
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {searchResults.map(user => (
                    <button key={user.id} onClick={() => manualAddPlayer(user.id)} className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors text-left">
                      <span className="text-sm font-bold text-white">{user.name}</span>
                      <Plus size={14} className="text-accent" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4">
              {approvedPlayers.map((entry: any) => (
                <div key={entry.id} className="bg-primary p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{entry.player?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{entry.player?.email}</p>
                  </div>
                  <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-md font-bold">APPROVED</span>
                </div>
              ))}
              {Array.from({ length: Math.max(0, tournament.size - approvedPlayers.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-primary/20 p-4 rounded-2xl border border-dashed border-gray-800 flex justify-between items-center opacity-60">
                  <div>
                    <p className="font-bold text-gray-500">Empty Slot #{approvedPlayers.length + index + 1}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 border border-gray-800 px-2 py-1 rounded-md font-bold uppercase">AVAILABLE</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;
