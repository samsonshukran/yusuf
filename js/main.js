// ===== MAIN.JS – Core App Logic with Global Progress Tracking =====
// Arabic learning functions are now in arabic.js

// Constants for progress totals (used on home page)
const TOTAL_NAMES = 99;
const TOTAL_SURAHS = 37;
const TOTAL_DUAS = 200; // approximate total of duas in the app (Quran + Hadith)

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Samkran Ilm loaded · mā shā’ Allāh');

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);

    // Initialize global progress (load from storage)
    initGlobalProgress();

    try {
        if (currentPage === 'index.html' || currentPage === '') {
            initHomePage();
        } else if (currentPage === 'names.html') {
            initNamesPage();
        } else if (currentPage === 'juzAmma.html') {
            initJuzAmmaPage();
        } else if (currentPage === 'dua.html') {
            initDuaPage();
        }
        // Arabic page is handled by arabic.js, not here
    } catch (error) {
        console.error('Error initializing page:', error);
    }

    // Initialize common features (dhikr counters, slideshow)
    initDhikrCounters();

    // Only init slideshow if the container exists and data is available
    if (document.getElementById('slideshowContainer') && getDhikrSlides() && getDhikrSlides().length > 0) {
        initSlideshow();
    } else {
        console.log('Slideshow not initialized: container missing or no data.');
    }

    // Run data check after a delay
    setTimeout(checkDataLoaded, 1000);
});

// ==================== GLOBAL PROGRESS TRACKING ====================
let globalProgress = {
    namesViewed: [],      // array of name indices (or arabic names)
    surahsMemorized: [],  // array of surah indices
    duasRead: [],         // array of dua identifiers
    totalDhikr: 0         // total dhikr count (from counter)
};

function initGlobalProgress() {
    const saved = localStorage.getItem('samkran_global_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            globalProgress = { ...globalProgress, ...parsed };
        } catch(e) { console.error('Failed to parse progress'); }
    }
    // Also sync with existing localStorage items (e.g., totalDhikrCount, etc.)
    const totalDhikr = localStorage.getItem('totalDhikrCount');
    if (totalDhikr) globalProgress.totalDhikr = parseInt(totalDhikr) || 0;
    saveGlobalProgress();
}

function saveGlobalProgress() {
    localStorage.setItem('samkran_global_progress', JSON.stringify(globalProgress));
}

function markNameViewed(index) {
    if (!globalProgress.namesViewed.includes(index)) {
        globalProgress.namesViewed.push(index);
        saveGlobalProgress();
        updateGlobalProgressUI();
        return true;
    }
    return false;
}

function markSurahMemorized(index, memorized) {
    if (memorized && !globalProgress.surahsMemorized.includes(index)) {
        globalProgress.surahsMemorized.push(index);
        saveGlobalProgress();
        updateGlobalProgressUI();
    } else if (!memorized && globalProgress.surahsMemorized.includes(index)) {
        globalProgress.surahsMemorized = globalProgress.surahsMemorized.filter(i => i !== index);
        saveGlobalProgress();
        updateGlobalProgressUI();
    }
}

function markDuaRead(duaId) {
    if (!globalProgress.duasRead.includes(duaId)) {
        globalProgress.duasRead.push(duaId);
        saveGlobalProgress();
        updateGlobalProgressUI();
    }
}

function updateGlobalProgressUI() {
    // Use constants for totals (safe on any page)
    const namesViewedCount = globalProgress.namesViewed.length;
    const surahsMemorizedCount = globalProgress.surahsMemorized.length;
    const duasReadCount = globalProgress.duasRead.length;

    const namesPercent = Math.min(100, Math.round((namesViewedCount / TOTAL_NAMES) * 100)) || 0;
    const surahsPercent = Math.min(100, Math.round((surahsMemorizedCount / TOTAL_SURAHS) * 100)) || 0;
    const duasPercent = Math.min(100, Math.round((duasReadCount / TOTAL_DUAS) * 100)) || 0;

    // Update elements if they exist
    const namesProgressEl = document.getElementById('globalNamesProgress');
    if (namesProgressEl) namesProgressEl.style.width = namesPercent + '%';
    const namesCountEl = document.getElementById('globalNamesCount');
    if (namesCountEl) namesCountEl.innerText = `${namesViewedCount}/${TOTAL_NAMES}`;

    const surahsProgressEl = document.getElementById('globalSurahsProgress');
    if (surahsProgressEl) surahsProgressEl.style.width = surahsPercent + '%';
    const surahsCountEl = document.getElementById('globalSurahsCount');
    if (surahsCountEl) surahsCountEl.innerText = `${surahsMemorizedCount}/${TOTAL_SURAHS}`;

    const duasProgressEl = document.getElementById('globalDuasProgress');
    if (duasProgressEl) duasProgressEl.style.width = duasPercent + '%';
    const duasCountEl = document.getElementById('globalDuasCount');
    if (duasCountEl) duasCountEl.innerText = `${duasReadCount}/${TOTAL_DUAS}`;

    const dhikrCountEl = document.getElementById('globalDhikrCount');
    if (dhikrCountEl) dhikrCountEl.innerText = globalProgress.totalDhikr;
}

// ===== SAFE DATA ACCESS FUNCTIONS =====
function getNamesData() {
    return window.namesData || null;
}

function getArabicWords() {
    return window.arabicWords || null;
}

function getPhrasesData() {
    return window.phrasesData || null;
}

function getKhutbahWords() {
    return window.khutbahWords || null;
}

function getDhikrSlides() {
    return window.dhikrSlides || null;
}

function getJuzAmmaData() {
    return window.juzAmmaData || null;
}

function getSwahiliTranslations() {
    return window.swahiliTranslations || null;
}

function getQuranDuas() {
    return window.quranDuas || null;
}

function getHadithDuas() {
    return window.hadithDuas || null;
}

// ===== HOME PAGE =====
function initHomePage() {
    console.log('Initializing home page...');

    const namesData = getNamesData();
    const arabicWords = getArabicWords();

    // Name of the Day
    if (namesData && namesData.length > 0) {
        const randomIndex = Math.floor(Math.random() * namesData.length);
        const name = namesData[randomIndex];
        safeSetText('dailyNameArabic', name.arabic);
        safeSetText('dailyNameTranslit', name.transliteration);
        safeSetText('dailyNameMeaning', name.meaning);
        safeSetText('dailyNameReflection', name.reflection || "Allah's names are beautiful, call upon Him by them.");
        safeSetHtml('dailyNameDua', `<span class="dua-label">Du'a:</span> ${name.duaExample || 'Yā ' + name.transliteration}`);
        safeSetText('dailyNameEvidence', name.evidence || "Qur'an/Sunnah");
    } else {
        console.warn('namesData not available');
        safeSetText('dailyNameArabic', 'اللَّهُ');
        safeSetText('dailyNameTranslit', 'Allāh');
        safeSetText('dailyNameMeaning', 'The God');
    }

    // Word of the Day
    if (arabicWords && arabicWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * arabicWords.length);
        const word = arabicWords[randomIndex];
        safeSetText('dailyWordArabic', word.arabic);
        safeSetText('dailyWordTranslit', word.translit);
        safeSetText('dailyWordMeaning', word.meaning);
        safeSetText('dailyWordRoot', `Word Type: ${word.type || 'word'}`);
        safeSetText('dailyWordTajweed', word.tajweed ? `🔊 ${word.tajweed}` : '');
    } else {
        console.warn('arabicWords not available');
    }

    // Update global UI (progress bars)
    updateGlobalProgressUI();
}

// ===== NAMES PAGE =====
function initNamesPage() {
    console.log('Initializing names page...');
    renderNamesGrid();
    setupNameDetailView();
}

function renderNamesGrid() {
    const gridContainer = document.getElementById('namesGridContainer');
    if (!gridContainer) {
        console.error('namesGridContainer not found');
        return;
    }

    const namesData = getNamesData();
    if (!namesData || namesData.length === 0) {
        gridContainer.innerHTML = '<div class="error-message">Names data not loaded. Please check console.</div>';
        console.error('namesData not available');
        return;
    }

    gridContainer.innerHTML = '';

    namesData.forEach((name, index) => {
        if (!name) return;
        const isViewed = globalProgress.namesViewed.includes(index);
        const card = document.createElement('div');
        card.className = 'name-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="arabic-name">${name.arabic || ''}</div>
            <div class="transliteration">${name.transliteration || ''}</div>
            <div class="meaning">${name.meaning || ''}</div>
            <div class="badge" style="align-self: center;">${isViewed ? '✓ Viewed' : 'click for details'}</div>
        `;
        card.addEventListener('click', () => showNameDetail(index));
        gridContainer.appendChild(card);
    });

    const countEl = document.getElementById('namesCount');
    if (countEl) countEl.innerText = namesData.length + ' names';
    console.log(`✅ Rendered ${namesData.length} names`);
}

function showNameDetail(index) {
    const namesData = getNamesData();
    if (!namesData || !namesData[index]) {
        console.error('Name not found at index:', index);
        return;
    }

    const name = namesData[index];
    window.currentNameIndex = index;

    // Mark as viewed
    markNameViewed(index);

    const grid = document.getElementById('namesGrid');
    const detail = document.getElementById('nameDetail');
    if (grid) grid.classList.add('hidden');
    if (detail) detail.classList.remove('hidden');

    safeSetText('detailArabic', name.arabic);
    safeSetText('detailTranslit', name.transliteration);
    safeSetText('detailMeaning', name.meaning);
    safeSetText('detailEvidence', name.evidence || 'Qur\'an / Sunnah');
    safeSetText('detailReflection', name.reflection || 'Reflect on this name of Allah.');

    if (name.whenToUse) {
        safeSetText('detailWhen', Array.isArray(name.whenToUse) ? name.whenToUse.join(' · ') : name.whenToUse);
    } else {
        safeSetText('detailWhen', 'In all situations');
    }

    safeSetText('detailDua', name.duaExample || 'Yā ' + (name.transliteration || 'Allah'));
    safeSetText('detailTajwid', name.tajwidNote || 'No special note');

    if (name.relatedNames) {
        safeSetText('detailRelated', Array.isArray(name.relatedNames) ? name.relatedNames.join(' · ') : name.relatedNames);
    } else {
        safeSetText('detailRelated', '—');
    }

    const personalNoteEl = document.getElementById('personalNote');
    if (personalNoteEl) {
        const savedNote = localStorage.getItem(`nameNote_${index}`);
        personalNoteEl.value = savedNote || '';
    }

    // Re-render grid to update viewed badges
    renderNamesGrid();
}

function setupNameDetailView() {
    const backBtn = document.getElementById('backToGrid');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const grid = document.getElementById('namesGrid');
            const detail = document.getElementById('nameDetail');
            if (grid) grid.classList.remove('hidden');
            if (detail) detail.classList.add('hidden');
            renderNamesGrid(); // refresh badges
        });
    }

    const personalNote = document.getElementById('personalNote');
    if (personalNote) {
        personalNote.addEventListener('input', function(e) {
            const index = window.currentNameIndex;
            if (index !== undefined) {
                localStorage.setItem(`nameNote_${index}`, e.target.value);
            }
        });
    }
}

// ===== DHIKR SLIDESHOW =====
let slideshowIndex = 0;
let slideshowInterval = null;

function initSlideshow() {
    console.log('Initializing slideshow...');

    const dhikrSlides = getDhikrSlides();
    if (!dhikrSlides || dhikrSlides.length === 0) {
        console.log('Slideshow data not available – skipping.');
        return;
    }

    updateSlideshow();

    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        const slides = getDhikrSlides();
        if (slides && slides.length > 0) {
            slideshowIndex = (slideshowIndex + 1) % slides.length;
            updateSlideshow();
        }
    }, 300000);

    const prevBtn = document.getElementById('slideshowPrev');
    const nextBtn = document.getElementById('slideshowNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const slides = getDhikrSlides();
            if (slides && slides.length > 0) {
                slideshowIndex = (slideshowIndex - 1 + slides.length) % slides.length;
                updateSlideshow();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const slides = getDhikrSlides();
            if (slides && slides.length > 0) {
                slideshowIndex = (slideshowIndex + 1) % slides.length;
                updateSlideshow();
            }
        });
    }

    initSlideshowCounter();
}

function updateSlideshow() {
    const dhikrSlides = getDhikrSlides();
    if (!dhikrSlides || dhikrSlides.length === 0 || !dhikrSlides[slideshowIndex]) return;

    const slide = dhikrSlides[slideshowIndex];
    safeSetText('slideshowArabic', slide.arabic);
    safeSetText('slideshowTranslit', slide.translit);
    safeSetText('slideshowMeaning', slide.meaning);
    safeSetText('slideshowCount', `Recommended: ${slide.count || 33} times`);
    safeSetText('currentDhikrName', slide.translit);
}

function initSlideshowCounter() {
    let count = 0;
    const counterValue = document.getElementById('slideshowCounterValue');
    const plusBtn = document.getElementById('slideshowCounterPlus');
    const resetBtn = document.getElementById('slideshowCounterReset');
    const set33 = document.getElementById('setTarget33');
    const set100 = document.getElementById('setTarget100');

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            count++;
            if (counterValue) counterValue.innerText = count;
            globalProgress.totalDhikr += 1;
            localStorage.setItem('totalDhikrCount', globalProgress.totalDhikr);
            updateGlobalProgressUI();
            saveGlobalProgress();
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            count = 0;
            if (counterValue) counterValue.innerText = '0';
        });
    }
    if (set33) {
        set33.addEventListener('click', () => safeSetText('slideshowCount', 'Recommended: 33 times'));
    }
    if (set100) {
        set100.addEventListener('click', () => safeSetText('slideshowCount', 'Recommended: 100 times'));
    }
}

// ===== DHIKR COUNTERS =====
function initDhikrCounters() {
    console.log('Initializing dhikr counters...');

    initSingleCounter('subhan', 33);
    initSingleCounter('hamd', 33);
    initSingleCounter('akbar', 34);

    initSingleCounter('subhan2', 33);
    initSingleCounter('hamd2', 33);
    initSingleCounter('akbar2', 34);

    const resetAll = document.getElementById('resetAllDhikr');
    if (resetAll) {
        resetAll.addEventListener('click', () => {
            safeSetText('subhanValue', '33');
            safeSetText('hamdValue', '33');
            safeSetText('akbarValue', '34');
        });
    }

    const resetAll2 = document.getElementById('resetAllDhikr2');
    if (resetAll2) {
        resetAll2.addEventListener('click', () => {
            safeSetText('subhanValue2', '33');
            safeSetText('hamdValue2', '33');
            safeSetText('akbarValue2', '34');
        });
    }
}

function initSingleCounter(prefix, defaultValue) {
    const plusBtn = document.getElementById(prefix + 'Plus');
    const resetBtn = document.getElementById(prefix + 'Reset');
    const valueEl = document.getElementById(prefix + 'Value');
    if (!valueEl) return;

    valueEl.innerText = defaultValue;

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            let val = parseInt(valueEl.innerText) || 0;
            val = val >= defaultValue ? 0 : val + 1;
            valueEl.innerText = val;
            // Update global dhikr count if we are on a page that uses these counters (home page)
            if (prefix === 'subhan' || prefix === 'hamd' || prefix === 'akbar') {
                globalProgress.totalDhikr += 1;
                localStorage.setItem('totalDhikrCount', globalProgress.totalDhikr);
                updateGlobalProgressUI();
                saveGlobalProgress();
            }
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => valueEl.innerText = defaultValue);
    }
}

// ===== DUA PAGE =====
function initDuaPage() {
    console.log('Initializing Dua page...');

    const quranDuas = getQuranDuas();
    const hadithDuas = getHadithDuas();

    if (quranDuas) console.log(`📖 Quranic duas loaded: ${quranDuas.length}`);
    if (hadithDuas) console.log(`📖 Hadith duas loaded: ${hadithDuas.length}`);

    if (typeof window.initDuaSystem === 'function') {
        try {
            window.initDuaSystem();
            // Hook into favorite or view events to mark dua as read
            hookDuaReadTracking();
        } catch (error) {
            console.error('Error initializing dua system:', error);
        }
    } else {
        console.warn('initDuaSystem not available');
        const grid = document.getElementById('duasGrid');
        if (grid && (quranDuas || hadithDuas)) {
            const allDuas = [...(quranDuas || []), ...(hadithDuas || [])];
            if (allDuas.length > 0) {
                renderSimpleDuas(allDuas);
            }
        }
    }
}

function hookDuaReadTracking() {
    // This will be called after initDuaSystem; we can observe clicks on dua cards
    document.addEventListener('click', function(e) {
        const duaCard = e.target.closest('.dua-card');
        if (duaCard) {
            const duaId = duaCard.dataset.duaId || duaCard.innerText.slice(0, 50);
            markDuaRead(duaId);
        }
    });
}

function renderSimpleDuas(duas) {
    const grid = document.getElementById('duasGrid');
    if (!grid) return;
    grid.innerHTML = '';
    duas.slice(0, 20).forEach((dua, idx) => {
        const card = document.createElement('div');
        card.className = 'dua-card';
        card.dataset.duaId = idx;
        card.innerHTML = `
            <div class="arabic-text">${dua.arabic || ''}</div>
            <div class="transliteration">${dua.transliteration || ''}</div>
            <div class="swahili-text">${dua.swahili || dua.meaning || ''}</div>
        `;
        grid.appendChild(card);
    });
}

// ===== JUZ 'AMMA PAGE =====
function initJuzAmmaPage() {
    console.log('Initializing Juz Amma page...');
    const juzAmmaData = getJuzAmmaData();
    if (juzAmmaData) {
        console.log(`📖 Juz Amma data loaded: ${juzAmmaData.length} surahs`);
    }
    if (typeof window.initJuzAmma === 'function') {
        try {
            window.initJuzAmma();
            // Hook into memorization events (the juzAmma.js likely has a function toggleMemorized)
            // We'll expose a global to detect changes
            window.updateSurahMemorized = function(surahIndex, isMemorized) {
                markSurahMemorized(surahIndex, isMemorized);
            };
        } catch (error) {
            console.error('Error initializing Juz Amma:', error);
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text || '';
}

function safeSetHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html || '';
}

function checkDataLoaded() {
    console.log('=== DATA LOAD CHECK ===');
    console.log('namesData:', getNamesData() ? `✅ Loaded (${getNamesData().length})` : '❌ NOT LOADED');
    console.log('arabicWords:', getArabicWords() ? `✅ Loaded (${getArabicWords().length})` : '❌ NOT LOADED');
    console.log('phrasesData:', getPhrasesData() ? `✅ Loaded (${getPhrasesData().length})` : '❌ NOT LOADED');
    console.log('khutbahWords:', getKhutbahWords() ? `✅ Loaded (${getKhutbahWords().length})` : '❌ NOT LOADED');
    console.log('dhikrSlides:', getDhikrSlides() ? `✅ Loaded (${getDhikrSlides().length})` : '❌ NOT LOADED');
    console.log('juzAmmaData:', getJuzAmmaData() ? `✅ Loaded (${getJuzAmmaData().length})` : '❌ NOT LOADED');
    console.log('quranDuas:', getQuranDuas() ? `✅ Loaded (${getQuranDuas().length})` : '❌ NOT LOADED');
    console.log('hadithDuas:', getHadithDuas() ? `✅ Loaded (${getHadithDuas().length})` : '❌ NOT LOADED');
    console.log('Global progress:', globalProgress);
    console.log('=======================');
}

// ===== PWA INSTALLATION =====
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

if (installBtn) {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installBtn.style.display = 'none';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'flex';
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome} installation`);
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    console.log('App was installed successfully');
    if (installBtn) installBtn.style.display = 'none';
});

// ===== OFFLINE DETECTION =====
function updateOnlineStatus() {
    let indicator = document.getElementById('offlineIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '📴 You are offline';
        document.body.appendChild(indicator);
    }
    if (navigator.onLine) {
        indicator.classList.remove('show');
    } else {
        indicator.classList.add('show');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    });
}

// ===== CLEAR CACHE =====
window.clearAppCache = async function() {
    if (confirm('Clear all cached data? You will need to download audio again.')) {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map((name) => {
                if (name.startsWith('samkran-ilm-')) {
                    return caches.delete(name);
                }
            })
        );
        alert('Cache cleared successfully');
        window.location.reload();
    }
};

// Export global functions to window
window.initHomePage = initHomePage;
window.renderNamesGrid = renderNamesGrid;
window.initNamesPage = initNamesPage;
window.initJuzAmmaPage = initJuzAmmaPage;
window.initDuaPage = initDuaPage;
window.checkDataLoaded = checkDataLoaded;
window.clearAppCache = clearAppCache;
window.markNameViewed = markNameViewed;
window.markSurahMemorized = markSurahMemorized;
window.markDuaRead = markDuaRead;
window.updateGlobalProgressUI = updateGlobalProgressUI;

console.log('✅ main.js loaded with global progress tracking');