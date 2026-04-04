import React, { useState, useEffect, useMemo } from 'react';
import { 
  Fuel, 
  Wrench, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Calendar, 
  MapPin, 
  Bike,
  BarChart3,
  Database,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Plus,
  Sparkles
} from 'lucide-react';

// --- HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS ---
// 1. Tạo Google Sheet, vào Tiện ích mở rộng -> Apps Script.
// 2. Dán mã xử lý (doPost) và Triển khai dưới dạng Ứng dụng Web (Mọi người đều có quyền truy cập).
// 3. Dán URL nhận được vào biến bên dưới:
const GOOGLE_SHEET_API_URL = ""; 

const ACTIVITY_TYPES = {
  fuel: { label: 'Đổ xăng', icon: Fuel, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  maintenance: { label: 'Bảo dưỡng', icon: Settings, color: 'text-green-500', bgColor: 'bg-green-100' },
  repair: { label: 'Sửa chữa', icon: Wrench, color: 'text-red-500', bgColor: 'bg-red-100' },
};

const FUEL_TYPES = ["RON 95-V", "RON 95-III", "E5 RON 92", "Khác"];

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
  
  // Quản lý danh sách xe
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('moto_vehicles');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'Xe của tôi', nextOilChange: 2000, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=800&q=80' }
    ];
  });
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('v1');
  
  // Quản lý nhật ký hoạt động
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('moto_records');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Các trạng thái UI
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showOilSettings, setShowOilSettings] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [oilLimitInput, setOilLimitInput] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'fuel',
    fuelType: 'RON 95-III',
    date: new Date().toISOString().split('T')[0],
    odo: '',
    cost: '',
    note: ''
  });

  // Tự động lưu vào bộ nhớ trình duyệt (Dự phòng)
  useEffect(() => {
    localStorage.setItem('moto_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('moto_records', JSON.stringify(records));
  }, [vehicles, records]);

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId), 
  [vehicles, selectedVehicleId]);

  // Tính toán thống kê
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

    // Gửi lên Google Sheets nếu đã cấu hình API
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Bike size={20} />
            </div>
            <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">MotoLog</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${GOOGLE_SHEET_API_URL ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              {GOOGLE_SHEET_API_URL ? 'CLOUD ON' : 'LOCAL ONLY'}
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
          <button onClick={() => setShowAddVehicle(true)} className="p-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100"><Plus size={16} /></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Ảnh xe & ODO */}
            <div className="relative h-44 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={selectedVehicle?.imageUrl} alt="Xe" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                <h2 className="text-white text-2xl font-black">{selectedVehicle?.name}</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={10} /> {formatNum(stats.latestOdo)} KM
                  </span>
                </div>
              </div>
            </div>

            {/* Cảnh báo nhớt */}
            {stats.oilLimit > 0 && (
              <div className={`p-5 rounded-3xl border ${stats.isOilAlert ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Droplets className={stats.isOilAlert ? 'text-red-500' : 'text-blue-500'} size={20} />
                    <span className="font-black text-xs uppercase tracking-tight text-slate-700">Tình trạng nhớt</span>
                  </div>
                  <button onClick={() => setShowOilSettings(true)} className="text-blue-600 font-bold text-[10px] uppercase">Sửa mốc</button>
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

            {/* Thẻ thống kê */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100">
                <Fuel className="text-blue-500 mb-2" size={20} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tiền xăng tháng này</p>
                <p className="text-lg font-black text-slate-800">{formatNum(stats.fuelCost)} đ</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100">
                <Settings className="text-emerald-500 mb-2" size={20} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Bảo dưỡng khác</p>
                <p className="text-lg font-black text-slate-800">{formatNum(stats.mntCost)} đ</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-lg">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng chi tiêu tháng này</p>
              <div className="flex justify-between items-end">
                <p className="text-3xl font-black">{formatNum(stats.totalCost)} đ</p>
                <BarChart3 size={24} className="text-blue-400 opacity-50" />
              </div>
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
                  <info.icon size={20} />
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

            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-100 uppercase tracking-widest text-xs active:scale-95 transition-all">
              Lưu hoạt động
            </button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest px-1">Lịch sử hoạt động</h3>
            {records.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">Chưa có dữ liệu.</div>
            ) : (
              records.map(r => {
                const info = ACTIVITY_TYPES[r.type];
                return (
                  <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className={`p-2 rounded-xl ${info.bgColor} ${info.color}`}><info.icon size={18} /></div>
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

      {/* Điều hướng dưới cùng */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 p-4 z-40">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-300'}><LayoutDashboard size={24} /></button>
          <button onClick={() => setActiveTab('add')} className={`p-4 rounded-full -mt-12 shadow-xl transition-all ${activeTab === 'add' ? 'bg-slate-900 rotate-45' : 'bg-blue-600'}`}><Plus size={28} className="text-white" /></button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-blue-600' : 'text-slate-300'}><History size={24} /></button>
        </div>
      </nav>

      {/* Modal cài đặt mốc nhớt */}
      {showOilSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-black text-slate-900 text-center mb-4 uppercase tracking-tight">Mốc thay nhớt kế tiếp</h3>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
              <input 
                autoFocus
                type="text" 
                placeholder="VD: 2.000" 
                value={oilLimitInput}
                onChange={e => setOilLimitInput(formatNum(parseNum(e.target.value)))}
                className="w-full bg-transparent font-black outline-none text-center text-xl text-slate-800"
              />
              <label className="text-[9px] font-bold text-slate-400 block text-center mt-1 uppercase">Số KM hiển thị trên đồng hồ</label>
            </div>
            <div className="space-y-2">
              <button onClick={handleUpdateOilLimit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest">Xác nhận</button>
              <button onClick={() => setShowOilSettings(false)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm xe */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-black text-slate-900 text-center mb-6 uppercase tracking-tight">Thêm xe mới</h3>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
              <input 
                autoFocus
                type="text" 
                placeholder="Tên xe..." 
                value={newVehicleName}
                onChange={e => setNewVehicleName(e.target.value)}
                className="w-full bg-transparent font-black outline-none text-center text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <button onClick={handleAddVehicle} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest">Thêm ngay</button>
              <button onClick={() => setShowAddVehicle(false)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
