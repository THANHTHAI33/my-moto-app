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
// --- HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS ---
const GOOGLE_SHEET_API_URL = "https://docs.google.com/spreadsheets/d/1yff0ze6QS-58A5pHouJCtU2Uu9wl8hcuLHBwBnXde_0/edit?gid=0#gid=0"; 
const ACTIVITY_TYPES = {
  fuel: { label: 'Đổ xăng', icon: IconFuel, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  maintenance: { label: 'Bảo dưỡng', icon: IconSettings, color: 'text-green-500', bgColor: 'bg-green-100' },
  repair: { label: 'Sửa chữa', icon: IconWrench, color: 'text-red-500', bgColor: 'bg-red-100' },
};

const FUEL_TYPES = ["RON 95-V", "RON 95-III", "E5 RON 92", "Dầu Diesel"];

// Định dạng số có dấu chấm hàng ngàn
const formatNum = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = val.toString().replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Chuyển chuỗi định dạng về số nguyên
const parseNum = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return Number(str.toString().replace(/\./g, ""));
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Lưu trữ thông tin xe
  const [vehicle, setVehicle] = useState(() => {
    const saved = localStorage.getItem('moto_v3_vehicle');
    return saved ? JSON.parse(saved) : {
      name: "Xe của tôi",
      img: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800",
      oilInterval: 2000, // Định kỳ thay nhớt mặc định
      lastOilOdo: 0      // Lần thay nhớt cuối cùng tại số KM này
    };
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('moto_v3_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Tự động lưu vào LocalStorage
  useEffect(() => {
    localStorage.setItem('moto_v3_vehicle', JSON.stringify(vehicle));
    localStorage.setItem('moto_v3_records', JSON.stringify(records));
  }, [vehicle, records]);

  // Tính toán thống kê
  const stats = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    // Tổng tiền tháng hiện tại
    const monthTotal = records
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === curMonth && d.getFullYear() === curYear;
      })
      .reduce((s, r) => s + (Number(r.cost) || 0), 0);

    // Tổng tiền năm hiện tại
    const yearTotal = records
      .filter(r => new Date(r.date).getFullYear() === curYear)
      .reduce((s, r) => s + (Number(r.cost) || 0), 0);

    // Số ODO mới nhất
    const latestOdo = records.length > 0 ? Math.max(...records.map(r => Number(r.odo) || 0)) : 0;
    
    // Tính toán thay nhớt
    const nextOilChange = (Number(vehicle.lastOilOdo) || 0) + (Number(vehicle.oilInterval) || 0);
    const kmLeft = nextOilChange - latestOdo;

    return { monthTotal, yearTotal, latestOdo, nextOilChange, kmLeft };
  }, [records, vehicle]);

  const [formData, setFormData] = useState({
    type: 'fuel',
    fuelType: 'RON 95-V',
    date: new Date().toISOString().split('T')[0],
    odo: '',
    cost: '',
    note: ''
  });

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicle({ ...vehicle, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const odoNum = parseNum(formData.odo);
    const costNum = parseNum(formData.cost);
    
    if (!odoNum || !costNum) return;

    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      odo: odoNum,
      cost: costNum
    };

    // Nếu ghi chú có chữ "nhớt" hoặc chọn bảo dưỡng, cập nhật mốc nhớt
    const lowerNote = formData.note.toLowerCase();
    if (formData.type === 'maintenance' && (lowerNote.includes('nhớt') || lowerNote.includes('oil'))) {
       setVehicle(prev => ({...prev, lastOilOdo: odoNum}));
    }

    setRecords([newRecord, ...records]);
    setFormData({ ...formData, odo: '', cost: '', note: '' });
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-sans antialiased">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <IconFuel />
          </div>
          <h1 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">MotoLog</h1>
        </div>
        <button onClick={() => setActiveTab('settings')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <IconSettings />
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Thẻ hiển thị xe và ảnh */}
            <div className="relative h-52 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src={vehicle.img} className="w-full h-full object-cover" alt="Xe" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6 flex flex-col justify-end">
                <div className="flex justify-between items-end text-white">
                  <div>
                    <h2 className="text-2xl font-black">{vehicle.name}</h2>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{formatNum(stats.latestOdo)} KM ĐÃ ĐI</p>
                  </div>
                  <button onClick={() => fileInputRef.current.click()} className="bg-white/20 backdrop-blur-md p-3 rounded-2xl hover:bg-white/40 transition-all">
                    <IconCamera />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            {/* Cảnh báo thay nhớt */}
            <div className={`p-4 rounded-3xl border flex items-center gap-4 ${stats.kmLeft < 200 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className={`p-3 rounded-2xl ${stats.kmLeft < 200 ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-lg`}>
                <IconBell />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bảo trì định kỳ</p>
                <p className={`font-black text-sm ${stats.kmLeft < 200 ? 'text-red-600' : 'text-blue-600'}`}>
                  {stats.kmLeft <= 0 ? 'Đã quá hạn thay nhớt!' : `Thay nhớt sau ${formatNum(stats.kmLeft)} km nữa`}
                </p>
                <p className="text-[10px] font-bold text-slate-400 italic">Mốc dự kiến: {formatNum(stats.nextOilChange)} km</p>
              </div>
            </div>

            {/* Thống kê chi phí */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-[2rem] text-white shadow-xl">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tháng {new Date().getMonth() + 1}</p>
                <p className="text-xl font-black">{formatNum(stats.monthTotal)} <span className="text-[10px]">đ</span></p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm text-slate-900">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Năm {new Date().getFullYear()}</p>
                <p className="text-xl font-black">{formatNum(stats.yearTotal)} <span className="text-[10px]">đ</span></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5 animate-in slide-in-from-bottom">
            <h2 className="text-center font-black uppercase text-slate-800 tracking-tighter italic text-xl">Thêm ghi chép mới</h2>
            
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ACTIVITY_TYPES).map(([key, info]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({...formData, type: key})}
                  className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
                    formData.type === key ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400'
                  }`}
                >
                  <info.icon />
                  <span className="text-[10px] mt-2 font-black uppercase">{info.label}</span>
                </button>
              ))}
            </div>

            {formData.type === 'fuel' && (
              <div className="grid grid-cols-2 gap-2">
                {FUEL_TYPES.map(f => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFormData({...formData, fuelType: f})}
                    className={`p-3 rounded-2xl border font-bold text-[11px] ${
                      formData.fuelType === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Số ODO hiện tại</label>
                <input 
                  type="text" 
                  value={formData.odo} 
                  onChange={e => setFormData({...formData, odo: formatNum(e.target.value)})}
                  placeholder="0" 
                  className="w-full bg-slate-50 p-5 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-blue-600 transition-all text-blue-600"
                />
                <span className="absolute right-6 bottom-5 text-xs font-black text-slate-300">KM</span>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Chi phí</label>
                <input 
                  type="text" 
                  value={formData.cost} 
                  onChange={e => setFormData({...formData, cost: formatNum(e.target.value)})}
                  placeholder="0" 
                  className="w-full bg-slate-50 p-5 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-blue-600 transition-all text-emerald-600"
                />
                <span className="absolute right-6 bottom-5 text-xs font-black text-slate-300">VNĐ</span>
              </div>

              <div className="flex gap-2">
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border border-slate-100 outline-none text-sm" />
                <input type="text" placeholder="Ghi chú..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="flex-[2] bg-slate-50 p-4 rounded-2xl font-bold border border-slate-100 outline-none text-sm" />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl uppercase tracking-widest text-sm">Lưu hoạt động</button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Lịch sử hoạt động</h3>
              <span className="text-[10px] font-bold text-blue-500 uppercase">Sắp xếp: Mới nhất</span>
            </div>
            {records.length === 0 ? (
              <p className="text-center py-20 text-slate-300 font-black italic uppercase text-xs">Chưa có dữ liệu</p>
            ) : (
              records.map(r => {
                // Sửa lỗi render icon từ object bằng cách gán vào biến chữ hoa
                const Icon = ACTIVITY_TYPES[r.type].icon;
                return (
                  <div key={r.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className={`p-3 rounded-2xl ${ACTIVITY_TYPES[r.type].bgColor} ${ACTIVITY_TYPES[r.type].color}`}>
                      <Icon />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-black text-slate-800 text-sm block">
                            {ACTIVITY_TYPES[r.type].label}
                            {r.type === 'fuel' && <span className="ml-1 text-[10px] text-blue-500">({r.fuelType})</span>}
                          </span>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{r.date} • {formatNum(r.odo)} KM</p>
                        </div>
                        <span className="font-black text-slate-900">{formatNum(r.cost)} đ</span>
                      </div>
                      {r.note && <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg italic">"{r.note}"</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-slate-800 text-center uppercase italic">Cài đặt xe</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Tên hiển thị</label>
                <input type="text" value={vehicle.name} onChange={e => setVehicle({...vehicle, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-blue-500" />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Định kỳ thay nhớt (KM)</label>
                <input 
                  type="text" 
                  value={formatNum(vehicle.oilInterval)} 
                  onChange={e => setVehicle({...vehicle, oilInterval: parseNum(e.target.value)})}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-black text-xl text-blue-600 outline-none" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-1 block">Mốc ODO thay nhớt gần nhất</label>
                <input 
                  type="text" 
                  value={formatNum(vehicle.lastOilOdo)} 
                  onChange={e => setVehicle({...vehicle, lastOilOdo: parseNum(e.target.value)})}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-black text-xl text-emerald-600 outline-none" 
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => {
                    if(confirm("Bạn có chắc muốn xóa tất cả dữ liệu?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest"
                >
                  Xóa tất cả dữ liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-white shadow-2xl p-3 rounded-[2.5rem] z-50">
        <div className="flex justify-around items-center">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}><IconDashboard /></button>
          <button onClick={() => setActiveTab('add')} className={`p-5 rounded-full -mt-16 border-8 border-slate-50 shadow-2xl transition-all ${activeTab === 'add' ? 'bg-slate-900 rotate-45' : 'bg-blue-600 shadow-blue-300'} text-white`}><IconPlus /></button>
          <button onClick={() => setActiveTab('history')} className={`p-3 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}><IconHistory /></button>
        </div>
      </nav>
    </div>
  );
}
