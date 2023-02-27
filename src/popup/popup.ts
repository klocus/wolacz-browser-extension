// The popup page is visible when the user clicks on the extension icon.
// Learn more: https://developer.chrome.com/docs/extensions/mv3/user_interface/#popup

import * as UtilDTO from '../_dto/util.dto';
import * as WykopDTO from '../_dto/wykop.dto';
import { env } from '../env';
import type { Tab } from '../types';
import { WykopService } from '../_service/wykop.service';
import { Util } from '../util';

enum Mode {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL'
}

export class Popup {

  private currentTab: Tab;

  private wykopService!: WykopService;

  constructor(rootSelector: string) {
    Util.getCurrentTab().then((tab: Tab) => {
      this.currentTab = tab;

      this.render(rootSelector);
      this.setupListeners();
    }).catch();
  }

  private render(rootSelector: string): void {
    const rootElement = document.querySelector(rootSelector);

    if (rootElement) {
      if (this.currentTab?.url && new RegExp(env.wykop.pattern).test(this.currentTab.url)) {
        rootElement.innerHTML = `
        <hgroup>
          <h2>O, Wołacz!</h2>
          <h3>Automatyczne wołanie Mirków i Mirabelek</h3>
        </hgroup>
        <form>
          <label for="url">Adres URL wpisu/komentarza</label>
          <input type="url" id="url" name="url" placeholder="https://..." pattern="${env.wykop.pattern}" required>
          <small>Adres URL do wpisu lub komentarza, z którego chcesz zawołać plusujących.</small>
          
          <fieldset>
            <legend>Tryb wołania</legend>
            <label for="automatic">
              <input type="radio" id="automatic" name="mode" value="${Mode.AUTOMATIC}" checked>
              Automatyczne (generuje komentarze)
            </label>
            <label for="manual">
              <input type="radio" id="manual" name="mode" value="${Mode.MANUAL}">
              Ręczne (kopiuje listę do schowka)
            </label>
          </fieldset>
          
          <button type="submit">Wołaj!</button>
        </form>
      `;
      }
      else if (this.currentTab?.url && new RegExp(env.hejto.pattern).test(this.currentTab.url)) {
        rootElement.innerHTML = `
        <hgroup>
          <h2>O, Wołacz!</h2>
          <h3>Automatyczne wołanie Tomków i Kaś</h3>
        </hgroup>
        <form>
          <label for="url">Adres URL wpisu</label>
          <input type="url" id="url" name="url" placeholder="https://..." pattern="${env.hejto.pattern}" disabled required>
          <small>Adres URL do wpisu lub komentarza, z którego chcesz zawołać grzmocących.</small>
          
          <button type="submit" disabled>Wołaj!</button>
        </form>
      `;
      }
      else {
        rootElement.innerHTML = `
          <h2>O, Wołacz!</h2>
          <p>Przejdź na stronę swojego wpisu w serwisie Wykop<!-- lub Hejto -->, aby móc zawołać użytkowników.</p>
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
      const sourceEntryUrl: string = (form?.elements.namedItem('url') as HTMLInputElement).value;
      const mode: Mode = (form?.elements.namedItem('mode') as HTMLInputElement).value as Mode;

      if (this.currentTab?.url?.includes(env.wykop.domain)) {
        const sourceMatches: UtilDTO.UrlMatchGroups | undefined = Util.extractEntryIdFromUrl(sourceEntryUrl, env.wykop.pattern);
        const targetMatches: UtilDTO.UrlMatchGroups | undefined = Util.extractEntryIdFromUrl(this.currentTab.url, env.wykop.pattern);

        if (sourceMatches?.entryId && targetMatches?.entryId) {
          this.callWykopVoters(mode, targetMatches.entryId, sourceEntryUrl, sourceMatches.entryId, sourceMatches.commentId || undefined);
        }
      }
      else if (this.currentTab?.url?.includes(env.hejto.domain)) {
        const entryId: string | undefined = Util.extractEntryIdFromUrl(sourceEntryUrl, env.hejto.pattern)?.entryId;

        if (entryId) {
          this.callHejtoVoters(entryId);
        }
      }
    });
  }

  /* ------------------------------ W Y K O P ------------------------------ */

  private callWykopVoters(mode: Mode, targetEntryId: string, sourceEntryUrl: string, sourceEntryId: string, sourceCommentId?: string): void {
    Util.showLoading(true);

    Util.getLocalStorageItem('token')
      .then((token: string) => {
        this.wykopService = new WykopService(token);

        return this.checkIfCanCallWykopVoters(targetEntryId, sourceEntryId, sourceCommentId);
      })
      .then((canCall: boolean) => {
        if (canCall) {
          if (mode === Mode.AUTOMATIC) {
            return this.createWykopEntries(targetEntryId, sourceEntryUrl, sourceEntryId, sourceCommentId);
          }
          else {
            return this.copyWykopEntries(sourceEntryUrl, sourceEntryId, sourceCommentId);
          }
        }
        else {
          return Promise.reject(new Error('Aby móc zawołać do wpisu, musisz być jego autorem.'));
        }
      })
      .then(() => {
        alert(mode === Mode.AUTOMATIC ? 'Gotowe! Przywołano plusujących :-)' : 'Gotowe! Plusujący są w Twoim schowku :-)');
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        Util.showLoading(false);
      });
  }

  private checkIfCanCallWykopVoters(targetEntryId: string, sourceEntryId: string, sourceCommentId?: string): Promise<boolean> {
    let currentUserName: string;
    let sourceEntryAuthor: string;
    let targetEntryAuthor: string;

    return this.wykopService.getCurrentUser()
      .then((user: WykopDTO.User) => {
        currentUserName = user.username;

        return this.wykopService.getEntry(sourceEntryId, sourceCommentId);
      })
      .then((sourceEntry: WykopDTO.Entry) => {
        sourceEntryAuthor = sourceEntry.author.username;

        return this.wykopService.getEntry(targetEntryId);
      })
      .then((targetEntry: WykopDTO.Entry) => {
        targetEntryAuthor = targetEntry.author.username;

        return currentUserName === sourceEntryAuthor && currentUserName === targetEntryAuthor;
      })
      .catch((error) => {
        throw error;
      });
  }

  private createWykopEntries(targetEntryId: string, sourceEntryUrl: string, sourceEntryId: string, sourceCommentId?: string): Promise<void> {
    return this.wykopService.getEntryVotes(sourceEntryId, sourceCommentId)
      .then((voters: WykopDTO.User[]) => {
        const chunks: WykopDTO.User[][] = Util.splitArrayIntoChunks(voters, env.callsPerEntry);
        const promises: Promise<any>[] = [];
        let promisesDelay: number = 0;

        chunks.forEach((chunk: WykopDTO.User[], index: number) => {
          let content: string = (!index ? (env.wykop.comment + sourceEntryUrl + '\n\n') : '');
          content += env.useSpoiler ? env.spoilerCharacter : '';
          content += chunk.map((voter: WykopDTO.User) => env.callCharacter + voter.username).join(', ');

          const newEntry: WykopDTO.NewEntry = {
            adult: false,
            content: content,
            embed: null,
            photo: null
          } as WykopDTO.NewEntry;

          promises.push(new Promise(resolve => setTimeout(resolve, promisesDelay)).then(() => {
            return this.wykopService.createEntryComment(targetEntryId, newEntry);
          }));

          promisesDelay += env.newEntryDelay;
        });

        return Promise.all(promises);
      })
      .then(() => {
        env.browser.tabs.sendMessage(this.currentTab?.id, { action: 'reload-page' });
      })
      .catch((error) => {
        throw error;
      });
  }

  private copyWykopEntries(sourceEntryUrl: string, sourceEntryId: string, sourceCommentId?: string): Promise<void> {
    return this.wykopService.getEntryVotes(sourceEntryId, sourceCommentId)
      .then((voters: WykopDTO.User[]) => {
        const chunks: WykopDTO.User[][] = Util.splitArrayIntoChunks(voters, env.callsPerEntry);
        let textToCopy: string = env.wykop.comment + sourceEntryUrl + '\n\n';

        chunks.forEach((chunk: WykopDTO.User[], index: number) => {
          textToCopy += env.useSpoiler ? env.spoilerCharacter : '';
          textToCopy += chunk.map((voter: WykopDTO.User) => env.callCharacter + voter.username).join(', ');
          textToCopy += index === (chunks.length - 1) ? '' : '\n\n-----\n\n';
        });

        return navigator.clipboard.writeText(textToCopy);
      })
      .catch((error) => {
        throw error;
      });
  }

  /* ------------------------------ H E J T O ------------------------------ */

  private callHejtoVoters(entryId: string): void {
    // ...
  }

}

new Popup('#app');
