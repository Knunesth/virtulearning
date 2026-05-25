export function startKeepAlive(url: string, intervalMinutes = 13) {
  const interval = intervalMinutes * 60 * 1000

  console.log(`[keep-alive] Iniciado — ping a cada ${intervalMinutes} minutos para ${url}/health`)

  setInterval(async () => {
    try {
      const start = Date.now()
      const res = await fetch(`${url}/health`)
      const ms = Date.now() - start
      if (res.ok) {
        console.log(`[keep-alive] ✅ OK — ${ms}ms`)
      } else {
        console.warn(`[keep-alive] ⚠️ Resposta inesperada: ${res.status}`)
      }
    } catch (e) {
      console.error(`[keep-alive] ❌ Falhou:`, e)
    }
  }, interval)
}
