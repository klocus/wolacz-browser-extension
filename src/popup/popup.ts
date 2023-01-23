// The popup page is visible when the user clicks on the extension icon.
// It's just a regular web page that can receive or send messages to other parts of the extension.
// Learn more: https://developer.chrome.com/docs/extensions/mv3/user_interface/#popup

import * as WykopDTO from '../_dto/wykop.dto';
import { env } from '../env';
import type { Tab } from '../types';
import { WykopService } from '../_service/wykop.service';
import { Utils } from '../utils';

export class Popup {

  private currentTab: Tab;

  constructor(rootSelector: string) {
    Utils.getCurrentTab().then((tab: Tab) => {
      this.currentTab = tab;

      this.render(rootSelector);
      this.setupListeners();
    }).catch();
  }

  private render(rootSelector: string): void {
    const rootElement = document.querySelector(rootSelector);

    if (rootElement) {
      if (this.currentTab?.url?.includes('wykop.pl')) {
        rootElement.innerHTML = `
        <hgroup>
          <h2>O, Wołacz!</h2>
          <h3>Automatyczne wołanie Mirków i Mirabelek</h3>
        </hgroup>
        <form>
          <label for="url">Adres URL wpisu/komentarza</label>
          <input type="url" id="url" name="url" placeholder="https://..." pattern="${env.wykop.pattern}" required>
          <small>Adres URL do wpisu lub komentarza, z którego chcesz zawołać plusujących.</small>
          
          <button type="submit">Wołaj!</button>
        </form>
      `;
      }
      else if (this.currentTab?.url?.includes('hejto.pl')) {
        rootElement.innerHTML = `
        <hgroup>
          <h2>O, Wołacz!</h2>
          <h3>Automatyczne wołanie Tomków i Kaś</h3>
        </hgroup>
        <form>
          <label for="url">Adres URL wpisu</label>
          <input type="url" id="url" name="url" placeholder="https://..." pattern="${env.hejto.pattern}" required>
          <small>Adres URL do wpisu lub komentarza, z którego chcesz zawołać grzmocących.</small>
          
          <button type="submit">Wołaj!</button>
        </form>
      `;
      }
      else {
        rootElement.innerHTML = `
        <h2>O, Wołacz!</h2>
        <p>Przejdź na stronę swojego wpisu w serwisie Wykop lub Hejto, aby móc zawołać użytkowników.</p>
      `;
      }
    }
  }

  private setupListeners(): void {
    this.onFormSubmit();
  }

  private onFormSubmit(): void {
    const form: HTMLFormElement | null = document.querySelector('form');

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const entryUrl: string = (form?.elements.namedItem('url') as HTMLInputElement).value;

      if (this.currentTab?.url?.includes(env.wykop.domain)) {
        const entryId: string | null = Utils.extractEntryIdFromUrl(entryUrl, env.wykop.pattern);

        if (entryId) {
          this.callWykopVoters(entryId);
        }
      }
      else if (this.currentTab?.url?.includes(env.hejto.domain)) {
        const entryId: string | null = Utils.extractEntryIdFromUrl(entryUrl, env.hejto.pattern);

        if (entryId) {
          this.callHejtoVoters(entryId);
        }
      }
    });
  }

  private callWykopVoters(entryId: string): void {
    Utils.showLoading(true);

    WykopService.getToken()
      .then((token: string) => {
        env.token = token;

        return WykopService.getEntryVotes(entryId);
      })
      .then((voters: WykopDTO.Author[]) => {
        const chunks: WykopDTO.Author[][] = Utils.splitArrayIntoChunks(voters, env.callsPerEntry);
        const promises: Promise<any>[] = [];

        chunks.forEach((chunk: WykopDTO.Author[]) => {
          const newEntry: WykopDTO.NewEntry = {
            adult: false,
            content: chunk.map((voter: WykopDTO.Author) => env.callCharacter + voter.username).join(', '),
            embed: null,
            photo: null
          } as WykopDTO.NewEntry;

          promises.push(new Promise(resolve => setTimeout(resolve, env.newEntryDelay)).then(() => {
            return WykopService.createEntryComment(entryId, newEntry);
          }));
        });

        return Promise.all(promises);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        env.browser.tabs.sendMessage(this.currentTab?.id, { action: 'reload-page' });
        Utils.showLoading(false);
      });
  }

  private callHejtoVoters(entryId: string): void {
    // ...
  }

}

new Popup('#app');
