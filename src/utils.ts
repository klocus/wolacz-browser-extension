import { env } from './env';
import { Tab } from './types';

export class Utils {

  static showLoading(value: boolean) {
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

  static extractEntryIdFromUrl(url: string, pattern: string): string | null {
    const matches: RegExpMatchArray | null = url.match(new RegExp(pattern));

    return matches?.length ? matches[1] : null;
  }

  static splitArrayIntoChunks<T>(array: T[], chunkSize: number = 10): T[][] {
    const chunks: any[] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
  }

}
