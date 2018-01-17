
/**
 * Method to correctly used a delay method, because of the async hook error if an error is thrown during the setTimeout
 * @param {*} delay
 */
module.exports = (delay) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}
