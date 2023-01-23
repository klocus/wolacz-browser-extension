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

  static extractEntryIdFromUrl(url: string): string | null {
    const matches: RegExpMatchArray | null = url.match(/https*:\/\/wykop.pl\/wpis\/([0-9]+)(.*)/);

    return matches?.length ? matches[1] : null;
  }

}
