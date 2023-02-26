export const env: {
  browser: any,
  newEntryDelay: number,
  callCharacter: string,
  callsPerEntry: number,
  wykop: { domain: string, apiUrl: string, pattern: string, comment: string },
  hejto: { domain: string, apiUrl: string, pattern: string, comment: string }
} = {
  browser: chrome || browser, // Firefox uses the `browser` namespace, Chrome uses the `chrome` namespace
  newEntryDelay: 1000,
  callCharacter: '@',
  callsPerEntry: 50,
  wykop: {
    domain: 'wykop.pl',
    apiUrl: 'https://wykop.pl/api/v3',
    pattern: 'https*:\\/\\/wykop.pl\\/wpis\\/(?<entryId>[0-9]+)[^#]*(?:#(?<commentId>[0-9]+))?',
    comment: '[(O!)](https://klocus.pl/wolacz/) Wołam użytkowników plusujących następujący wpis: '
  },
  hejto: {
    domain: 'hejto.pl',
    apiUrl: 'https://www.hejto.pl/_next',
    pattern: 'https*:\\/\\/www.hejto.pl/wpis/(?<entryId>[0-9a-z_-]+)',
    comment: 'Wołam użytkowników piorunujących następujący wpis: '
  }
};
