WALTRANS v2: SETUP
==================

1. HOST IT (needed for install + offline use)
   Upload ALL files in this folder to GitHub Pages (or any HTTPS host).
   Open the link in Chrome on your phone, then tap "Install".

2. CONNECT SUNBIRD AI (free account), this is what makes Lusoga, Luganda,
   context translation, Explain and Luganda/Lusoga voice work.
   In the app: gear icon -> Connect Sunbird AI -> enter email + username +
   password -> "Create account". Next time just "Log in".
   Sunbird AI (https://sunbird.ai) is a Ugandan AI lab. Its docs list Lusoga
   (xog) for translation and speech-to-text, Luganda for translation,
   speech-to-text and text-to-speech.

3. OFFLINE PACK (optional, large)
   Gear icon -> Offline pack -> Download (use Wi-Fi). One on-device model
   (NLLB-200) covers every language in the app except Lusoga and the
   smaller Ugandan languages. Lusoga offline = phrasebook + everything you
   have translated or corrected before (the app remembers it).

IF LOGIN SAYS IT "COULDN'T REACH SUNBIRD"
   Your browser may be blocking direct calls (CORS). Deploy proxy-worker.js
   as a free Cloudflare Worker and paste its URL into
   Settings -> Advanced -> API address. (Untested; Sunbird's docs don't say
   whether browsers may call the API directly.)

FILES
   index.html        the app
   sw.js             offline caching of the app
   nllb-worker.js    runs the optional offline model
   manifest.json, icon-*.png, icon.svg
   proxy-worker.js   optional CORS proxy
