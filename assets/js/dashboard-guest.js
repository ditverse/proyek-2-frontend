const API_BASE = 'http://localhost:8000/api';

// --- STATE VARIABLES ---
let currentDate = new Date();
let allSchedules = [];

// --- DOM ELEMENTS ---
const calendarGrid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('month-year-label');
const jadwalContainer = document.getElementById('jadwal-list-container');
const selectedDateLabel = document.getElementById('selected-date-label');
const barangBody = document.getElementById('barang-body');

// --- HELPERS ---
const formatDateKey = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
};

// --- LOGIC 1: JADWAL & KALENDER ---

const fetchSchedules = async () => {
  try {
    const response = await fetch(`${API_BASE}/jadwal-ruangan`);
    allSchedules = await response.json();

    renderCalendar();

    const today = new Date();
    showScheduleForDate(today.getDate(), today.getMonth(), today.getFullYear());
  } catch (error) {
    console.error('Gagal ambil data jadwal:', error);
    // Tampilan Error yang Bagus
    jadwalContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
         <div class="bg-red-50 p-4 rounded-full mb-3">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
         </div>
         <p class="text-red-600 font-semibold text-sm">Gagal terhubung ke server</p>
         <p class="text-gray-400 text-xs mt-1">Silakan coba muat ulang halaman.</p>
      </div>
    `;
  }
};

const renderCalendar = () => {
  calendarGrid.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayDate = new Date();

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  monthYearLabel.innerText = `${monthNames[month]} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    calendarGrid.innerHTML += '<div></div>';
  }

  for (let i = 1; i <= lastDay; i++) {
    const dateKey = formatDateKey(year, month, i);
    const hasEvent = allSchedules.some((s) => s.tanggal_mulai && s.tanggal_mulai.startsWith(dateKey));
    const isToday = i === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear();

    const dayEl = document.createElement('div');
    dayEl.className = `
      h-10 w-10 mx-auto flex flex-col items-center justify-center rounded-full cursor-pointer transition-all duration-200 group relative
      ${isToday ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-100' : 'text-gray-700 hover:bg-orange-50'}
    `;

    dayEl.onclick = () => showScheduleForDate(i, month, year);

    dayEl.innerHTML = `
      <span class="text-sm font-medium relative z-10">${i}</span>
      ${hasEvent ? `<span class="absolute bottom-1 h-1.5 w-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-red-500'}"></span>` : ''}
    `;

    calendarGrid.appendChild(dayEl);
  }
};

const showScheduleForDate = (day, month, year) => {
  const dateKey = formatDateKey(year, month, day);
  const dateObj = new Date(year, month, day);
  if (selectedDateLabel) {
    selectedDateLabel.innerText = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric' // <--- TAMBAHKAN INI
    });
  }

  const dailySchedules = allSchedules.filter((s) => s.tanggal_mulai && s.tanggal_mulai.startsWith(dateKey));

  // --- UPDATE TAMPILAN KOSONG (EMPTY STATE) ---
  if (dailySchedules.length === 0) {
    jadwalContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
         <div class="bg-orange-50 p-4 rounded-full mb-4 border border-orange-100">
            <svg class="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
         </div>
         <h4 class="text-gray-900 font-semibold text-base mb-1">Tidak Ada Jadwal</h4>
         <p class="text-gray-500 text-sm max-w-[200px]">Belum ada kegiatan yang terdaftar untuk tanggal ini.</p>
      </div>`;
    return;
  }

  // Render Kartu
  jadwalContainer.innerHTML = dailySchedules
    .map((j) => {
      const jamMulai = formatTime(j.tanggal_mulai);
      const jamSelesai = formatTime(j.tanggal_selesai);
      const jenis = j.jenis_kegiatan || 'Kelas';

      return `
        <div class="group relative bg-white rounded-2xl p-5 border border-orange-100 shadow-sm hover:shadow-orange-100/50 hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-orange-600"></div>

          <div class="relative pl-3 flex flex-col h-full justify-between">
             <div class="flex justify-between items-start mb-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                  ${jenis}
                </span>
                <div class="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                   <svg class="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   ${jamMulai} - ${jamSelesai}
                </div>
             </div>
             
             <div class="mb-4">
                 <h4 class="font-bold text-gray-800 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                    ${j.kegiatan || 'Penggunaan Ruangan'}
                 </h4>
                 <div class="flex items-center gap-2 text-sm text-gray-500">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span class="truncate max-w-[200px]">${j.deskripsi || j.peminjam || '-'}</span>
                 </div>
             </div>
             
             <div class="pt-3 border-t border-gray-50 mt-auto">
               <div class="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>${j.nama_ruangan || 'Lokasi Belum Ditentukan'}</span>
               </div>
             </div>
          </div>
        </div>
       `;
    })
    .join('');
};

window.changeMonth = (direction) => {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
};

// --- LOGIC 2 & 3: DATA RUANGAN & BARANG (TETAP SAMA) ---
// (Bagian ini tidak perlu diubah karena sudah sesuai dengan permintaan sebelumnya)
fetch(`${API_BASE}/ruangan`)
  .then((r) => r.json())
  .then((data) => {
    const tbody = document.getElementById('ruangan-body');
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="px-5 py-4 text-center text-gray-400 text-xs">Tidak ada data ruangan.</td></tr>';
      return;
    }
    tbody.innerHTML = data.map((r) => `
        <tr class="hover:bg-orange-50/60 transition-colors group">
          <td class="px-5 py-3 font-mono text-xs text-gray-500 bg-orange-50/80 border-r w-20 group-hover:bg-orange-100">${r.kode_ruangan || '-'}</td>
          <td class="px-5 py-3 font-semibold text-gray-800 text-sm">${r.nama_ruangan || '-'}</td>
          <td class="px-5 py-3 text-gray-600 text-xs">${r.lokasi || '-'}</td>
          <td class="px-5 py-3 text-center">
              <span class="inline-block bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-[10px] font-bold border border-orange-100">${r.kapasitas || '0'} Org</span>
          </td>
        </tr>`).join('');
  })
  .catch(() => { document.getElementById('ruangan-body').innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500 text-xs">Gagal memuat data.</td></tr>'; });

const fetchBarang = () => {
  fetch(`${API_BASE}/barang`)
    .then((r) => r.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        barangBody.innerHTML = '<tr><td colspan="3" class="px-5 py-4 text-center text-gray-400 text-xs">Tidak ada data barang.</td></tr>';
        return;
      }
      barangBody.innerHTML = data.map((barang) => `
          <tr class="hover:bg-orange-50/60 transition-colors">
            <td class="px-5 py-3 font-mono text-xs text-gray-500 bg-orange-50/80 border-r w-24">${barang.kode_barang || '-'}</td>
            <td class="px-5 py-3 font-semibold text-gray-800 text-sm">${barang.nama_barang || '-'}</td>
            <td class="px-5 py-3 text-gray-600 text-sm">${barang.deskripsi || '-'}</td>
          </tr>`).join('');
    })
    .catch(() => { barangBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-red-500 text-xs">Gagal memuat barang.</td></tr>'; });
};

fetchSchedules();
fetchBarang();