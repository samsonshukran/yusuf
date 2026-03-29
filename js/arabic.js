// ===== ARABIC.JS - Complete Arabic Learning Module =====
// Handles rendering, interactions, progress tracking, and quiz functionality

// Global variables
let currentLearningTab = 'letters';
let currentWordIndex = 0;
let filteredWords = [];
let currentConversationIndex = 0;
let currentConversationLines = [];
let currentPracticeLine = null;
let quizCorrectCount = 0;
let quizWrongCount = 0;
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let viewedLetters = [];
let viewedWords = [];
let viewedPhrases = [];
let viewedConversations = [];

// Qur'an dictionary specific
let quranDictionaryWords = [];
let filteredQuranWords = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Arabic learning page initializing...');
    
    // Check if data is loaded
    if (window.arabicLearningData) {
        console.log('Arabic learning data available, rendering...');
        renderLetters();
        renderWords();
        renderPhrases();
        renderSentences();
        renderConversations();
        loadRandomQuizQuestion();
        
        // Load progress from localStorage
        loadLearningProgress();
        
        // Setup search listeners
        setupSearchListeners();
    } else {
        console.error('Arabic learning data not loaded!');
        showErrorMessage();
    }

    // Load Qur'an dictionary from JSON
    loadQuranDictionary();
    
    // Render videos
    renderVideos();

    // Attach event listeners to buttons (to replace inline onclick)
    attachEventListeners();
});

function attachEventListeners() {
    // Tab buttons
    document.querySelectorAll('.learning-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchLearningTab(tabId);
        });
    });

    // Writing practice
    const checkBtn = document.querySelector('.writing-check');
    if (checkBtn) checkBtn.addEventListener('click', checkWriting);
    const nextBtn = document.querySelector('.writing-next');
    if (nextBtn) nextBtn.addEventListener('click', nextWritingLetter);

    // Words flashcard
    const closeFlashcardBtn = document.querySelector('.close-flashcard');
    if (closeFlashcardBtn) closeFlashcardBtn.addEventListener('click', closeFlashcard);
    const prevWordBtn = document.querySelector('.prev-word');
    if (prevWordBtn) prevWordBtn.addEventListener('click', previousWord);
    const nextWordBtn = document.querySelector('.next-word');
    if (nextWordBtn) nextWordBtn.addEventListener('click', nextWord);

    // Conversation shuffle
    const shuffleBtn = document.querySelector('.shuffle-btn');
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleConversation);
    const checkPracticeBtn = document.querySelector('.check-practice');
    if (checkPracticeBtn) checkPracticeBtn.addEventListener('click', checkPractice);

    // Quiz
    const newQuizBtn = document.querySelector('.quiz-new-btn');
    if (newQuizBtn) newQuizBtn.addEventListener('click', loadRandomQuizQuestion);
    const submitAnswerBtn = document.querySelector('.submit-answer');
    if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', checkQuizTextAnswer);
    const quizTopicSelect = document.getElementById('quizTopic');
    if (quizTopicSelect) quizTopicSelect.addEventListener('change', function() { loadQuizByTopic(this.value); });

    // Dictionary filter
    const quranSearch = document.getElementById('quranSearch');
    if (quranSearch) quranSearch.addEventListener('input', () => renderQuranDictionary());
    const quranJuzFilter = document.getElementById('quranJuzFilter');
    if (quranJuzFilter) quranJuzFilter.addEventListener('change', () => renderQuranDictionary());

    // Word search and category
    const wordSearch = document.getElementById('wordSearch');
    if (wordSearch) wordSearch.addEventListener('input', () => renderWords());
    const wordCategory = document.getElementById('wordCategory');
    if (wordCategory) wordCategory.addEventListener('change', () => renderWords());

    // Phrase search
    const phraseSearch = document.getElementById('phraseSearch');
    if (phraseSearch) phraseSearch.addEventListener('input', () => renderPhrases());

    // Sentence type filter
    const sentenceType = document.getElementById('sentenceType');
    if (sentenceType) sentenceType.addEventListener('change', () => renderSentences());

    // Conversation topic
    const conversationTopic = document.getElementById('conversationTopic');
    if (conversationTopic) conversationTopic.addEventListener('change', () => renderConversations());
}

// ===== PROGRESS TRACKING =====
function loadLearningProgress() {
    const savedProgress = localStorage.getItem('arabicLearningProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            viewedLetters = progress.viewedLetters || [];
            viewedWords = progress.viewedWords || [];
            viewedPhrases = progress.viewedPhrases || [];
            viewedConversations = progress.viewedConversations || [];
            updateAllProgress();
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }
}

function saveLearningProgress() {
    const progress = {
        viewedLetters,
        viewedWords,
        viewedPhrases,
        viewedConversations
    };
    localStorage.setItem('arabicLearningProgress', JSON.stringify(progress));
    updateAllProgress();
}

function updateAllProgress() {
    // Letters progress
    if (window.arabicLearningData && window.arabicLearningData.letters) {
        const lettersProgress = (viewedLetters.length / window.arabicLearningData.letters.length) * 100;
        const lettersProgressBar = document.getElementById('lettersProgress');
        const lettersCount = document.getElementById('lettersCount');
        if (lettersProgressBar) lettersProgressBar.style.width = lettersProgress + '%';
        if (lettersCount) lettersCount.innerText = `${viewedLetters.length}/${window.arabicLearningData.letters.length}`;
    }
    
    // Words progress (first 50 words)
    if (window.arabicLearningData && window.arabicLearningData.words) {
        const wordsTotal = Math.min(50, window.arabicLearningData.words.length);
        const wordsProgress = (viewedWords.filter(w => window.arabicLearningData.words.some(word => word.arabic === w)).length / wordsTotal) * 100;
        const wordsProgressBar = document.getElementById('wordsProgress');
        const wordsCount = document.getElementById('wordsCount');
        if (wordsProgressBar) wordsProgressBar.style.width = wordsProgress + '%';
        if (wordsCount) wordsCount.innerText = `${viewedWords.filter(w => window.arabicLearningData.words.some(word => word.arabic === w)).length}/${wordsTotal}`;
    }
    
    // Phrases progress (first 30 phrases)
    if (window.arabicLearningData && window.arabicLearningData.phrases) {
        const phrasesTotal = Math.min(30, window.arabicLearningData.phrases.length);
        const phrasesProgress = (viewedPhrases.length / phrasesTotal) * 100;
        const phrasesProgressBar = document.getElementById('phrasesProgress');
        const phrasesCount = document.getElementById('phrasesCount');
        if (phrasesProgressBar) phrasesProgressBar.style.width = phrasesProgress + '%';
        if (phrasesCount) phrasesCount.innerText = `${viewedPhrases.length}/${phrasesTotal}`;
    }
    
    // Conversations progress
    if (window.arabicLearningData && window.arabicLearningData.conversations) {
        const conversationsProgress = (viewedConversations.length / window.arabicLearningData.conversations.length) * 100;
        const conversationsProgressBar = document.getElementById('conversationsProgress');
        const conversationsCount = document.getElementById('conversationsCount');
        if (conversationsProgressBar) conversationsProgressBar.style.width = conversationsProgress + '%';
        if (conversationsCount) conversationsCount.innerText = `${viewedConversations.length}/${window.arabicLearningData.conversations.length}`;
    }

    // Qur'an Dictionary progress
    updateQuranProgress();
}

function markLetterViewed(letter) {
    if (!viewedLetters.includes(letter)) {
        viewedLetters.push(letter);
        saveLearningProgress();
        renderLetters();
    }
}

function markWordViewed(word) {
    if (!viewedWords.includes(word)) {
        viewedWords.push(word);
        saveLearningProgress();
    }
}

function markPhraseViewed(phrase) {
    if (!viewedPhrases.includes(phrase)) {
        viewedPhrases.push(phrase);
        saveLearningProgress();
        renderPhrases();
    }
}

function markConversationViewed(topic) {
    if (!viewedConversations.includes(topic)) {
        viewedConversations.push(topic);
        saveLearningProgress();
    }
}

// ===== TAB SWITCHING =====
function switchLearningTab(tabId) {
    document.querySelectorAll('.learning-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`.learning-tabs .tab-btn[data-tab="${tabId}"]`);
    if (activeButton) activeButton.classList.add('active');
    document.querySelectorAll('.learning-tab-content').forEach(tab => tab.classList.remove('active'));
    const selectedTab = document.getElementById(`${tabId}-tab`);
    if (selectedTab) selectedTab.classList.add('active');
    currentLearningTab = tabId;
}

// ===== LETTERS SECTION =====
function renderLetters() {
    const container = document.getElementById('lettersGrid');
    if (!container || !window.arabicLearningData || !window.arabicLearningData.letters) return;
    
    container.innerHTML = '';
    
    window.arabicLearningData.letters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-master-card';
        card.onclick = () => showLetterDetails(letter);
        
        const isViewed = viewedLetters.includes(letter.letter);
        
        card.innerHTML = `
            <div class="letter-main">${letter.letter}</div>
            <div class="letter-info">
                <span class="letter-name">${letter.name}</span>
                <span class="letter-sound">${letter.sound}</span>
            </div>
            ${isViewed ? '<span class="viewed-badge">✓</span>' : ''}
        `;
        
        container.appendChild(card);
    });
    
    const writingLetter = document.getElementById('currentWritingLetter');
    if (writingLetter && window.arabicLearningData.letters.length > 0) {
        writingLetter.innerText = window.arabicLearningData.letters[Math.floor(Math.random() * 28)].letter;
    }
}

function showLetterDetails(letter) {
    markLetterViewed(letter.letter);
    const modal = document.createElement('div');
    modal.className = 'letter-modal';
    modal.innerHTML = `
        <div class="letter-modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">✕</button>
            <div class="letter-modal-header">
                <div class="letter-modal-arabic">${letter.letter}</div>
                <div class="letter-modal-name">${letter.name} (${letter.translit})</div>
            </div>
            <div class="letter-modal-body">
                <div class="letter-detail-item">
                    <span class="detail-label">Pronunciation:</span>
                    <span class="detail-value">${letter.pronunciation}</span>
                </div>
                <div class="letter-detail-item">
                    <span class="detail-label">Sound:</span>
                    <span class="detail-value">${letter.sound}</span>
                </div>
                <div class="letter-detail-item">
                    <span class="detail-label">Examples:</span>
                    <ul class="example-list">
                        ${letter.examples ? letter.examples.map(ex => `<li>${ex}</li>`).join('') : ''}
                    </ul>
                </div>
                <div class="letter-detail-item">
                    <span class="detail-label">Writing:</span>
                    <span class="detail-value">${letter.writing || 'See examples'}</span>
                </div>
            </div>
            <button class="letter-practice-btn" onclick="practiceLetter('${letter.letter}')">Practice Writing</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function practiceLetter(letter) {
    const writingLetter = document.getElementById('currentWritingLetter');
    if (writingLetter) writingLetter.innerText = letter;
    switchLearningTab('letters');
    const writingInput = document.getElementById('writingInput');
    if (writingInput) writingInput.focus();
    const modal = document.querySelector('.letter-modal');
    if (modal) modal.remove();
}

function checkWriting() {
    const input = document.getElementById('writingInput');
    const target = document.getElementById('currentWritingLetter');
    if (!input || !target) return;
    const inputValue = input.value;
    const targetValue = target.innerText;
    if (inputValue === targetValue) {
        showFeedback('✅ Correct!', 'success');
        markLetterViewed(targetValue);
    } else {
        showFeedback(`❌ Try again. The letter is ${targetValue}`, 'error');
    }
}

function nextWritingLetter() {
    if (!window.arabicLearningData || !window.arabicLearningData.letters) return;
    const letters = window.arabicLearningData.letters;
    const current = document.getElementById('currentWritingLetter');
    if (!current) return;
    const currentLetter = current.innerText;
    let nextIndex = (letters.findIndex(l => l.letter === currentLetter) + 1) % letters.length;
    current.innerText = letters[nextIndex].letter;
    const input = document.getElementById('writingInput');
    if (input) {
        input.value = '';
        input.focus();
    }
}

// ===== WORDS SECTION =====
function renderWords() {
    const container = document.getElementById('wordsGrid');
    if (!container || !window.arabicLearningData || !window.arabicLearningData.words) return;
    
    filteredWords = [...window.arabicLearningData.words];
    const category = document.getElementById('wordCategory')?.value || 'all';
    if (category !== 'all') {
        filteredWords = filteredWords.filter(w => w.category === category);
    }
    const searchTerm = document.getElementById('wordSearch')?.value.toLowerCase() || '';
    if (searchTerm) {
        filteredWords = filteredWords.filter(w => 
            w.arabic.includes(searchTerm) || 
            w.meaning.toLowerCase().includes(searchTerm) ||
            w.translit.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = '';
    if (filteredWords.length === 0) {
        container.innerHTML = '<div class="error-message">No words found</div>';
        return;
    }
    
    filteredWords.forEach((word, index) => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.onclick = () => showWordDetails(word, index);
        const isViewed = viewedWords.includes(word.arabic);
        card.innerHTML = `
            <div class="word-arabic">${word.arabic}</div>
            <div class="word-meaning">${word.meaning}</div>
            <div class="word-category">${word.category}</div>
            ${isViewed ? '<span class="viewed-badge-small">✓</span>' : ''}
        `;
        container.appendChild(card);
    });
}

function showWordDetails(word, index) {
    markWordViewed(word.arabic);
    currentWordIndex = index;
    const flashcard = document.getElementById('wordFlashcard');
    const flashcardArabic = document.getElementById('flashcardArabic');
    const flashcardTranslit = document.getElementById('flashcardTranslit');
    const flashcardMeaning = document.getElementById('flashcardMeaning');
    const flashcardExample = document.getElementById('flashcardExample');
    if (flashcardArabic) flashcardArabic.innerText = word.arabic;
    if (flashcardTranslit) flashcardTranslit.innerText = word.translit;
    if (flashcardMeaning) flashcardMeaning.innerText = word.meaning;
    if (flashcardExample) flashcardExample.innerText = word.example || '';
    if (flashcard) flashcard.style.display = 'block';
    renderWords();
}

function closeFlashcard() {
    const flashcard = document.getElementById('wordFlashcard');
    if (flashcard) flashcard.style.display = 'none';
}

function nextWord() {
    if (filteredWords.length === 0) return;
    currentWordIndex = (currentWordIndex + 1) % filteredWords.length;
    const word = filteredWords[currentWordIndex];
    const flashcardArabic = document.getElementById('flashcardArabic');
    const flashcardTranslit = document.getElementById('flashcardTranslit');
    const flashcardMeaning = document.getElementById('flashcardMeaning');
    const flashcardExample = document.getElementById('flashcardExample');
    if (flashcardArabic) flashcardArabic.innerText = word.arabic;
    if (flashcardTranslit) flashcardTranslit.innerText = word.translit;
    if (flashcardMeaning) flashcardMeaning.innerText = word.meaning;
    if (flashcardExample) flashcardExample.innerText = word.example || '';
}

function previousWord() {
    if (filteredWords.length === 0) return;
    currentWordIndex = (currentWordIndex - 1 + filteredWords.length) % filteredWords.length;
    const word = filteredWords[currentWordIndex];
    const flashcardArabic = document.getElementById('flashcardArabic');
    const flashcardTranslit = document.getElementById('flashcardTranslit');
    const flashcardMeaning = document.getElementById('flashcardMeaning');
    const flashcardExample = document.getElementById('flashcardExample');
    if (flashcardArabic) flashcardArabic.innerText = word.arabic;
    if (flashcardTranslit) flashcardTranslit.innerText = word.translit;
    if (flashcardMeaning) flashcardMeaning.innerText = word.meaning;
    if (flashcardExample) flashcardExample.innerText = word.example || '';
}

function filterWords() {
    renderWords();
}

// ===== PHRASES SECTION =====
function renderPhrases() {
    const container = document.getElementById('phrasesList');
    if (!container || !window.arabicLearningData || !window.arabicLearningData.phrases) return;
    
    let phrases = [...window.arabicLearningData.phrases];
    const searchTerm = document.getElementById('phraseSearch')?.value.toLowerCase() || '';
    if (searchTerm) {
        phrases = phrases.filter(p => 
            p.arabic.includes(searchTerm) || 
            p.meaning.toLowerCase().includes(searchTerm) ||
            p.translit.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = '';
    if (phrases.length === 0) {
        container.innerHTML = '<div class="error-message">No phrases found</div>';
        return;
    }
    
    phrases.forEach(phrase => {
        const card = document.createElement('div');
        card.className = 'phrase-card';
        card.onclick = () => markPhraseViewed(phrase.arabic);
        const isViewed = viewedPhrases.includes(phrase.arabic);
        card.innerHTML = `
            <div class="phrase-arabic-large">${phrase.arabic}</div>
            <div class="phrase-translit">${phrase.translit}</div>
            <div class="phrase-meaning-large">${phrase.meaning}</div>
            <div class="phrase-usage">${phrase.usage}</div>
            ${isViewed ? '<span class="viewed-badge-small">✓</span>' : ''}
        `;
        container.appendChild(card);
    });
}

// ===== SENTENCES SECTION =====
function renderSentences() {
    const container = document.getElementById('sentencesGrid');
    if (!container || !window.arabicLearningData || !window.arabicLearningData.sentences) return;
    
    let sentences = [...window.arabicLearningData.sentences];
    const type = document.getElementById('sentenceType')?.value || 'all';
    if (type !== 'all') {
        sentences = sentences.filter(s => s.type === type);
    }
    
    container.innerHTML = '';
    if (sentences.length === 0) {
        container.innerHTML = '<div class="error-message">No sentences found</div>';
        return;
    }
    
    sentences.forEach(sentence => {
        const card = document.createElement('div');
        card.className = 'sentence-card';
        card.innerHTML = `
            <div class="sentence-arabic">${sentence.arabic}</div>
            <div class="sentence-translit">${sentence.translit}</div>
            <div class="sentence-meaning">${sentence.meaning}</div>
            <div class="sentence-type">${sentence.type}</div>
        `;
        container.appendChild(card);
    });
}

function filterSentences() {
    renderSentences();
}

// ===== CONVERSATIONS SECTION =====
function renderConversations() {
    const container = document.getElementById('conversationDialogue');
    if (!container || !window.arabicLearningData || !window.arabicLearningData.conversations) return;
    
    const topic = document.getElementById('conversationTopic')?.value || 'greeting';
    const conversation = window.arabicLearningData.conversations.find(c => c.topic === topic);
    if (!conversation) return;
    
    currentConversationLines = conversation.lines;
    currentConversationIndex = 0;
    markConversationViewed(topic);
    renderConversationLines();
}

function renderConversationLines() {
    const container = document.getElementById('conversationDialogue');
    if (!container) return;
    container.innerHTML = '';
    currentConversationLines.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = `conversation-line ${line.speaker === 'A' ? 'speaker-a' : 'speaker-b'}`;
        lineDiv.onclick = () => setPracticeLine(line, index);
        lineDiv.innerHTML = `
            <div class="speaker-label">${line.speaker === 'A' ? '👤 Person A' : '👥 Person B'}</div>
            <div class="conversation-arabic">${line.arabic}</div>
            <div class="conversation-translit">${line.translit}</div>
            <div class="conversation-meaning">${line.meaning}</div>
            ${index === currentConversationIndex ? '<span class="current-line">▶ Current</span>' : ''}
        `;
        container.appendChild(lineDiv);
    });
}

function setPracticeLine(line, index) {
    currentPracticeLine = line;
    currentConversationIndex = index;
    const roleSpan = document.getElementById('currentRole');
    const practiceLine = document.getElementById('practiceLine');
    const practiceInput = document.getElementById('practiceInput');
    const practiceFeedback = document.getElementById('practiceFeedback');
    if (roleSpan) roleSpan.innerText = `Person ${line.speaker}`;
    if (practiceLine) practiceLine.innerText = line.arabic + ' - ' + line.meaning;
    if (practiceInput) practiceInput.value = '';
    if (practiceFeedback) practiceFeedback.innerHTML = '';
    renderConversationLines();
}

function checkPractice() {
    if (!currentPracticeLine) {
        showFeedback('Select a line to practice first', 'error');
        return;
    }
    const userInput = document.getElementById('practiceInput');
    const practiceFeedback = document.getElementById('practiceFeedback');
    if (!userInput || !practiceFeedback) return;
    const userAnswer = userInput.value.trim();
    const correct = currentPracticeLine.arabic;
    if (userAnswer === correct) {
        practiceFeedback.innerHTML = '✅ Perfect!';
        practiceFeedback.className = 'practice-feedback success';
        setTimeout(() => {
            if (currentConversationIndex < currentConversationLines.length - 1) {
                setPracticeLine(currentConversationLines[currentConversationIndex + 1], currentConversationIndex + 1);
            } else {
                showFeedback('🎉 Conversation completed!', 'success');
            }
        }, 1500);
    } else {
        practiceFeedback.innerHTML = `❌ Try again. The correct phrase is: ${correct}`;
        practiceFeedback.className = 'practice-feedback error';
    }
}

function loadConversation(topic) {
    renderConversations();
}

function shuffleConversation() {
    const topics = ['greeting', 'introduction', 'family', 'food', 'prayer', 'quran', 'daily', 'market'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const select = document.getElementById('conversationTopic');
    if (select) select.value = randomTopic;
    renderConversations();
}

// ===== QURAN DICTIONARY SECTION =====
async function loadQuranDictionary() {
    try {
        const response = await fetch('data/juz-ammah-words.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        if (!text.trim()) throw new Error('JSON file is empty');
        quranDictionaryWords = JSON.parse(text);
        console.log(`Loaded ${quranDictionaryWords.length} Qur'an dictionary words`);
        renderQuranDictionary();
        updateQuranProgress();
    } catch (error) {
        console.error('Error loading Qur\'an dictionary:', error);
        const grid = document.getElementById('quranDictionaryGrid');
        if (grid) {
            grid.innerHTML = `<div class="error-message">Failed to load dictionary. Make sure the file exists at data/juz-ammah-words.json and contains valid JSON.</div>`;
        }
    }
}

function renderQuranDictionary() {
    const container = document.getElementById('quranDictionaryGrid');
    if (!container) return;

    const searchTerm = document.getElementById('quranSearch')?.value.toLowerCase() || '';
    const juzFilter = document.getElementById('quranJuzFilter')?.value || 'all';

    filteredQuranWords = quranDictionaryWords.filter(word => {
        if (juzFilter !== 'all' && word.juz_first && word.juz_first.toString() !== juzFilter) return false;
        if (searchTerm) {
            return (word.arabic && word.arabic.includes(searchTerm)) ||
                   (word.translit && word.translit.toLowerCase().includes(searchTerm)) ||
                   (word.meaning && word.meaning.toLowerCase().includes(searchTerm)) ||
                   (word.root && word.root.toLowerCase().includes(searchTerm));
        }
        return true;
    });

    if (filteredQuranWords.length === 0) {
        container.innerHTML = '<div class="error-message">No words match your search.</div>';
        return;
    }

    container.innerHTML = '';
    filteredQuranWords.forEach(word => {
        const isViewed = viewedWords.includes(word.arabic);
        const card = document.createElement('div');
        card.className = 'quran-word-card';
        card.onclick = () => showQuranWordDetails(word);
        card.innerHTML = `
            <div class="quran-word-arabic">${word.arabic}</div>
            <div class="quran-word-meaning">${word.meaning}</div>
            <div class="quran-word-translit">${word.translit}</div>
            <div class="quran-word-meta">
                ${word.root ? `<span class="quran-root">📖 ${word.root}</span>` : ''}
                ${word.juz_first ? `<span class="quran-juz">📜 Juz ${word.juz_first}</span>` : ''}
            </div>
            ${isViewed ? '<span class="viewed-badge-small">✓</span>' : ''}
        `;
        container.appendChild(card);
    });
}

function filterQuranDictionary() {
    renderQuranDictionary();
}

function showQuranWordDetails(word) {
    markQuranWordViewed(word.arabic);
    const modal = document.createElement('div');
    modal.className = 'letter-modal';
    modal.innerHTML = `
        <div class="letter-modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">✕</button>
            <div class="letter-modal-header">
                <div class="letter-modal-arabic">${word.arabic}</div>
                <div class="letter-modal-name">${word.translit} (${word.meaning})</div>
            </div>
            <div class="letter-modal-body">
                <div class="letter-detail-item">
                    <span class="detail-label">Root:</span>
                    <span class="detail-value">${word.root || '—'}</span>
                </div>
                <div class="letter-detail-item">
                    <span class="detail-label">Juz:</span>
                    <span class="detail-value">${word.juz_first || '—'}</span>
                </div>
                <div class="letter-detail-item">
                    <span class="detail-label">Usage in Qur'an:</span>
                    <span class="detail-value">Found in Juz 'Amma</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function markQuranWordViewed(wordArabic) {
    if (!viewedWords.includes(wordArabic)) {
        viewedWords.push(wordArabic);
        saveLearningProgress();
        renderQuranDictionary();
        updateQuranProgress();
    }
}

function updateQuranProgress() {
    if (!quranDictionaryWords.length) return;
    const total = quranDictionaryWords.length;
    const viewedCount = viewedWords.filter(w => quranDictionaryWords.some(q => q.arabic === w)).length;
    const progressPercent = (viewedCount / total) * 100;
    const quranProgressBar = document.getElementById('quranProgress');
    const quranCountSpan = document.getElementById('quranCount');
    if (quranProgressBar) quranProgressBar.style.width = progressPercent + '%';
    if (quranCountSpan) quranCountSpan.innerText = `${viewedCount}/${total}`;
}

// ===== VIDEOS SECTION =====
function renderVideos() {
    const container = document.getElementById('videoGrid');
    if (!container) return;

    const videoNames = [
        "am-ill", "anyway", "are", "explain-to-me", "go-ahead", "have-you-eaten",
        "have-youfinished", "listen-to-me", "love-for-sake-of-Allah", "may-Allah-cure-you",
        "no-am-single", "today", "what-are-you-doing-now", "am-learnig", "dont-worry",
        "how-is-weather-today", "how-ols-are-you", "don't-care", "i-feel-tired", "i-have-changed-my-mind",
        "i-slept", "i-want-to-eat", "tell-me", "what's-your-name", "are-hungry", "do-love-me",
        "have-confidence-in-yourself", "i-love-you-so-much", "i-miss-you", "i-prayed", "what-did-you-say",
        "whatever", "am-happy-to-meet-you", "do-you-love", "i-feel-angry", "i-feel-happy", "i-feel-pain",
        "i-feel-scared", "i-was-late", "just-as-you-mentioned", "let-us-meet-up", "yes-no",
        "am-in-a-rush", "am-thinking-about-you", "how-did-this-happen", "i-seek-permission",
        "i-will-help-you", "make-sure", "seek-permission", "where-do-yo-work", "am-at-the-gym",
        "am-lonely", "are-you-interested", "be-patient", "employed", "go-out", "kind",
        "this-is-prohibited", "try-again", "welcome", "what's-the-solution", "collaboration",
        "i-bought", "one-moment", "work-hard", "you-are-better-than-me", "am-sorry",
        "i-don't-understand", "oh-Allah-make-us-reach-ramadhan", "strive", "ungrateful",
        "don't-give-up", "grateful", "have-you-had-breakfast", "he-has-called-the-adhaan",
        "optimistic", "pessimistic", "time-is-money", "what-do-mean", "arabic-numbers",
        "can-you-hear-me", "don't-be-arrogant", "enjoy-your-time", "excuse-me", "have-you-had-dinner",
        "have-you-had-lunch", "i-like-it", "long-sighted", "short-sighted", "this-is-awesome",
        "am-busy", "am-sleepy", "am-thirsty", "am-travelling", "thanks-for-the-advice",
        "this-is-difficult", "this-is-important", "this-is-pleasant-news", "what-did-you-drink",
        "what-did-you-eat", "am-at-ease", "am-from", "am-full-up", "am-worried", "don't-come",
        "don't-go", "i-arrived", "i-woke-up-late", "where-are-you-from", "where-did-you-go",
        "you-are-handsome", "am-ready", "are-you-fasting", "eat", "have-you-broken-your-fast",
        "i-forgot", "i-slept-late", "beard", "i-feel", "i-have-prayed", "no-worries",
        "you-are-beautiful", "am-tired", "call-me", "don't-be-scared", "shut-up", "thank-you",
        "where-were-you", "all-because-of-you", "arrogant", "lazy", "please", "understanding",
        "what's-your-opinion", "whee-are-you", "am-at-the-market", "am-hesitant", "am-late",
        "have-you-had-sahoor", "this-is-a-disaster", "where-do-you-work", "you-made-me-late",
        "am-joking", "don't-threaten-me", "my-life", "oh-my-eyes", "oh-my-sweetheart",
        "will-you-come-with-me", "yes-unfortunately", "sure", "am-waiting-for-you",
        "don't-be-late", "don't-be-sad", "don't-judge-me", "don't-wait", "no-need-to-argue",
        "thanks-for-reminding-me", "thanks-for-visiting", "what-are-you-watching", "what-do-you-want",
        "don't-disturb-me", "don't-procastinate", "enjoy-your-day", "enjoy-your-holiday",
        "he-is-ignorant", "he-is-stingy", "how-much-do-you-love-me", "sit-down", "stand-up",
        "where-are-you", "counting-numbers", "days-of-the-week", "don't-waste-my-time",
        "do-you-have-children", "go", "go-go", "i-have-children", "sit-next-to-me",
        "i-don't-understand-arabic", "Learn-Arabic-from-scratch-13", "tajweed",
        "Arabic-Conversations", "Learn-Arabic-from-scratch-12", "Learn-Arabic-from-scratch-11",
        "memories", "let-me-think", "swimming-pool", "the-weather", "this-is-impossible",
        "weather-conditions", "well-done", "he-is", "help-me", "how-are-you", "how-much-is-this",
        "of-course-not", "sure!", "trust-me", "what-are-you-doing", "what-are-you-reading",
        "what-are-you-writing", "this-is-enough", "Arabic-Alphabet-Pronunciation", "Arabic-Alphabets"
    ];

    for (let i = 1; i <= 59; i++) {
        videoNames.push(`quiz-${i}`);
    }
    const uniqueNames = [...new Set(videoNames)];

    const fragment = document.createDocumentFragment();
    uniqueNames.forEach(name => {
        const card = document.createElement('div');
        card.className = 'video-card';
        const title = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const description = `Learn Arabic: ${name.replace(/-/g, ' ')}`;
        const videoUrl = `videos/${name}.mp4`;
        const videoElem = document.createElement('video');
        videoElem.controls = true;
        videoElem.preload = 'none';
        videoElem.innerHTML = `<source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.`;
        const infoDiv = document.createElement('div');
        infoDiv.className = 'video-info';
        infoDiv.innerHTML = `<div class="video-title">${title}</div><div class="video-desc">${description}</div>`;
        card.appendChild(videoElem);
        card.appendChild(infoDiv);
        fragment.appendChild(card);
    });
    container.innerHTML = '';
    container.appendChild(fragment);
}

// ===== QUIZ SECTION =====
function loadRandomQuizQuestion() {
    if (!window.arabicLearningData || !window.arabicLearningData.allQuizQuestions) {
        showFeedback('Quiz data not available', 'error');
        return;
    }
    const allQuestions = window.arabicLearningData.allQuizQuestions;
    if (!allQuestions || allQuestions.length === 0) return;
    currentQuizQuestions = allQuestions;
    currentQuizIndex = Math.floor(Math.random() * allQuestions.length);
    displayQuizQuestion(allQuestions[currentQuizIndex]);
}

function loadQuizByTopic(topic) {
    if (!window.arabicLearningData || !window.arabicLearningData.quizQuestions) return;
    const allQuestions = window.arabicLearningData.quizQuestions;
    if (topic === 'all') {
        currentQuizQuestions = [...allQuestions];
    } else {
        currentQuizQuestions = allQuestions.filter(q => q.category === topic);
    }
    if (currentQuizQuestions.length === 0) {
        const quizQuestion = document.getElementById('quizQuestion');
        if (quizQuestion) quizQuestion.innerText = 'No questions available for this topic';
        return;
    }
    currentQuizQuestions = shuffleArray(currentQuizQuestions);
    currentQuizIndex = 0;
    displayQuizQuestion(currentQuizQuestions[0]);
}

function displayQuizQuestion(question) {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizExplanation = document.getElementById('quizExplanation');
    const optionsDiv = document.getElementById('quizOptions');
    const inputGroup = document.getElementById('quizInputGroup');
    const quizCounter = document.getElementById('quizCounter');
    if (quizQuestion) quizQuestion.innerText = question.arabicQuestion || question.question;
    if (quizFeedback) quizFeedback.innerHTML = '';
    if (quizExplanation) quizExplanation.innerHTML = '';
    if (question.type === 'multiple' && question.options) {
        if (optionsDiv) optionsDiv.style.display = 'grid';
        if (inputGroup) inputGroup.style.display = 'none';
        const shuffledOptions = shuffleArray([...question.options]);
        let optionsHtml = '';
        shuffledOptions.forEach(option => {
            optionsHtml += `<button class="quiz-option-btn" onclick="checkQuizOption('${option.replace(/'/g, "\\'")}', '${question.answer.replace(/'/g, "\\'")}')">${option}</button>`;
        });
        if (optionsDiv) optionsDiv.innerHTML = optionsHtml;
    } else {
        if (optionsDiv) optionsDiv.style.display = 'none';
        if (inputGroup) inputGroup.style.display = 'flex';
        const textInput = document.getElementById('quizTextInput');
        if (textInput) textInput.value = '';
    }
    if (quizCounter) {
        quizCounter.innerText = `Question ${currentQuizIndex + 1} of ${currentQuizQuestions.length}`;
    }
}

function checkQuizOption(selected, correct) {
    const options = document.querySelectorAll('.quiz-option-btn');
    const isCorrect = selected === correct;
    options.forEach(opt => {
        opt.disabled = true;
        if (opt.innerText === correct) {
            opt.classList.add('correct');
        } else if (opt.innerText === selected && !isCorrect) {
            opt.classList.add('wrong');
        }
    });
    const quizFeedback = document.getElementById('quizFeedback');
    const quizExplanation = document.getElementById('quizExplanation');
    if (isCorrect) {
        quizCorrectCount++;
        if (quizFeedback) {
            quizFeedback.innerHTML = '✅ Correct!';
            quizFeedback.className = 'quiz-feedback-large correct';
        }
    } else {
        quizWrongCount++;
        if (quizFeedback) {
            quizFeedback.innerHTML = '❌ Wrong!';
            quizFeedback.className = 'quiz-feedback-large wrong';
        }
    }
    const question = currentQuizQuestions[currentQuizIndex];
    if (quizExplanation && question && question.explanation) {
        quizExplanation.innerHTML = question.explanation;
    }
    updateQuizStats();
    setTimeout(() => {
        nextQuizQuestion();
    }, 2000);
}

function checkQuizTextAnswer() {
    const userInput = document.getElementById('quizTextInput');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizExplanation = document.getElementById('quizExplanation');
    if (!userInput || !quizFeedback) return;
    const userAnswer = userInput.value.trim().toLowerCase();
    const question = currentQuizQuestions[currentQuizIndex];
    const correct = question.answer.toLowerCase();
    const isCorrect = userAnswer === correct;
    if (isCorrect) {
        quizCorrectCount++;
        quizFeedback.innerHTML = '✅ Correct!';
        quizFeedback.className = 'quiz-feedback-large correct';
    } else {
        quizWrongCount++;
        quizFeedback.innerHTML = `❌ Wrong! Correct answer: ${question.answer}`;
        quizFeedback.className = 'quiz-feedback-large wrong';
    }
    if (quizExplanation && question.explanation) {
        quizExplanation.innerHTML = question.explanation;
    }
    updateQuizStats();
    setTimeout(() => {
        nextQuizQuestion();
    }, 2000);
}

function nextQuizQuestion() {
    if (currentQuizQuestions.length > 0) {
        currentQuizIndex = (currentQuizIndex + 1) % currentQuizQuestions.length;
        displayQuizQuestion(currentQuizQuestions[currentQuizIndex]);
    } else {
        loadRandomQuizQuestion();
    }
}

function updateQuizStats() {
    const total = quizCorrectCount + quizWrongCount;
    const score = total > 0 ? Math.round((quizCorrectCount / total) * 100) : 0;
    const correctSpan = document.getElementById('quizCorrectCount');
    const wrongSpan = document.getElementById('quizWrongCount');
    const scoreSpan = document.getElementById('quizScore');
    if (correctSpan) correctSpan.innerText = quizCorrectCount;
    if (wrongSpan) wrongSpan.innerText = quizWrongCount;
    if (scoreSpan) scoreSpan.innerText = score + '%';
}

// ===== SEARCH AND FILTER =====
function setupSearchListeners() {
    // Most listeners are attached in attachEventListeners()
    // This function is kept for compatibility
}

// ===== UTILITY FUNCTIONS =====
function showErrorMessage() {
    const containers = ['lettersGrid', 'wordsGrid', 'phrasesList', 'sentencesGrid', 'conversationDialogue'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '<div class="error-message">Failed to load data. Please refresh the page.</div>';
        }
    });
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-toast ${type}`;
    feedback.innerText = message;
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ===== EXPORT FUNCTIONS TO GLOBAL SCOPE =====
window.switchLearningTab = switchLearningTab;
window.checkWriting = checkWriting;
window.nextWritingLetter = nextWritingLetter;
window.practiceLetter = practiceLetter;
window.showLetterDetails = showLetterDetails;
window.closeFlashcard = closeFlashcard;
window.nextWord = nextWord;
window.previousWord = previousWord;
window.filterWords = filterWords;
window.filterSentences = filterSentences;
window.loadConversation = loadConversation;
window.shuffleConversation = shuffleConversation;
window.setPracticeLine = setPracticeLine;
window.checkPractice = checkPractice;
window.loadRandomQuizQuestion = loadRandomQuizQuestion;
window.loadQuizByTopic = loadQuizByTopic;
window.checkQuizOption = checkQuizOption;
window.checkQuizTextAnswer = checkQuizTextAnswer;
window.nextQuizQuestion = nextQuizQuestion;
window.filterQuranDictionary = filterQuranDictionary;
window.showQuranWordDetails = showQuranWordDetails;
window.renderVideos = renderVideos;

console.log('✅ Arabic learning module ready!');