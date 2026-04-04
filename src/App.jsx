import React, { useState, useEffect, useMemo, useRef} from 'react';

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
const GOOGLE_SHEET_API_URL = "https://docs.google.com/spreadsheets/d/1yff0ze6QS-58A5pHouJCtU2Uu9wl8hcuLHBwBnXde_0/edit?gid=0#gid=0"; 
const formatNum = (val) => {
  if (!val && val !== 0) return "";
  const num = val.toString().replace(/\D/g, ""); // Chỉ giữ lại số
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm
};

const parseNum = (str) => {
  if (!str) return 0;
  return Number(str.toString().replace(/\./g, ""));
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // HIGHLIGHT: Lưu trữ thông tin xe và ảnh (Có thể thay đổi ảnh từ máy/điện thoại)
  const [vehicle, setVehicle] = useState(() => {
    const saved = localStorage.getItem('moto_pro_vehicle');
    return saved ? JSON.parse(saved) : {
      name: "Xe của tôi",
      img: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800",
      oilInterval: 2000, // Định kỳ thay nhớt (mặc định 2k)
      lastOilOdo: 0      // ODO lần thay nhớt cuối
    };
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('moto_pro_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('moto_pro_vehicle', JSON.stringify(vehicle));
    localStorage.setItem('moto_pro_records', JSON.stringify(records));
  }, [vehicle, records]);

  // HIGHLIGHT: Tính toán tổng chi phí theo tháng/năm và cảnh báo thay nhớt
  const stats = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const mTotal = records
      .filter(r => { const d = new Date(r.date); return d.getMonth() === curMonth && d.getFullYear() === curYear; })
      .reduce((s, r) => s + r.cost, 0);

    const yTotal = records
      .filter(r => new Date(r.date).getFullYear() === curYear)
      .reduce((s, r) => s + r.cost, 0);

    const latestOdo = records.length > 0 ? Math.max(...records.map(r => r.odo)) : 0;
    
    // Mốc thay nhớt tiếp theo = ODO cuối + Định kỳ
    const nextOil = vehicle.lastOilOdo + vehicle.oilInterval;
    const kmLeft = nextOil - latestOdo;

    return { mTotal, yTotal, latestOdo, nextOil, kmLeft };
  }, [records, vehicle]);

  const [formData, setFormData] = useState({
    type: 'fuel', fuelType: 'RON 95-V', date: new Date().toISOString().split('T')[0],
    odo: '', cost: '', note: ''
  });

  // HIGHLIGHT: Xử lý chọn ảnh từ thiết bị
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVehicle({ ...vehicle, img: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const odoNum = parseNum(formData.odo);
    const costNum = parseNum(formData.cost);
    if (!odoNum || !costNum) return;

    const newRecord = { id: Date.now().toString(), ...formData, odo: odoNum, cost: costNum };
    setRecords([newRecord, ...records]);
    setFormData({ ...formData, odo: '', cost: '', note: '' });
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <header className="bg-white sticky top-0 z-40 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-blue-600 uppercase italic">MotoLog PRO</h1>
        <button onClick={() => setActiveTab('settings')} className="text-slate-400"><IconSettings /></button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* HIGHLIGHT: Hiển thị ảnh xe và nút thay đổi ảnh */}
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={vehicle.img} className="w-full h-full object-cover" alt="Bike" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <h2 className="text-xl font-black text-white">{vehicle.name}</h2>
                  <button onClick={() => fileInputRef.current.click()} className="bg-white/20 p-2 rounded-xl text-white"><IconCamera /></button>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* HIGHLIGHT: Cảnh báo thay nhớt dựa trên ODO */}
            <div className={`p-4 rounded-3xl border flex items-center gap-3 ${stats.kmLeft < 200 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <div className="font-black text-xs uppercase">
                {stats.kmLeft <= 0 ? "CẦN THAY NHỚT NGAY!" : `Còn ${formatNum(stats.kmLeft)} km đến kỳ thay nhớt`}
                <p className="text-[10px] opacity-60">Mốc dự kiến: {formatNum(stats.nextOil)} km</p>
              </div>
            </div>

            {/* HIGHLIGHT: Tổng kết tháng và năm */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 p-5 rounded-3xl text-white">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tháng {new Date().getMonth() + 1}</p>
                <p className="text-xl font-black">{formatNum(stats.mTotal)} đ</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Năm {new Date().getFullYear()}</p>
                <p className="text-xl font-black">{formatNum(stats.yTotal)} đ</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 space-y-4">
            <h2 className="font-black text-center uppercase tracking-widest text-slate-800">Thêm bản ghi</h2>
            <div className="grid grid-cols-3 gap-2">
              {['fuel', 'maintenance', 'repair'].map(type => (
                <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`p-3 rounded-2xl border-2 text-[10px] font-black uppercase ${formData.type === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>
                  {type === 'fuel' ? 'Đổ xăng' : type === 'maintenance' ? 'Bảo dưỡng' : 'Sửa chữa'}
                </button>
              ))}
            </div>

            {/* HIGHLIGHT: Chọn loại xăng */}
            {formData.type === 'fuel' && (
              <div className="grid grid-cols-2 gap-2">
                {FUEL_TYPES.map(f => (
                  <button key={f} type="button" onClick={() => setFormData({...formData, fuelType: f})} className={`p-2 rounded-xl border text-[10px] font-bold ${formData.fuelType === f ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>{f}</button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <input type="text" placeholder="Số ODO (km)" value={formData.odo} onChange={e => setFormData({...formData, odo: formatNum(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-black outline-none border border-slate-100" />
              <input type="text" placeholder="Chi phí (đ)" value={formData.cost} onChange={e => setFormData({...formData, cost: formatNum(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-black outline-none border border-slate-100" />
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-bold" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest">Lưu lại</button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-black text-slate-800 text-sm uppercase">{r.type === 'fuel' ? `Xăng (${r.fuelType})` : 'Sửa/Bảo dưỡng'}</p>
                  <p className="text-[10px] font-bold text-slate-400">{r.date} • {formatNum(r.odo)} KM</p>
                </div>
                <p className="font-black text-blue-600">{formatNum(r.cost)} đ</p>
              </div>
            ))}
          </div>
        )}

        {/* HIGHLIGHT: Cài đặt mốc thay nhớt định kỳ */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
            <h2 className="font-black uppercase text-center">Cấu hình bảo trì</h2>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Định kỳ thay nhớt (KM)</label>
              <input type="text" value={formatNum(vehicle.oilInterval)} onChange={e => setVehicle({...vehicle, oilInterval: parseNum(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-black text-blue-600" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">ODO lần thay nhớt cuối</label>
              <input type="text" value={formatNum(vehicle.lastOilOdo)} onChange={e => setVehicle({...vehicle, lastOilOdo: parseNum(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-black text-emerald-600" />
            </div>
            <button onClick={() => setActiveTab('dashboard')} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase">Xong</button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around items-center shadow-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-300'}><IconDashboard /></button>
        <button onClick={() => setActiveTab('add')} className="bg-blue-600 p-4 rounded-full -mt-12 text-white shadow-lg"><IconPlus /></button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-blue-600' : 'text-slate-300'}><IconHistory /></button>
      </nav>
    </div>
  );
}
