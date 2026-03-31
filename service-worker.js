// ===== SAMKRAN ILM PROFESSIONAL SERVICE WORKER =====
// Version: 1.0.5
// Added all video files to cache

const CACHE_VERSION = "v1.0.5";
const CACHE_NAME = `yusuf-${CACHE_VERSION}`;

// Static assets that are guaranteed to exist in your project
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/names.html",
  "/arabic.html",
  "/juzAmma.html",
  "/dua-dhikr.html",
  "/css/style.css",
  "/js/main.js",
  "/js/namesData.js",
  "/js/arabic-data.js",
  "/js/arabic.js",
  "data/juz-ammah-words.json",
  "/js/juzAmmaData.js",
  "js/juzAmmahTranslations.js",
  "/js/juzAmma.js",
  "/manifest.json",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-144.png",
  "/icons/icon-152.png",
  "/icons/icon-192.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png"
];

// Audio files to cache (Juz 'Amma surahs) – optional, they will be cached on-demand
const AUDIO_ASSETS = [
  "/audio/Abasa.mp3",
  "/audio/A-Dwuhaa.mp3",
  "/audio/Al-Aala.mp3",
  "/audio/Al-Aala-1.mp3",
  "/audio/Al-Adiyah.mp3",
  "/audio/Al-Alaq.mp3",
  "/audio/Al-Asr.mp3",
  "/audio/A-Layl.mp3",
  "/audio/Al-Balad.mp3",
  "/audio/Al-Balad-1.mp3",
  "/audio/Al-Bayyinah.mp3",
  "/audio/Al-Burudji.mp3",
  "/audio/Al-Fajri.mp3",
  "/audio/Al-Falaq.mp3",
  "/audio/Al-Fatihah.mp3",
  "/audio/Al-Fiil.mp3",
  "/audio/Al-Ghashiyah.mp3",
  "/audio/Al-Ghashiyah-1.mp3",
  "/audio/Al-Humazah.mp3",
  "/audio/Al-Ikhlas.mp3",
  "/audio/Al-Infitwaar.mp3",
  "/audio/Al-Inshiqaq.mp3",
  "/audio/Al-Inshiqaq-1.mp3",
  "/audio/Al-Kawthar.mp3",
  "/audio/Al-Masad.mp3",
  "/audio/Al-Mauun.mp3",
  "/audio/Al-Mutwafifin.mp3",
  "/audio/Al-Mutwafifin-1.mp3",
  "/audio/Al-Qaariah.mp3",
  "/audio/Al-Qadri.mp3",
  "/audio/Al-Quraysh.mp3",
  "/audio/A-Naas.mp3",
  "/audio/A-Naaziah.mp3",
  "/audio/A-Naba-u.mp3",
  "/audio/A-Nasr.mp3",
  "/audio/A-Shams.mp3",
  "/audio/A-Sharh.mp3",
  "/audio/A-Takwir.mp3",
  "/audio/At-Takaathur.mp3",
  "/audio/At-Tiin.mp3",
  "/audio/At-Twariq.mp3",
  "/audio/At-Twariq-1.mp3",
  "/audio/Az-Zilzalah.mp3"
];

// Video files – all your videos from the list (both .mp4 and .webm)
const VIDEO_ASSETS = [
  "/videos/Arabic-Alphabets.webm",
  "/videos/all-because-of-you.mp4",
  "/videos/am-at-ease.mp4",
  "/videos/am-at-the-gym.mp4",
  "/videos/am-at-the-market.mp4",
  "/videos/am-busy.mp4",
  "/videos/am-from.mp4",
  "/videos/am-full-up.mp4",
  "/videos/am-happy-to-meet-you.mp4",
  "/videos/am-hesitant.mp4",
  "/videos/am-ill.mp4",
  "/videos/am-in-a-rush.mp4",
  "/videos/am-joking.mp4",
  "/videos/am-late.mp4",
  "/videos/am-learnig.mp4",
  "/videos/am-lonely.mp4",
  "/videos/am-ready.mp4",
  "/videos/am-sleepy.mp4",
  "/videos/am-sorry.mp4",
  "/videos/am-thinking-about-you.mp4",
  "/videos/am-thirsty.mp4",
  "/videos/am-tired.mp4",
  "/videos/am-travelling.mp4",
  "/videos/am-waiting-for-you.mp4",
  "/videos/am-worried.mp4",
  "/videos/anyway.mp4",
  "/videos/arabic-numbers.mp4",
  "/videos/are-hungry.mp4",
  "/videos/are-you-fasting.mp4",
  "/videos/are-you-interested.mp4",
  "/videos/are.mp4",
  "/videos/arrogant.mp4",
  "/videos/ball.mp4",
  "/videos/be-patient.mp4",
  "/videos/beard.mp4",
  "/videos/call-me.mp4",
  "/videos/can-you-hear-me.mp4",
  "/videos/collaboration.mp4",
  "/videos/counting-numbers.mp4",
  "/videos/days-of-the-week.mp4",
  "/videos/do-love-me.mp4",
  "/videos/do-you-have-children.mp4",
  "/videos/do-you-love.mp4",
  "/videos/don't-be-arrogant.mp4",
  "/videos/don't-be-late.mp4",
  "/videos/don't-be-sad.mp4",
  "/videos/don't-be-scared.mp4",
  "/videos/don't-come.mp4",
  "/videos/don't-disturb-me.mp4",
  "/videos/don't-give-up.mp4",
  "/videos/don't-go.mp4",
  "/videos/don't-judge-me.mp4",
  "/videos/don't-procastinate.mp4",
  "/videos/don't-threaten-me.mp4",
  "/videos/don't-wait.mp4",
  "/videos/don't-waste-my-time.mp4",
  "/videos/dont-worry.mp4",
  "/videos/eat.mp4",
  "/videos/employed.mp4",
  "/videos/enjoy-your-day.mp4",
  "/videos/enjoy-your-holiday.mp4",
  "/videos/enjoy-your-time.mp4",
  "/videos/excuse-me.mp4",
  "/videos/explain-to-me.mp4",
  "/videos/go-ahead.mp4",
  "/videos/go-go.mp4",
  "/videos/go-out.mp4",
  "/videos/go.mp4",
  "/videos/grateful.mp4",
  "/videos/have-confidence-in-yourself.mp4",
  "/videos/have-you-broken-your-fast.mp4",
  "/videos/have-you-eaten.mp4",
  "/videos/have-you-had-breakfast.mp4",
  "/videos/have-you-had-dinner.mp4",
  "/videos/have-you-had-lunch.mp4",
  "/videos/have-you-had-sahoor.mp4",
  "/videos/have-youfinished.mp4",
  "/videos/he-has-called-the-adhaan.mp4",
  "/videos/he-is-ignorant.mp4",
  "/videos/he-is-stingy.mp4",
  "/videos/he-is.mp4",
  "/videos/help-me.mp4",
  "/videos/how-are-you.mp4",
  "/videos/how-did-this-happen.mp4",
  "/videos/how-is-weather-today.mp4",
  "/videos/how-much-do-you-love-me.mp4",
  "/videos/how-much-is-this.mp4",
  "/videos/how-ols-are-you.mp4",
  "/videos/i-arrived.mp4",
  "/videos/i-bought.mp4",
  "/videos/i-don't-care.mp4",
  "/videos/i-don't-understand-arabic.mp4",
  "/videos/i-don't-understand.mp4",
  "/videos/i-feel-angry.mp4",
  "/videos/i-feel-happy.mp4",
  "/videos/i-feel-pain.mp4",
  "/videos/i-feel-scared.mp4",
  "/videos/i-feel-tired.mp4",
  "/videos/i-feel.mp4",
  "/videos/i-forgot.mp4",
  "/videos/i-have-changed-my-mind.mp4",
  "/videos/i-have-children.mp4",
  "/videos/i-have-prayed.mp4",
  "/videos/i-like-it.mp4",
  "/videos/i-love-you-so-much.mp4",
  "/videos/i-miss-you.mp4",
  "/videos/i-prayed.mp4",
  "/videos/i-seek-permission.mp4",
  "/videos/i-slept-late.mp4",
  "/videos/i-slept.mp4",
  "/videos/i-want-to-eat.mp4",
  "/videos/i-was-late.mp4",
  "/videos/i-will-help-you.mp4",
  "/videos/i-woke-up-late.mp4",
  "/videos/just-as-you-mentioned.mp4",
  "/videos/kind.mp4",
  "/videos/lazy.mp4",
  "/videos/let-me-think.mp4",
  "/videos/let-us-meet-up.mp4",
  "/videos/listen-to-me.mp4",
  "/videos/long-sighted.mp4",
  "/videos/love-for-sake-of-Allah.mp4",
  "/videos/make-sure.mp4",
  "/videos/may-Allah-cure-you.mp4",
  "/videos/mosque.mp4",
  "/videos/my-life.mp4",
  "/videos/no-am-single.mp4",
  "/videos/no-need-to-argue.mp4",
  "/videos/no-worries.mp4",
  "/videos/of-course-not.mp4",
  "/videos/office.mp4",
  "/videos/oh-Allah-make-us-reach-ramadhan.mp4",
  "/videos/oh-my-eyes.mp4",
  "/videos/oh-my-sweetheart.mp4",
  "/videos/one-moment.mp4",
  "/videos/optimistic.mp4",
  "/videos/pessimistic.mp4",
  "/videos/please.mp4",
  "/videos/quiz-1.mp4",
  "/videos/quiz-10.mp4",
  "/videos/quiz-11.mp4",
  "/videos/quiz-12.mp4",
  "/videos/quiz-13.mp4",
  "/videos/quiz-14.mp4",
  "/videos/quiz-15.mp4",
  "/videos/quiz-16.mp4",
  "/videos/quiz-17.mp4",
  "/videos/quiz-18.mp4",
  "/videos/quiz-19.mp4",
  "/videos/quiz-2.mp4",
  "/videos/quiz-20.mp4",
  "/videos/quiz-21.mp4",
  "/videos/quiz-23.mp4",
  "/videos/quiz-24.mp4",
  "/videos/quiz-25.mp4",
  "/videos/quiz-29.mp4",
  "/videos/quiz-42.mp4",
  "/videos/quiz-43.mp4",
  "/videos/seek-permission.mp4",
  "/videos/short-sighted.mp4",
  "/videos/shut-up.mp4",
  "/videos/sit-down.mp4",
  "/videos/sit-next-to-me.mp4",
  "/videos/stand-up.mp4",
  "/videos/strive.mp4",
  "/videos/sure!.mp4",
  "/videos/sure.mp4",
  "/videos/swimming-pool.mp4",
  "/videos/tell-me.mp4",
  "/videos/thank-you.mp4",
  "/videos/thanks-for-reminding-me.mp4",
  "/videos/thanks-for-the-advice.mp4",
  "/videos/thanks-for-visiting.mp4",
  "/videos/the-weather.mp4",
  "/videos/this-is-a-disaster.mp4",
  "/videos/this-is-difficult.mp4",
  "/videos/this-is-enough.mp4",
  "/videos/this-is-important.mp4",
  "/videos/this-is-impossible.mp4",
  "/videos/this-is-pleasant-news.mp4",
  "/videos/this-is-prohibited.mp4",
  "/videos/time-is-money.mp4",
  "/videos/today.mp4",
  "/videos/trust-me.mp4",
  "/videos/try-again.mp4",
  "/videos/understanding.mp4",
  "/videos/ungrateful.mp4",
  "/videos/weather-conditions.mp4",
  "/videos/welcome.mp4",
  "/videos/well-done.mp4",
  "/videos/what's-the-solution.mp4",
  "/videos/what's-your-name.mp4",
  "/videos/what's-your-opinion.mp4",
  "/videos/what-are-you-doing-now.mp4",
  "/videos/what-are-you-doing.mp4",
  "/videos/what-are-you-reading.mp4",
  "/videos/what-are-you-watching.mp4",
  "/videos/what-are-you-writing.mp4",
  "/videos/what-did-you-drink.mp4",
  "/videos/what-did-you-eat.mp4",
  "/videos/what-did-you-say.mp4",
  "/videos/what-do-mean.mp4",
  "/videos/what-do-you-want.mp4",
  "/videos/whatever.mp4",
  "/videos/whee-are-you.mp4",
  "/videos/where-are-you-from.mp4",
  "/videos/where-are-you.mp4",
  "/videos/where-do-yo-work.mp4",
  "/videos/where-do-you-work.mp4",
  "/videos/where-were-you.mp4",
  "/videos/will-you-come-with-me.mp4",
  "/videos/work-hard.mp4",
  "/videos/yes-no.mp4",
  "/videos/yes-unfortunately.mp4",
  "/videos/you-are-beautiful.mp4",
  "/videos/you-are-better-than-me.mp4",
  "/videos/you-are-handsome.mp4",
  "/videos/you-made-me-late.mp4"
];

// Combine all assets (audio and video will be attempted, but may fail gracefully)
const ALL_ASSETS = [...STATIC_ASSETS, ...AUDIO_ASSETS, ...VIDEO_ASSETS];

// ===== INSTALL EVENT =====
self.addEventListener("install", (event) => {
  console.log(`🔄 Service Worker installing (${CACHE_VERSION})...`);
  
  // Force waiting service worker to become active immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("✅ Caching static assets...");
        // Use Promise.allSettled to avoid failing the whole install if one file is missing
        return Promise.allSettled(
          ALL_ASSETS.map(asset => 
            cache.add(asset).catch(err => {
              console.warn(`⚠️ Failed to cache ${asset}:`, err.message);
            })
          )
        );
      })
      .then(() => {
        console.log("✅ Service Worker installed successfully");
      })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker activating...");
  
  event.waitUntil(
    Promise.all([
      // Clean up old cache versions
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME && key.startsWith('yusuf-')) {
              console.log(`🗑️ Deleting old cache: ${key}`);
              return caches.delete(key);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// ===== FETCH EVENT =====
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // ===== AUDIO FILES CACHING STRATEGY =====
  if (url.pathname.includes("/audio/")) {
    event.respondWith(handleAudioRequest(event.request));
    return;
  }
  
  // ===== HTML FILES (Network First) =====
  if (url.pathname.endsWith(".html") || url.pathname === "/") {
    event.respondWith(handleHtmlRequest(event.request));
    return;
  }
  
  // ===== OTHER ASSETS (Cache First) =====
  event.respondWith(handleAssetRequest(event.request));
});

// Handle audio requests - Cache with network fallback
async function handleAudioRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache the response for next time - CLONE ONLY ONCE
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    console.warn('Audio fetch failed:', error);
    return new Response('Audio offline', { status: 503 });
  }
}

// Handle HTML requests - Network first, cache fallback
async function handleHtmlRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, update cache
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    // If offline, return cached version
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // If no cache, return a simple offline message (no external file dependency)
    return new Response(
      '<!DOCTYPE html><html><head><title>Offline</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#0f172a;color:#e2e8f0;font-family:sans-serif;text-align:center;padding:2rem;}</style></head><body><h1>📴 You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Handle other assets - Cache first, network fallback
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache for next time - CLONE ONLY ONCE
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    console.warn('Asset fetch failed:', error);
    return new Response('Asset offline', { status: 503 });
  }
}

// ===== BACKGROUND SYNC READY =====
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-progress") {
    console.log("🔄 Background sync triggered");
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  console.log("Syncing user progress...");
  // Implement IndexedDB sync here later
  return Promise.resolve();
}

// ===== PUSH NOTIFICATIONS READY =====
self.addEventListener("push", (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || "New notification",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/"
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || "Samkran Ilm", options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "/")
  );
});