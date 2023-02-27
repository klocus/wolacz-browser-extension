# O, Wołacz!

Browser extension for calling and randomizing users of [Wykop.pl](https://wykop.pl) and [Hejto.pl](https://hejto.pl).

## Installation

### Firefox

Just go to [Firefox Addon Page](https://addons.mozilla.org/pl/firefox/addon/o-wo%C5%82acz/) and install extension to your browser.

After installation, you need to enable permissions for the add-on so that it can work on the domain _Wykop.pl_ and _Hejto.pl_.

### Chrome

1. Download the [latest release](https://github.com/klocus/wolacz-browser-extension/releases) of extension.
1. Extract the files into their own folder.
1. In Chrome, navigate to `chrome://extensions/`.
1. Enable _Developer mode_ by ticking the checkbox in the upper-right corner.
1. Click on the _Load unpacked extension..._ button and select the directory containing unpacked extension.

## How to use

Extesion uses **Node.js** so make sure to have it installed before continuing, any stable version should be fine.

1. Clone the repo or download a zip.
2. Run `npm install` inside the project folder.
3. Start the development server with `npm run dev`, the compiled files will be available in the `dist/js` folder.
4. Load the extension on your favorite browser (it needs to be compatible with the Manifest V3), select the `dist` folder. Check this [link](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) to see how to manually load a extension on a (Chromium compatible) browser.

## Creating a production bundle

To create a production ready (minified) bundle:

1. Run `npm run build` in the project folder.
2. Create a zip from the `dist` folder contents (just the contents, not the folder itself).
3. Follow the guidelines on how to publish an extension using the links below.
