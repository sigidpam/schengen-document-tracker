const EUR_AMOUNT = 30000;
const rates = { EUR: 1, IDR: 17000, USD: 1.08, MYR: 5.10 }; 

const docCategories = {
    "Travel Documents": [
        "Asuransi", "Ticket Flight PP", "Hotel Booking", "Flight/Train/Transport inter-city", "Itinerary traveling"
    ],
    "Data Pribadi": [
        "Akta Lahir", "Kartu Keluarga", "Halaman data passport", "Halaman cap/visa passport", "VISA Approved sebelumnya", "NPWP", "SPT / Bukti Potong Pajak", "STNK Mobil", "SHM Rumah"
    ],
    "Surat Keterangan": [
        "Personal Statement", "Employer Reference", "Bank reference", "Bank statement 3months", "Payslip 3 months"
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
let checkedDocs = 0;

function init() {
    initTheme();
    renderCurrencies();
    renderChecklist();
    updateProgress();
}

// --- Theme Management ---
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
    const btn = document.getElementById('theme-toggle');
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

function renderCurrencies() {
    const grid = document.getElementById('currency-grid');
    const currencies = [
        { label: 'EUR', value: EUR_AMOUNT },
        { label: 'IDR', value: EUR_AMOUNT * rates.IDR },
        { label: 'USD', value: EUR_AMOUNT * rates.USD },
        { label: 'MYR', value: EUR_AMOUNT * rates.MYR }
    ];
    grid.innerHTML = currencies.map(c => `
        <div class="currency-item">
            <div style="font-size: 0.75rem; color: var(--text-muted);">${c.label}</div>
            <div style="font-weight:600;">${c.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
    `).join('');
}

function renderChecklist() {
    const container = document.getElementById('document-container');
    container.innerHTML = '';
    totalDocs = 0;

    for (const [category, docs] of Object.entries(docCategories)) {
        const section = document.createElement('div');
        section.className = 'category-section';
        section.innerHTML = `<h2 class="category-title">${category}</h2>`;
        
        docs.forEach(docName => {
            totalDocs++;
            const docId = docName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
            const isChecked = localStorage.getItem(`europath-check-${docId}`) === 'true';
            
            const label = document.createElement('label');
            label.className = `check-item ${isChecked ? 'completed' : ''}`;
            
            label.innerHTML = `
                <input type="checkbox" id="${docId}" ${isChecked ? 'checked' : ''} onchange="toggleCheck(this, '${docId}')">
                <div class="custom-checkbox"></div>
                <div class="doc-name">${docName}</div>
            `;
            section.appendChild(label);
        });
        container.appendChild(section);
    }
}

function toggleCheck(checkbox, docId) {
    localStorage.setItem(`europath-check-${docId}`, checkbox.checked);
    const label = checkbox.parentElement;
    if (checkbox.checked) {
        label.classList.add('completed');
    } else {
        label.classList.remove('completed');
    }
    updateProgress();
}

function updateProgress() {
    checkedDocs = 0;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => { if (box.checked) checkedDocs++; });

    const percentage = totalDocs === 0 ? 0 : Math.round((checkedDocs / totalDocs) * 100);
    const progressFill = document.getElementById('progress-fill');
    
    // Update width
    progressFill.style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}% Completed`;

    // Handle animations based on progress state
    if (percentage > 0 && percentage < 100) {
        progressFill.classList.add('active');
        progressFill.classList.remove('complete');
    } else if (percentage === 100) {
        progressFill.classList.remove('active');
        progressFill.classList.add('complete'); // Triggers the glow
    } else {
        progressFill.classList.remove('active', 'complete');
    }

    // Update Rank
    let currentRank = ranks[0];
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (percentage >= ranks[i].threshold) {
            currentRank = ranks[i];
            break;
        }
    }

    const badge = document.getElementById('rank-badge');
    badge.textContent = `Rank: ${currentRank.title}`;
    document.getElementById('motivational-message').textContent = currentRank.msg;

    if (percentage === 100) {
        badge.style.background = 'var(--success)';
        badge.style.boxShadow = '0 0 15px var(--success)';
    } else {
        badge.style.background = 'var(--accent)';
        badge.style.boxShadow = 'none';
    }
}

init();

