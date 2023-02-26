import * as UtilDTO from '../_dto/util.dto';
import { env } from '../env';
import * as WykopDTO from '../_dto/wykop.dto';
import { Util } from '../util';

export class WykopService {

  public token: string;

  private headers: any;

  constructor(token: string) {
    this.token = token;
    this.headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  public getCurrentUser(): Promise<WykopDTO.User> {
    return new Promise((resolve, reject) => {
      return fetch(`${env.wykop.apiUrl}/profile`, {
        method: 'GET',
        headers: this.headers
      })
        .then(Util.parseFetchResponse)
        .then((response: UtilDTO.ParsedFetchResponse) => {
          if (response.ok) {
            return resolve(response.json.data as WykopDTO.User);
          }

          return reject(new Error(response.json.error.message));
        })
        .catch((error) => reject({ networkError: error.message }));
    });
  }

  public getEntry(entryId: string, commentId?: string): Promise<WykopDTO.Entry> {
    return new Promise((resolve, reject) => {
      return fetch(`${env.wykop.apiUrl}/entries/${entryId + (commentId ? `/comments/${commentId}` : '')}`, {
        method: 'GET',
        headers: this.headers
      })
        .then(Util.parseFetchResponse)
        .then((response: UtilDTO.ParsedFetchResponse) => {
          if (response.ok) {
            return resolve(response.json.data as WykopDTO.Entry);
          }

          return reject(new Error(response.json.error.message));
        })
        .catch((error) => reject({ networkError: error.message }));
    });
  }

  public getEntryVotes(entryId: string, commentId?: string): Promise<WykopDTO.User[]> {
    return new Promise((resolve, reject) => {
      fetch(`${env.wykop.apiUrl}/entries/${entryId + (commentId ? `/comments/${commentId}` : '')}/votes`, {
        method: 'GET',
        headers: this.headers
      })
        .then(Util.parseFetchResponse)
        .then((response: UtilDTO.ParsedFetchResponse) => {
          if (response.ok) {
            return resolve(response.json.data as WykopDTO.User[]);
          }

          return reject(new Error(response.json.error.message));
        })
        .catch((error) => reject({ networkError: error.message }));
    });
  }

  public createEntryComment(entryId: string, content: WykopDTO.NewEntry): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${env.wykop.apiUrl}/entries/${entryId}/comments`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ data: content })
      })
        .then(Util.parseFetchResponse)
        .then((response: UtilDTO.ParsedFetchResponse) => {
          if (response.ok) {
            return resolve(response.json.data);
          }

          return reject(new Error(response.json.error.message));
        })
        .catch((error) => reject({ networkError: error.message }));
    });
  }

}
