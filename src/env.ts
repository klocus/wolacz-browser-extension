export const env: {
  browser: any,
  newEntryDelay: number,
  callCharacter: string,
  callsPerEntry: number,
  token: string | null,
  wykop: { domain: string, apiUrl: string, pattern: string },
  hejto: { domain: string, apiUrl: string, pattern: string }
} = {
  browser: chrome || browser, // Firefox uses the `browser` namespace, Chrome uses the `chrome` namespace
  newEntryDelay: 15000,
  callCharacter: '$',
  callsPerEntry: 50,
  token: null,
  wykop: {
    domain: 'wykop.pl',
    apiUrl: 'https://wykop.pl/api/v3',
    pattern: 'https*:\\/\\/wykop.pl\\/wpis\\/([0-9]+)(.*)'
  },
  hejto: {
    domain: 'wykop.pl',
    apiUrl: 'https://www.hejto.pl/_next',
    pattern: 'https*:\\/\\/www.hejto.pl/wpis/([0-9a-z_-]+)'
  }
};
