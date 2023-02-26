// Options pages are usually reserved for configuration related options of the extension.
// For more frequent actions, it's better to use the popup page. Like the popup, it's just a regular web page,
// that can communicate with other parts of the extension by sending messages.
// Learn more: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages

const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
        <h1>Preferencje</h1>
        <p>W przyszłości będzie można tutaj ustawiać jakieś opcje...</p>
    `;
}

export {};
