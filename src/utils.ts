export const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
