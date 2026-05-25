export function startKeepAlive(url: string, intervalMinutes = 14) {
  const interval = intervalMinutes * 60 * 1000;
  setInterval(async () => {
    try {
      await fetch(`${url}/health`);
      console.log('[keep-alive] ping OK');
    } catch (e) {
      console.warn('[keep-alive] ping falhou:', e);
    }
  }, interval);
}
