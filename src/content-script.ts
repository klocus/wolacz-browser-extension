// This content script will be loaded in every browser page (this can be configured in the manifest file).
// Learn more: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts

import { env } from './env';

// This message could come from anywhere in the extension,
// for example, the popup or background worker, the options page or even another tab.
env.browser.runtime.onMessage.addListener((message: any) => {
  if (message.action === 'reload-page') {
    location.reload();
  }
});

// This is just for keeping the TypeScript compiler happy :)
export {};
