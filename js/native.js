// Bridges to Android when the app runs inside the Capacitor shell.
// In a normal browser NATIVE is false and nothing here is used.
const Cap = window.Capacitor;
export const NATIVE = !!Cap?.isNativePlatform?.() && typeof Cap.registerPlugin === 'function';
// a plugin that cannot be reached must never stop the app from starting
const plugin = (name) => {
  if (!NATIVE) return null;
  try { return Cap.registerPlugin(name); } catch (e) { console.error('plugin ' + name, e); return null; }
};

// Links that leave the app (share links, email confirmations) point at the website.
export const WEB_URL = 'https://mantra-jaap-delta.vercel.app/';
// Google sign-in returns to the app through this address (registered in AndroidManifest.xml).
export const AUTH_CALLBACK = 'com.sjpt.mantrajaap://login-callback';

const Speech = plugin('SpeechRecognition');
const AppPlugin = plugin('App');
const Browser = plugin('Browser');
const SharePlugin = plugin('Share');
const KeepAwake = plugin('KeepAwake');
const AdMob = plugin('AdMob');

export const nativeShare = (data) => SharePlugin.share({ ...data, dialogTitle: data.title });
export const onBackButton = (fn) => AppPlugin?.addListener('backButton', fn);
export const exitApp = () => AppPlugin?.exitApp();
export const onAppLink = (fn) => AppPlugin?.addListener('appUrlOpen', ({ url }) => fn(url));
export const openExternal = (url) => Browser.open({ url });
export const closeExternal = () => Browser.close().catch(() => {});
export const nativeKeepAwake = (on) => (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep()).catch(() => {});

// ----- ads: one banner at the bottom of the home screen -----
let adId = '', adReady = false, adMade = false, adShown = false, adWanted = false, adPrivacy = false;
let adQueue = Promise.resolve();
const isTestAd = (id) => id.startsWith('ca-app-pub-3940256099942544/');

/** Asks for consent where the law requires it (EEA/UK), then allows the banner. */
export async function initAds(bannerId, onHeight) {
  if (!AdMob || !bannerId) return;
  adId = bannerId;
  try {
    await AdMob.initialize({ initializeForTesting: isTestAd(adId) });
    let info = await AdMob.requestConsentInfo();
    if (info.status === 'REQUIRED' && info.isConsentFormAvailable) info = await AdMob.showConsentForm();
    adPrivacy = info.privacyOptionsRequirementStatus === 'REQUIRED';
    if (!info.canRequestAds) return;
    AdMob.addListener('bannerAdSizeChanged', (s) => onHeight(s.height || 0));
    AdMob.addListener('bannerAdFailedToLoad', () => onHeight(0));
    adReady = true;
    setAdVisible(adWanted);
  } catch (e) { console.error('ads', e); }
}
/** Show or hide the banner (hidden while chanting and while a panel is open). */
export function setAdVisible(on) {
  adWanted = on;
  if (!adReady) return;
  adQueue = adQueue.then(async () => {
    if (adWanted && !adShown) {
      if (!adMade) await AdMob.showBanner({ adId, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER', margin: 0, isTesting: isTestAd(adId) });
      else await AdMob.resumeBanner();
      adMade = adShown = true;
    } else if (!adWanted && adShown) {
      await AdMob.hideBanner();
      adShown = false;
    }
  }).catch((e) => console.error('ads', e));
}
/** Users in regions with privacy laws must be able to change their ad choices. */
export const adPrivacyNeeded = () => adPrivacy;
export const showAdPrivacy = () => AdMob?.showPrivacyOptionsForm().catch((e) => console.error('ads', e));

/**
 * Android speech recognition with live partial results.
 * Android's recogniser stops at every pause, so it is restarted for as long as
 * listening is wanted. Each restart is a new session whose words start empty.
 */
export async function startNativeSpeech(lang, { onSession, onWords, onSpeaking, onError }) {
  const { available } = await Speech.available();
  if (!available) throw Object.assign(new Error('Speech recognition is not available'), { code: 'unavailable' });
  let perm = await Speech.checkPermissions();
  if (perm.speechRecognition !== 'granted') perm = await Speech.requestPermissions();
  if (perm.speechRecognition !== 'granted') throw Object.assign(new Error('Microphone permission denied'), { code: 'not-allowed' });

  let wanted = true;
  let restart = 0;          // pending restart timer
  let lastEvent = Date.now();
  const again = (ms) => { clearTimeout(restart); restart = setTimeout(begin, ms); };

  const handles = [
    await Speech.addListener('partialResults', ({ matches }) => {
      lastEvent = Date.now();
      if (wanted) onWords(((matches && matches[0]) || '').split(/\s+/).filter(Boolean));
    }),
    await Speech.addListener('listeningState', ({ status }) => {
      lastEvent = Date.now();
      onSpeaking(status === 'started');
      // wait briefly so the final result of this session arrives before restarting
      if (status === 'stopped' && wanted) again(800);
    }),
  ];

  async function begin() {
    restart = 0;
    if (!wanted) return;
    onSession();
    lastEvent = Date.now();
    try {
      await Speech.start({ language: lang, maxResults: 1, partialResults: true, popup: false });
    } catch (e) {
      if (!wanted) return;
      if (/permission/i.test(e?.message || '')) { onError('not-allowed'); return; }
      again(800);
    }
  }

  // silence and recogniser errors end a session without any event: notice and restart
  const watch = setInterval(async () => {
    if (!wanted || restart) return;
    try {
      const { listening } = await Speech.isListening();
      if (!listening && Date.now() - lastEvent > 1000) again(100);
    } catch (e) {}
  }, 1000);

  begin();
  return {
    async stop() {
      wanted = false;
      clearTimeout(restart);
      clearInterval(watch);
      handles.forEach((h) => h.remove());
      try { await Speech.stop(); } catch (e) {}
    },
  };
}
