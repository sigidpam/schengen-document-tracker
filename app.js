const EUR_AMOUNT = 30000;
const rates = { EUR: 1, IDR: 17000, USD: 1.08, MYR: 5.10 }; 

// NEW: Data Structure with "profiles" filter
const docCategories = {
    "Travel Documents": [
        { name: "Asuransi", desc: "Wajib cover Worldwide agar bisa diklaim di mana saja", profiles: ["all"] },
        { name: "Ticket Flight PP", profiles: ["all"] }, 
        { name: "Hotel Booking", profiles: ["all"] }, 
        { name: "Flight/Train/Transport inter-city", desc: "Sertakan semua tiket kereta/bus jika ada perpindahan", profiles: ["all"] }, 
        { name: "Itinerary traveling", desc: "Jelas kota, tanggal, lokasi, moda transportasi", profiles: ["all"] }
    ],
    "Data Pribadi": [
        { name: "Pas Foto", desc: "No edit & no softlens, ukuran Schengen", profiles: ["all"] },
        { name: "KTP & SIM", profiles: ["all"] }, 
        { name: "Surat Nikah", desc: "Khusus bagi yang sudah menikah", profiles: ["all"] },
        { name: "Akta Lahir", profiles: ["all"] }, 
        { name: "Kartu Keluarga", profiles: ["all"] }, 
        { name: "Halaman data passport", profiles: ["all"] }, 
        { name: "Halaman cap/visa passport", desc: "Copy/scan semua halaman cap, endorsement, & ttd", profiles: ["all"] }, 
        { name: "VISA Approved sebelumnya", desc: "Jika pernah punya Schengen/UK/US di paspor lama", profiles: ["all"] }, 
        { name: "NPWP", profiles: ["all"] }, 
        { name: "SPT / Bukti Potong Pajak", desc: "Penting untuk menunjukkan taat pajak tahunan", profiles: ["all"] }, 
        { name: "STNK Mobil", desc: "Jika bukan nama pribadi, lampirkan surat jaminan ortu", profiles: ["all"] }, 
        { name: "SHM Rumah", desc: "Jika bukan nama pribadi, lampirkan surat jaminan ortu", profiles: ["all"] },
        // KHUSUS KANTORAN
        { name: "ID Card Kantor", profiles: ["kantoran"] }
    ],
    "Surat Keterangan": [
        { name: "Personal Statement", desc: "Pernyataan tgl pergi-pulang, murni holiday, dengan siapa", profiles: ["all"] }, 
        { name: "Bank reference", profiles: ["all"] }, 
        { name: "Bank statement 3 months", desc: "Rek aktif/gaji. JANGAN mendadak diisi besar sblm apply!", profiles: ["all"] }, 
        { name: "Invitation Letter", desc: "Jika ada kenalan/fam di sana (data diri, kontak, alamat)", profiles: ["all"] },
        { name: "Dokumen Sponsor", desc: "Jika dibiayai orang lain (Surat, Rek Koran, Bukti Hubungan)", profiles: ["all"] },
        // KHUSUS KANTORAN
        { name: "Employer Reference", profiles: ["kantoran"] }, 
        { name: "Surat Izin Cuti", profiles: ["kantoran"] },
        { name: "Kontrak Kerja (Agreement)", profiles: ["kantoran"] },
        { name: "Payslip 3 months", desc: "Jika gada slip, minta surat pernyataan atasan + lampiran paspornya", profiles: ["kantoran"] },
        // KHUSUS PENGUSAHA
        { name: "Bukti Usaha (NIB/SIUP/NPWP)", desc: "Dokumen legalitas bisnis yang berjalan", profiles: ["pengusaha"] },
        // KHUSUS KREATIF / FREELANCER
        { name: "Portofolio Freelancer", desc: "Screenshot IG Profile dan hasil kerja / project kontrak", profiles: ["kreatif"] }
    ]
};

const ranks = [
    { threshold: 0, title: "Beginner", msg: "Let's start gathering those documents!" },
    { threshold: 25, title: "Explorer", msg: "Off to a good start. Keep it up!" },
    { threshold: 50, title: "Navigator", msg: "Halfway there! You're doing great." },
    { threshold: 75, title: "Voyager", msg: "Almost done. Just a few more to go!" },
    { threshold: 100, title: "Euro Bound!", msg: "All documents secured. You are ready!" }
];

let totalDocs = 0;
let currentProfile = 'kantoran'; // Default profile

function init() {
    initTheme();
    setupBriefcase();
    setupProfile(); // Initialize profile selector
    renderCurrencies();
    renderChecklist();
    updateProgress();
}

// --- Setup Profile Selector ---
function setupProfile() {
    const profileSelect = document.getElementById('user-profile');
    const savedProfile = localStorage.getItem('europath-user-profile');
    
    if (savedProfile) {
        currentProfile = savedProfile;
        profileSelect.value = savedProfile;
    }

    profileSelect.addEventListener('change', (e) => {
        currentProfile = e.target.value;
        localStorage.setItem('europath-user-profile', currentProfile);
        
        // Re-render checklist based on new profile
        renderChecklist();
        updateProgress();
    });
}

// Theme
function initTheme() {
    const savedTheme = localStorage.getItem('europath-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('europath-theme', newTheme);
        updateThemeIcon(newTheme);
    });
}
function updateThemeIcon(theme) {
    document.getElementById('theme-toggle').textContent = theme === 'light' ? '🌙' : '☀️';
}

function setupBriefcase() {
    const header = document.getElementById('briefcase-toggle');
    const content = document.getElementById('briefcase-content');
    header.addEventListener('click', () => {
        header.classList.toggle('open');
        content.classList.toggle('open');
    });
}

function renderCurrencies() {
    const grid = document.getElementById('currency-grid');
    grid.innerHTML = [
        { label: 'EUR', value: EUR_AMOUNT }, { label: 'IDR', value: EUR_AMOUNT * rates.IDR },
        { label: 'USD', value: EUR_AMOUNT * rates.USD }, { label: 'MYR', value: EUR_AMOUNT * rates.MYR }
    ].map(c => `
        <div class="currency-item">
            <div class="currency-label">${c.label}</div>
            <div class="currency-value">${c.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
    `).join('');
}

// --- Render Logic (Now Filters by Profile) ---
function renderChecklist() {
    const container = document.getElementById('document-container');
    const briefcaseList = document.getElementById('briefcase-list');
    container.innerHTML = '';
    briefcaseList.innerHTML = '';
    totalDocs = 0;

    for (const [category, docs] of Object.entries(docCategories)) {
        // FILTER: Only keep docs that match 'all' or the current selected profile
        const filteredDocs = docs.filter(doc => doc.profiles.includes('all') || doc.profiles.includes(currentProfile));
        
        // Skip rendering category if it's empty after filtering
        if (filteredDocs.length === 0) continue;

        const catId = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const section = document.createElement('div');
        section.className = 'category-section';
        section.innerHTML = `
            <h2 class="category-title">${category}</h2>
            <div id="cat-list-${catId}"></div>
        `;
        container.appendChild(section);

        const targetList = document.getElementById(`cat-list-${catId}`);

        filteredDocs.forEach(docItem => {
            totalDocs++;
            const docName = docItem.name;
            const docDesc = docItem.desc ? `<div class="doc-desc">${docItem.desc}</div>` : '';
            const docId = docName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
            const isChecked = localStorage.getItem(`europath-check-${docId}`) === 'true';
            
            const label = document.createElement('label');
            label.className = `check-item ${isChecked ? 'completed' : ''}`;
            label.dataset.originId = `cat-list-${catId}`; 
            
            label.innerHTML = `
                <input type="checkbox" id="${docId}" ${isChecked ? 'checked' : ''} onchange="toggleCheck(this, '${docId}')">
                <div class="custom-checkbox"></div>
                <div class="doc-text-wrapper">
                    <div class="doc-name">${docName}</div>
                    ${docDesc}
                </div>
            `;

            if (isChecked) {
                briefcaseList.appendChild(label);
            } else {
                targetList.appendChild(label);
            }
        });
    }
}

function toggleCheck(checkbox, docId) {
    localStorage.setItem(`europath-check-${docId}`, checkbox.checked);
    const label = checkbox.parentElement;

    updateProgress();

    if (checkbox.checked) {
        label.classList.add('animating-up');
    } else {
        label.classList.add('animating-down');
    }

    setTimeout(() => {
        if (checkbox.checked) {
            label.classList.add('completed');
            document.getElementById('briefcase-list').appendChild(label);
        } else {
            label.classList.remove('completed');
            document.getElementById(label.dataset.originId).appendChild(label);
        }

        setTimeout(() => {
            label.classList.remove('animating-up', 'animating-down');
        }, 50);

    }, 300);
}

function updateProgress() {
    let checkedDocs = 0;
    
    // We only count checkboxes that are currently rendered on the screen
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => { if (box.checked) checkedDocs++; });

    const percentage = totalDocs === 0 ? 0 : Math.round((checkedDocs / totalDocs) * 100);
    const progressFill = document.getElementById('progress-fill');
    
    document.getElementById('briefcase-title').textContent = `Secured in Briefcase (${checkedDocs})`;
    progressFill.style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}% Completed`;

    if (percentage > 0 && percentage < 100) {
        progressFill.classList.add('active'); progressFill.classList.remove('complete');
    } else if (percentage === 100) {
        progressFill.classList.remove('active'); progressFill.classList.add('complete'); 
    } else {
        progressFill.classList.remove('active', 'complete');
    }

    let currentRank = ranks[0];
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (percentage >= ranks[i].threshold) {
            currentRank = ranks[i]; break;
        }
    }

    const badge = document.getElementById('rank-badge');
    badge.textContent = `Rank: ${currentRank.title}`;
    document.getElementById('motivational-message').textContent = currentRank.msg;

    if (percentage === 100) {
        badge.style.background = 'var(--success)'; badge.style.boxShadow = '0 0 15px var(--success)';
    } else {
        badge.style.background = 'var(--accent)'; badge.style.boxShadow = 'none';
    }
}

init();