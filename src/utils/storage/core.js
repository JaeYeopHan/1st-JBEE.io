export function getValueFrom(storage, key) {
  if (!storage || storage === {}) {
    return undefined
  }
  const rawData = storage.getItem(key)

  if (!rawData) {
    return undefined
  }
  return JSON.parse(rawData)
}

export function setValueTo(storage, key, data) {
  if (!storage || storage === {}) {
    return undefined
  }
  storage.setItem(key, JSON.stringify(data))
}
