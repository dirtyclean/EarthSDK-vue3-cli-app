export const generator = (function() {
  const obj = {}
  Object.defineProperty(obj, 'randomNum', {
    enumerable: false,
    configurable: false,
    get() {
      return Math.random()
        .toString(16)
        .substring(2)
    }
  })
  return obj
})()
