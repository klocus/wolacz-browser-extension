export const env: {
  browser: any,
  apiUrl: string,
  token: string | null
} = {
  browser: chrome || browser, // Firefox uses the `browser` namespace, Chrome uses the `chrome` namespace
  apiUrl: 'https://wykop.pl/api/v3',
  token: null
};
