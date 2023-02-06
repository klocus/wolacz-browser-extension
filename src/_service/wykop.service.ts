import { env } from '../env';
import * as WykopDTO from '../_dto/wykop.dto';

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
    return fetch(`${env.wykop.apiUrl}/profile`, {
      method: 'GET',
      headers: this.headers
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data as WykopDTO.User;
      })
      .catch((error) => {
        throw error;
      });
  }

  public getEntry(entryId: string): Promise<WykopDTO.Entry> {
    return fetch(`${env.wykop.apiUrl}/entries/${entryId}`, {
      method: 'GET',
      headers: this.headers
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data as WykopDTO.Entry;
      })
      .catch((error) => {
        throw error;
      });
  }

  public getEntryVotes(entryId: string): Promise<WykopDTO.User[]> {
    return fetch(`${env.wykop.apiUrl}/entries/${entryId}/votes`, {
      method: 'GET',
      headers: this.headers
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data as WykopDTO.User[];
      })
      .catch((error) => {
        throw error;
      });
  }

  public getEntryComments(entryId: string): Promise<WykopDTO.Entry[]> {
    return fetch(`${env.wykop.apiUrl}/entries/${entryId}/comments`, {
      method: 'GET',
      headers: this.headers
    })
      .then((response) => response.json())
      .then((result) => {
        return result.data as WykopDTO.Entry[];
      })
      .catch((error) => {
        throw error;
      });
  }

  public createEntryComment(entryId: string, content: WykopDTO.NewEntry): Promise<any> {
    return fetch(`${env.wykop.apiUrl}/entries/${entryId}/comments`, {
      method: 'POST',
      headers: this.headers,
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
