// This is the code for the background worker. The background worker is non-persistent.
// In case you need to store data persistently it's recommended to use Local Storage.
// Learn more: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts

import { env } from '../env';
import { Sender } from '../types';

env.browser.runtime.onMessage.addListener((message: any, sender: Sender) => {
  // Sometimes it's not be possible to have the information about the Tab from the sender.
  // So it's always recommended to check whether it's available.
  // As an alternative, you can manually include the Tab info into the message being sent.
  const tabId: number | undefined = message.tabId || sender.tab?.id;

  // A message is usually sent from within your extension but it's also
  // possible to listen to messages from other extensions using `onMessageExternal`.
  console.log('Message received:', message);

  if (message.action == 'load' && tabId) {
    // A message can be sent to a content script in a specific tab.
    // It can be something simple, e.g. just a string, or something
    // more complex, like an object, as it's possible to see in the
    // example below.
    env.browser.tabs.sendMessage(tabId, {
      action: 'hello',
      who: 'Background Worker',
    });
  }
});

export {};
