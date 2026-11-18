// WalTrans developer settings. Edit this small file on GitHub (pencil icon), then Commit.
// Nothing here is secret: it is public once the app is hosted. Use addresses you are happy to publish.
window.WALTRANS_CONFIG = {
  // Where feedback goes. Fill in ONE of these (the first one filled in is used):
  feedbackEmail: '',      // e.g. 'name@example.com'  (opens the user's email app with the message ready)
  feedbackWhatsapp: '',   // e.g. '2567XXXXXXXX'      (international format, digits only)
  feedbackFormUrl: 'https://formspree.io/f/mgakazna',    // e.g. your Formspree link: 'https://formspree.io/f/xxxxxxxx'
  // If all three are empty and the app is on GitHub Pages, feedback opens a new GitHub Issue instead.

  // The link people receive when they tap "Share WalTrans". Leave empty to use the page's own address.
  appUrl: '',

  // Free online translator for 38 more languages (see SETUP-PROXY.txt). Paste your Cloudflare Worker address here,
  // for example 'https://waltrans-proxy.yourname.workers.dev'. Leave empty to switch it off.
  proxyUrl: 'https://waltrans-proxy.walwasatimo3.workers.dev',

  // Welcome screen: it shows only while the app is loading and adds NO waiting time (0). If you ever want it on screen
  // a little longer, put a number of milliseconds here (for example 800). Leave 0 for the fastest start.
  splashMinMs: 0,

  // Anonymous usage counts (how often the app is opened, installed and used; needs proxyUrl above). Set to false to switch off for everyone.
  stats: true
};
