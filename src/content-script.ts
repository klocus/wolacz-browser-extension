// This content script will be loaded in every browser page (this can be configured in the manifest file).
// It's recommended to rename this file to something more meaningful so it's easy to find with the browser devtools.
// Learn more: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts

import { env } from './env';

// This message could come from anywhere in the extension,
// for example, the popup or background worker, the options page or even another tab.
env.browser.runtime.onMessage.addListener((message: any) => {
  if (message.action == 'hello') {
    console.log('Hello from:', message.who);
  }
});

// Send a message to other parts of the extension that are listening for a message
// In this example, it will be the background worker that will pick it up and send a reply back.
env.browser.runtime.sendMessage({ action: 'load' });

// This is just for keeping the TypeScript compiler happy :)
export {};
