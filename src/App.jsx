import React, { useState, useEffect, useMemo } from 'react';

// --- CÁC BIỂU TƯỢNG SVG (Tự định nghĩa để tránh lỗi thư viện) ---
const IconFuel = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/><circle cx="9" cy="9" r="2"/></svg>;
const IconWrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IconHistory = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>;
const IconBike = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>;
const IconDroplets = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6.3-4-6.3s-4 3-4 6.3c0 2.2 1.8 4 4 4z"/><path d="M17 18.5c1.7 0 3-1.3 3-3 0-2.5-3-4.8-3-4.8s-3 2.3-3 4.8c0 1.7 1.3 3 3 3z"/></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

// --- HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS ---
const GOOGLE_SHEET_API_URL = ""; 

const ACTIVITY_TYPES = {
  fuel: { label: 'Đổ xăng', icon: IconFuel, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  maintenance: { label: 'Bảo dưỡng', icon: IconSettings, color: 'text-green-500', bgColor: 'bg-green-100' },
  repair: { label: 'Sửa chữa', icon: IconWrench, color: 'text-red-500', bgColor: 'bg-red-100' },
};

const formatNum = (val) => {
  if (!val && val !== 0) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNum = (str) => {
  if (typeof str === 'number') return str;
  return Number(str.toString().replace(/\./g, ""));
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Quản lý xe
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('moto_vehicles');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'Xe của tôi', nextOilChange: 2000, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=800&q=80' }
    ];
  });
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('v1');
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('moto_records');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showOilSettings, setShowOilSettings] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [oilLimitInput, setOilLimitInput] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'fuel',
    date: new Date().toISOString().split('T')[0],
    odo: '',
    cost: '',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('moto_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('moto_records', JSON.stringify(records));
  }, [vehicles, records]);

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId), 
  [vehicles, selectedVehicleId]);

  const stats = useMemo(() => {
    const now = new Date();
    const filtered = records.filter(r => {
      const d = new Date(r.date);
      return (d.getMonth() === now.getMonth()) && (d.getFullYear() === now.getFullYear());
    });

    const totalCost = filtered.reduce((s, r) => s + (Number(r.cost) || 0), 0);
    const fuelCost = filtered.filter(r => r.type === 'fuel').reduce((s, r) => s + (Number(r.cost) || 0), 0);
    const mntCost = filtered.filter(r => r.type !== 'fuel').reduce((s, r) => s + (Number(r.cost) || 0), 0);
    const latestOdo = records.length > 0 ? Math.max(...records.map(r => Number(r.odo) || 0)) : 0;

    const oilLimit = selectedVehicle?.nextOilChange || 0;
    const kmLeft = oilLimit > 0 ? oilLimit - latestOdo : null;
    const isOilAlert = kmLeft !== null && kmLeft <= 200;

    return { totalCost, fuelCost, mntCost, latestOdo, kmLeft, isOilAlert, oilLimit };
  }, [records, selectedVehicle]);

  const handleAddVehicle = () => {
    if (!newVehicleName.trim()) return;
    const newV = {
      id: Date.now().toString(),
      name: newVehicleName,
      nextOilChange: 0,
      imageUrl: `https://loremflickr.com/800/600/motorcycle?lock=${Math.floor(Math.random() * 1000)}`
    };
    setVehicles([...vehicles, newV]);
    setSelectedVehicleId(newV.id);
    setNewVehicleName('');
    setShowAddVehicle(false);
  };

  const handleUpdateOilLimit = () => {
    const val = parseNum(oilLimitInput);
    setVehicles(vehicles.map(v => v.id === selectedVehicleId ? { ...v, nextOilChange: val } : v));
    setShowOilSettings(false);
    setOilLimitInput('');
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    if (!formData.odo || !formData.cost) return;

    const newRecord = {
      id: Date.now().toString(),
      vehicleId: selectedVehicleId,
      ...formData,
      odo: parseNum(formData.odo),
      cost: parseNum(formData.cost),
      createdAt: new Date().toISOString()
    };

    setRecords([newRecord, ...records]);

    if (GOOGLE_SHEET_API_URL) {
      try {
        await fetch(GOOGLE_SHEET_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newRecord, vehicleName: selectedVehicle?.name })
        });
      } catch (err) {
        console.error("Lỗi Google Sheets:", err);
      }
    }

    setFormData({ ...formData, odo: '', cost: '', note: '' });
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <IconBike />
            </div>
            <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">MotoLog</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${GOOGLE_SHEET_API_URL ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              {GOOGLE_SHEET_API_URL ? 'ĐÃ KẾT NỐI' : 'NGOẠI TUYẾN'}
            </span>
          </div>
        </div>

        {/* Danh sách xe ngang */}
        <div className="max-w-md mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicleId(v.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedVehicleId === v.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {v.name}
            </button>
          ))}
          <button onClick={() => setShowAddVehicle(true)} className="p-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7v14"/></svg>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="relative h-44 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={selectedVehicle?.imageUrl} alt="Xe" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                <h2 className="text-white text-2xl font-black">{selectedVehicle?.name}</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <IconMapPin /> {formatNum(stats.latestOdo)} KM
                  </span>
                </div>
              </div>
            </div>

            {stats.oilLimit > 0 && (
              <div className={`p-5 rounded-3xl border ${stats.isOilAlert ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={stats.isOilAlert ? 'text-red-500' : 'text-blue-500'}><IconDroplets /></div>
                    <span className="font-black text-xs uppercase tracking-tight text-slate-700">Tình trạng nhớt</span>
                  </div>
                  <button onClick={() => setShowOilSettings(true)} className="text-blue-600 font-bold text-[10px] uppercase">Cài đặt</button>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
                  <span>Mốc: {formatNum(stats.oilLimit)} km</span>
                  <span className={stats.isOilAlert ? 'text-red-600' : 'text-slate-800'}>
                    {stats.kmLeft > 0 ? `Còn ${formatNum(stats.kmLeft)} km` : `Quá hạn ${formatNum(Math.abs(stats.kmLeft))} km`}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${stats.isOilAlert ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (stats.latestOdo / stats.oilLimit) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100">
                <div className="text-blue-500 mb-2"><IconFuel /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tiền xăng tháng này</p>
                <p className="text-lg font-black text-slate-800">{formatNum(stats.fuelCost)} đ</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100">
                <div className="text-emerald-500 mb-2"><IconSettings /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Bảo dưỡng</p>
                <p className="text-lg font-black text-slate-800">{formatNum(stats.mntCost)} đ</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-lg">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng chi tiêu tháng này</p>
              <p className="text-3xl font-black">{formatNum(stats.totalCost)} đ</p>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleSubmitRecord} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ACTIVITY_TYPES).map(([key, info]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({...formData, type: key})}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                    formData.type === key ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400 bg-slate-50'
                  }`}
                >
                  <info.icon />
                  <span className="text-[10px] mt-1 font-black uppercase">{info.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Ngày</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-transparent font-bold outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">ODO (KM)</label>
                  <input type="text" placeholder="0" value={formData.odo} onChange={e => setFormData({...formData, odo: formatNum(parseNum(e.target.value))})} className="w-full bg-transparent font-black outline-none text-slate-800" />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Chi phí (VNĐ)</label>
                  <input type="text" placeholder="0" value={formData.cost} onChange={e => setFormData({...formData, cost: formatNum(parseNum(e.target.value))})} className="w-full bg-transparent font-black outline-none text-slate-800" />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Ghi chú</label>
                <textarea placeholder="..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-transparent h-16 outline-none resize-none text-sm font-medium" />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs active:scale-95 transition-all">
              Lưu dữ liệu
            </button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest px-1">Lịch sử hoạt động</h3>
            {records.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm italic">Chưa có dữ liệu nào được ghi lại.</div>
            ) : (
              records.map(r => {
                const info = ACTIVITY_TYPES[r.type];
                return (
                  <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className={`p-2 rounded-xl ${info.bgColor} ${info.color}`}><info.icon /></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-800 text-[10px] uppercase">{info.label}</span>
                        <span className="font-black text-slate-900 text-xs">{formatNum(r.cost)} đ</span>
                      </div>
                      <div className="flex gap-2 text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                        <span>{new Date(r.date).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span className="text-blue-500">{formatNum(r.odo)} KM</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Thanh điều hướng */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 z-40">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-300'}><IconDashboard /></button>
          <button onClick={() => setActiveTab('add')} className={`p-3 rounded-full -mt-12 shadow-xl transition-all ${activeTab === 'add' ? 'bg-slate-900 rotate-45' : 'bg-blue-600'}`}><IconPlus className="text-white" /></button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-blue-600' : 'text-slate-300'}><IconHistory /></button>
        </div>
      </nav>

      {/* Modal cài đặt mốc nhớt */}
      {showOilSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl">
            <h3 className="font-black text-slate-900 text-center mb-4 uppercase tracking-tight">Cài đặt mốc thay nhớt</h3>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
              <input 
                autoFocus
                type="text" 
                placeholder="VD: 2.000" 
                value={oilLimitInput}
                onChange={e => setOilLimitInput(formatNum(parseNum(e.target.value)))}
                className="w-full bg-transparent font-black outline-none text-center text-xl text-slate-800"
              />
              <label className="text-[9px] font-bold text-slate-400 block text-center mt-1 uppercase">Số KM trên đồng hồ</label>
            </div>
            <div className="space-y-2">
              <button onClick={handleUpdateOilLimit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest">Cập nhật</button>
              <button onClick={() => setShowOilSettings(false)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Bỏ qua</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm xe */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl">
            <h3 className="font-black text-slate-900 text-center mb-6 uppercase tracking-tight">Thêm phương tiện mới</h3>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
              <input 
                autoFocus
                type="text" 
                placeholder="Tên xe (VD: SH 150i)..." 
                value={newVehicleName}
                onChange={e => setNewVehicleName(e.target.value)}
                className="w-full bg-transparent font-black outline-none text-center text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <button onClick={handleAddVehicle} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest">Lưu xe</button>
              <button onClick={() => setShowAddVehicle(false)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
