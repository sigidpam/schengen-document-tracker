const EUR_AMOUNT = 30000;
const rates = { EUR: 1, IDR: 17000, USD: 1.08, MYR: 5.10 }; 

const docCategories = {
    "Travel Documents": [
        { name: "Asuransi", desc: "wajib Worldwide agar bisa diklaim di mana saja" },
        { name: "Ticket Flight PP" }, { name: "Hotel Booking" }, { name: "Flight/Train/Transport inter-city" }, { name: "Itinerary traveling" }
    ],
    "Data Pribadi": [
        { name: "Akta Lahir" }, { name: "Kartu Keluarga" }, { name: "Halaman data passport" }, { name: "Halaman cap/visa passport" }, { name: "VISA Approved sebelumnya" }, { name: "NPWP" }, { name: "SPT / Bukti Potong Pajak" }, { name: "STNK Mobil" }, { name: "SHM Rumah" }
    ],
    "Surat Keterangan": [
        { name: "Personal Statement" }, { name: "Employer Reference" }, { name: "Bank reference" }, { name: "Bank statement 3months", desc: "sebisa mungkin rekening aktif, dan keep uang sesuai expense selama di euro beberapa bulan sebelumnya." }, { name: "Payslip 3 months" }
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

function init() {
    initTheme();
    setupBriefcase();
    renderCurrencies();
    renderChecklist();
    updateProgress();
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

// Briefcase Accordion Logic
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
            <div style="font-size: 0.75rem; color: var(--text-muted);">${c.label}</div>
            <div style="font-weight:600;">${c.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
    `).join('');
}

function renderChecklist() {
    const container = document.getElementById('document-container');
    const briefcaseList = document.getElementById('briefcase-list');
    container.innerHTML = '';
    briefcaseList.innerHTML = '';
    totalDocs = 0;

    for (const [category, docs] of Object.entries(docCategories)) {
        const catId = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        const section = document.createElement('div');
        section.className = 'category-section';
        section.innerHTML = `
            <h2 class="category-title">${category}</h2>
            <div id="cat-list-${catId}"></div>
        `;
        container.appendChild(section);

        const targetList = document.getElementById(`cat-list-${catId}`);

        docs.forEach(docItem => {
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

    // 1. Update progress and counter immediately
    updateProgress();

    // 2. Add directional animation class
    if (checkbox.checked) {
        label.classList.add('animating-up');
    } else {
        label.classList.add('animating-down');
    }

    // 3. Wait for animation, move it, and remove animation class so it pops back in
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => { if (box.checked) checkedDocs++; });

    const percentage = totalDocs === 0 ? 0 : Math.round((checkedDocs / totalDocs) * 100);
    const progressFill = document.getElementById('progress-fill');
    
    // Update the Briefcase title counter
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