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
          <h3>Automatyczne wołanie Mirków</h3>
        </hgroup>
        <form>
          <label for='url'>Adres URL wpisu/komentarza</label>
          <input type='url' id='url' name='url' placeholder='https://...' required>
          <small>Adres URL do wpisu lub komentarza, z którego chcesz zawołać plusujących.</small>
          
          <button type='submit'>Wołaj!</button>
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

      Utils.getCurrentTab().then((tab: Tab) => {
        this.currentTab = tab;

        return WykopService.getToken();
      })
        .then((token: string) => {
          env.token = token;

          const entryUrl: string = (form?.elements.namedItem('url') as HTMLInputElement).value;
          const entryId: string | null = Utils.extractEntryIdFromUrl(entryUrl);

          Utils.showLoading(true);

          if (entryId) {
            WykopService.getEntryVotes(entryId)
              .then((voters: WykopDTO.Author[]) => {
                console.log(voters);
              })
              .catch((error) => {
                console.error(error);
              })
              .finally(() => {
                Utils.showLoading(false);
              });

            /*
            const newEntry: WykopDTO.NewEntry = {
              adult: false,
              content: 'To jest testowy test.',
              embed: null,
              photo: null
            } as NewEntry;

            WykopService.createEntryComment(entryId, newEntry).catch();
             */
          }
        })
        .catch();
    });
  }

}

new Popup('#app');
