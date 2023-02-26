import { ParsedFetchResponse, UrlMatchGroups } from './_dto/util.dto';
import { env } from './env';
import { Tab } from './types';

export class Util {

  static parseFetchResponse(response: Response): Promise<ParsedFetchResponse> {
    return new Promise((resolve) => response.json()
      .then((json) => resolve({
        status: response.status,
        ok: response.ok,
        json,
      })));
  }

  static showLoading(value: boolean): void {
    if (value) {
      document.querySelector('body')?.setAttribute('aria-busy', 'true');
    }
    else {
      document.querySelector('body')?.setAttribute('aria-busy', 'false');
    }
  }

  static async getCurrentTab(): Promise<Tab> {
    const queryOptions = {
      active: true,
      currentWindow: true,
    };

    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [ tab ] = await env.browser.tabs.query(queryOptions);

    return tab;
  }

  static getLocalStorageItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Util.getCurrentTab().then((tab: Tab) => {
        if (tab && tab.id) {
          env.browser.scripting.executeScript({
            target: { tabId: tab.id },
            args: [ key ],
            func: (arg: string) => localStorage.getItem(arg)
          },
          (injectionResults: { result: string | PromiseLike<string>; }[]) => {
            if (injectionResults[0].result) {
              resolve(injectionResults[0].result);
            }
            else {
              reject(new Error('Can not get the token! Are you logged in?'));
            }
          });
        }
        else {
          reject(new Error('Can not get the current tab!'));
        }
      })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  static extractEntryIdFromUrl(url: string, pattern: string): UrlMatchGroups | undefined {
    const matches: RegExpMatchArray | null = new RegExp(pattern).exec(url);

    return matches?.groups;
  }

  static splitArrayIntoChunks<T>(array: T[], chunkSize: number = 10): T[][] {
    const chunks: any[] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
  }

}
