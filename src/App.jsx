import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- BIỂU TƯỢNG SVG ---
const IconFuel = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/><circle cx="9" cy="9" r="2"/></svg>;
const IconWrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IconHistory = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const IconBell = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconCloud = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15.5 1.5A7 7 0 1 0 5 20h11.5"/></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const ACTIVITY_TYPES = {
  fuel: { label: 'Đổ xăng', icon: IconFuel, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  maintenance: { label: 'Bảo dưỡng', icon: IconSettings, color: 'text-green-500', bgColor: 'bg-green-100' },
  repair: { label: 'Sửa chữa', icon: IconWrench, color: 'text-red-500', bgColor: 'bg-red-100' },
};

const FUEL_TYPES = ["RON 95-V", "RON 95-III", "E5 RON 92", "Dầu Diesel"];

const formatNum = (val) => {
  if (val === null || val === undefined || val === "") return "0";
  const num = val.toString().replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNum = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return Number(str.toString().replace(/\./g, ""));
};

const DEFAULT_VEHICLE = {
  id: 'v1',
  name: "Xe của tôi",
  img: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800",
  oilInterval: 2000,
  lastOilOdo: 0
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const fileInputRef = useRef(null);

  // Dữ liệu xe
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('moto_v4_vehicles');
    return saved ? JSON.parse(saved) : [DEFAULT_VEHICLE];
  });

  const [currentVehicleId, setCurrentVehicleId] = useState(() => {
    const saved = localStorage.getItem('moto_v4_current_vid');
    return saved || 'v1';
  });

  const activeVehicle = useMemo(() => 
    vehicles.find(v => v.id === currentVehicleId) || vehicles[0], 
    [vehicles, currentVehicleId]
  );

  // Cấu hình đồng bộ
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('moto_v4_settings');
    return saved ? JSON.parse(saved) : { sheetUrl: "", isCloudSyncEnabled: false };
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('moto_v4_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('moto_v4_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('moto_v4_records', JSON.stringify(records));
    localStorage.setItem('moto_v4_settings', JSON.stringify(settings));
    localStorage.setItem('moto_v4_current_vid', currentVehicleId);
  }, [vehicles, records, settings, currentVehicleId]);

  const stats = useMemo(() => {
    const vehicleRecords = records.filter(r => r.vehicleId === activeVehicle.id);
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const monthTotal = vehicleRecords
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === curMonth && d.getFullYear() === curYear;
      })
      .reduce((s, r) => s + (Number(r.cost) || 0), 0);

    const yearTotal = vehicleRecords
      .filter(r => new Date(r.date).getFullYear() === curYear)
      .reduce((s, r) => s + (Number(r.cost) || 0), 0);

    const latestOdo = vehicleRecords.length > 0 ? Math.max(...vehicleRecords.map(r => Number(r.odo) || 0)) : 0;
    const nextOilChange = (Number(activeVehicle.lastOilOdo) || 0) + (Number(activeVehicle.oilInterval) || 0);
    
    const groupedByMonth = vehicleRecords.reduce((acc, r) => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = { key, total: 0, items: [] };
      acc[key].total += Number(r.cost) || 0;
      acc[key].items.push(r);
      return acc;
    }, {});

    const sortedMonths = Object.values(groupedByMonth).sort((a, b) => b.key.localeCompare(a.key));

    return { monthTotal, yearTotal, latestOdo, nextOilChange, kmLeft: nextOilChange - latestOdo, sortedMonths };
  }, [records, activeVehicle]);

  const [formData, setFormData] = useState({
    type: 'fuel',
    fuelType: 'RON 95-V',
    date: new Date().toISOString().split('T')[0],
    odo: '',
    cost: '',
    note: ''
  });

  // Hàm gửi dữ liệu lên Google Sheets
  const syncToCloud = async (data) => {
    if (!settings.sheetUrl || !settings.isCloudSyncEnabled) return;
    setIsSyncing(true);
    try {
      const payload = { ...data, vehicleName: activeVehicle.name };
      await fetch(settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) { console.error("Lỗi đồng bộ:", err); } 
    finally { setIsSyncing(false); }
  };

  const handleAddNewVehicle = () => {
    const name = prompt("Nhập tên xe mới:");
    if (!name) return;
    const newId = Date.now().toString();
    setVehicles([...vehicles, { ...DEFAULT_VEHICLE, id: newId, name: name, lastOilOdo: 0 }]);
    setCurrentVehicleId(newId);
    setShowVehiclePicker(false);
  };

  const updateActiveVehicle = (updates) => {
    setVehicles(vehicles.map(v => v.id === activeVehicle.id ? { ...v, ...updates } : v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const odoNum = parseNum(formData.odo);
    const costNum = parseNum(formData.cost);
    if (!odoNum || !costNum) return;

    const newRecord = {
      id: Date.now().toString(),
      vehicleId: activeVehicle.id,
      ...formData,
      odo: odoNum,
      cost: costNum
    };

    const lowerNote = formData.note.toLowerCase();
    if (formData.type === 'maintenance' && (lowerNote.includes('nhớt') || lowerNote.includes('oil'))) {
       updateActiveVehicle({ lastOilOdo: odoNum });
    }

    setRecords([newRecord, ...records]);
    setFormData({ ...formData, odo: '', cost: '', note: '' });
    
    // Gọi hàm đồng bộ sau khi lưu vào máy
    await syncToCloud(newRecord);
    
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-sans antialiased">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowVehiclePicker(!showVehiclePicker)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all">
              <span className="text-xs font-black text-slate-700 uppercase">{activeVehicle.name}</span>
              <IconChevronDown />
            </button>
            {showVehiclePicker && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <div className="p-2 space-y-1">
                  {vehicles.map(v => (
                    <button key={v.id} onClick={() => { setCurrentVehicleId(v.id); setShowVehiclePicker(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${v.id === activeVehicle.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>
                      {v.name}
                    </button>
                  ))}
                  <button onClick={handleAddNewVehicle} className="w-full mt-2 border-2 border-dashed border-slate-200 p-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">+ Thêm xe mới</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSyncing && <div className="animate-spin text-blue-500"><IconCloud /></div>}
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`p-2 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <IconSettings />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="relative h-52 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src={activeVehicle.img} className="w-full h-full object-cover" alt="Xe" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                <div className="flex justify-between items-end text-white">
                  <div>
                    <h2 className="text-2xl font-black">{activeVehicle.name}</h2>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{formatNum(stats.latestOdo)} KM ĐÃ ĐI</p>
                  </div>
                  <button onClick={() => fileInputRef.current.click()} className="bg-white/20 backdrop-blur-md p-3 rounded-2xl hover:bg-white/40"><IconCamera /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const reader = new FileReader();
                    reader.onloadend = () => updateActiveVehicle({ img: reader.result });
                    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
                  }} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-3xl border flex items-center gap-4 ${stats.kmLeft < 200 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className={`p-3 rounded-2xl ${stats.kmLeft < 200 ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-lg`}><IconBell /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bảo trì</p>
                <p className={`font-black text-sm ${stats.kmLeft < 200 ? 'text-red-600' : 'text-blue-600'}`}>
                  {stats.kmLeft <= 0 ? 'Đã quá hạn thay nhớt!' : `Thay nhớt sau ${formatNum(stats.kmLeft)} km`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-[2rem] text-white">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Tháng hiện tại</p>
                <p className="text-xl font-black">{formatNum(stats.monthTotal)} <span className="text-[10px]">đ</span></p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Năm {new Date().getFullYear()}</p>
                <p className="text-xl font-black">{formatNum(stats.yearTotal)} <span className="text-[10px]">đ</span></p>
              </div>
            </div>
          </div>
        )}

        {/* TAB ADD RECORD */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-center font-black uppercase text-slate-800 tracking-tighter italic text-xl">Thêm ghi chép</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ACTIVITY_TYPES).map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <button type="button" key={key} onClick={() => setFormData({...formData, type: key})} className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${formData.type === key ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                    <Icon /><span className="text-[10px] mt-2 font-black uppercase">{info.label}</span>
                  </button>
                );
              })}
            </div>
            {formData.type === 'fuel' && (
              <div className="grid grid-cols-2 gap-2">
                {FUEL_TYPES.map(f => (
                  <button type="button" key={f} onClick={() => setFormData({...formData, fuelType: f})} className={`p-3 rounded-2xl border font-bold text-[11px] ${formData.fuelType === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{f}</button>
                ))}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">ODO hiện tại</label>
                <input type="text" value={formData.odo} onChange={e => setFormData({...formData, odo: formatNum(e.target.value)})} placeholder="0" className="w-full bg-slate-50 p-5 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-blue-600 transition-all text-blue-600" />
                <span className="absolute right-6 bottom-5 text-xs font-black text-slate-300">KM</span>
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Chi phí</label>
                <input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: formatNum(e.target.value)})} placeholder="0" className="w-full bg-slate-50 p-5 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-blue-600 transition-all text-emerald-600" />
                <span className="absolute right-6 bottom-5 text-xs font-black text-slate-300">VNĐ</span>
              </div>
              <div className="flex gap-2">
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border border-slate-100 text-sm" />
                <input type="text" placeholder="Ghi chú..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="flex-[2] bg-slate-50 p-4 rounded-2xl font-bold border border-slate-100 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl uppercase tracking-widest text-sm">Lưu hoạt động</button>
          </form>
        )}

        {/* TAB HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
             <h3 className="px-2 font-black text-slate-400 text-[10px] uppercase tracking-widest">Báo cáo theo tháng</h3>
             {stats.sortedMonths.map(group => (
              <div key={group.key} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <button onClick={() => setExpandedMonth(expandedMonth === group.key ? null : group.key)} className="w-full flex justify-between items-center p-6 text-left">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase">Tháng {group.key.split('-')[1]} - {group.key.split('-')[0]}</p>
                    <p className="text-lg font-black">{formatNum(group.total)} đ</p>
                  </div>
                  <IconChevronRight />
                </button>
                {expandedMonth === group.key && (
                  <div className="px-6 pb-6 space-y-4">
                    {group.items.map(r => {
                      const Icon = ACTIVITY_TYPES[r.type].icon;
                      return (
                        <div key={r.id} className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${ACTIVITY_TYPES[r.type].bgColor} ${ACTIVITY_TYPES[r.type].color}`}><Icon /></div>
                          <div className="flex-1">
                            <div className="flex justify-between font-black text-xs"><span>{ACTIVITY_TYPES[r.type].label}</span><span>{formatNum(r.cost)} đ</span></div>
                            <p className="text-[10px] text-slate-400">{r.date} - {formatNum(r.odo)} KM</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
             ))}
          </div>
        )}

        {/* TAB SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
              <h2 className="text-sm font-black text-slate-800 uppercase italic">Thông số xe</h2>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Tên xe</label>
                <input type="text" value={activeVehicle.name} onChange={e => updateActiveVehicle({ name: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Thay nhớt mỗi (KM)</label>
                  <input type="text" value={formatNum(activeVehicle.oilInterval)} onChange={e => updateActiveVehicle({ oilInterval: parseNum(e.target.value) })} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-blue-600" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Lần cuối tại (KM)</label>
                  <input type="text" value={formatNum(activeVehicle.lastOilOdo)} onChange={e => updateActiveVehicle({ lastOilOdo: parseNum(e.target.value) })} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-white">
                <IconCloud />
                <h2 className="text-sm font-black uppercase italic tracking-wider">Đồng bộ Google Sheets</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">App Script URL</label>
                  <input 
                    type="text" 
                    placeholder="Dán link script tại đây..." 
                    value={settings.sheetUrl} 
                    onChange={e => setSettings({...settings, sheetUrl: e.target.value})} 
                    className="w-full bg-white/10 p-4 rounded-2xl font-medium text-white text-xs outline-none border border-white/10 focus:border-blue-500 transition-all"
                  />
                  <p className="text-[9px] text-slate-500 mt-2 ml-4">Link nhận được sau khi nhấn 'Deploy' trên Google Apps Script.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase">Trạng thái đồng bộ</p>
                    <p className={`text-[11px] font-bold ${settings.isCloudSyncEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
                      {settings.isCloudSyncEnabled ? 'Đang kích hoạt' : 'Đang tắt'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, isCloudSyncEnabled: !settings.isCloudSyncEnabled})} 
                    className={`w-14 h-7 rounded-full transition-all relative ${settings.isCloudSyncEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-lg ${settings.isCloudSyncEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {settings.sheetUrl && settings.isCloudSyncEnabled && (
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-[10px] text-blue-400 text-center font-bold italic">
                    Dữ liệu sẽ được tự động gửi lên Sheet sau mỗi lần bạn nhấn "Lưu hoạt động".
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => { if(confirm("Xóa toàn bộ dữ liệu trên máy?")) setRecords([]); }} 
              className="w-full py-4 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
            >
              Xóa lịch sử ứng dụng
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-white shadow-2xl p-3 rounded-[2.5rem] z-50">
        <div className="flex justify-around items-center">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-400'}`}><IconDashboard /></button>
          <button onClick={() => setActiveTab('add')} className={`p-5 rounded-full -mt-16 border-8 border-slate-50 shadow-2xl transition-all ${activeTab === 'add' ? 'bg-slate-900 rotate-45' : 'bg-blue-600 shadow-blue-300'} text-white`}><IconPlus /></button>
          <button onClick={() => setActiveTab('history')} className={`p-3 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-400'}`}><IconHistory /></button>
        </div>
      </nav>
    </div>
  );
}
