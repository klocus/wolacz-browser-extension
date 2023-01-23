import { env } from '../env';
import type { Tab } from '../types';
import { Utils } from '../utils';
import * as WykopDTO from '../_dto/wykop.dto';

export class WykopService {

  static getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      Utils.getCurrentTab().then((tab: Tab) => {
        if (tab && tab.id) {
          env.browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => localStorage.getItem('token')
          },
          (injectionResults: { result: string | PromiseLike<string>; }[]) => {
            if (injectionResults[0].result) {
              resolve(injectionResults[0].result);
            }
            else {
              reject();
            }
          });
        }
        else {
          reject();
        }
      })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static getEntryVotes(entryId: string): Promise<WykopDTO.Author[]> {
    return fetch(`${env.apiUrl}/entries/${entryId}/votes`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${env.token}`
      }
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data as WykopDTO.Author[];
      })
      .catch((error) => {
        throw error;
      });
  }

  static createEntryComment(entryId: string, content: WykopDTO.NewEntry): Promise<any> {
    return fetch(`${env.apiUrl}/entries/${entryId}/comments`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${env.token}`
      },
      body: JSON.stringify({ data: content })
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        throw error;
      });
  }

}
