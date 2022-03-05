/*
 * @Author: dirtyclean
 * @Date: 2021-07-05 10:18:48
 * @Last Modified by:   dirtyclean
 * @Last Modified time: 2021-07-05 10:18:48
 */
function storageIsEmpty(key) {
  if (['null', null, 'undefined', undefined, ''].includes(localStorage.getItem(key))) {
    return true
  }
  return false
}
function getStorage(key) {
  if (!storageIsEmpty(key)) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}
function setStorage(key, value) {
  if (typeof value !== 'object') {
    localStorage.setItem(key, value)
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}
function removeStorage(key) {
  localStorage.removeItem(key)
}
function clearStorage() {
  localStorage.clear()
}

export { getStorage, setStorage, removeStorage, clearStorage, storageIsEmpty }
