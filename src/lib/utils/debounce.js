/**
 * Debounce function - delays execution until after wait time has passed
 * since the last invocation
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function - limits execution to once per wait time
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The minimum time between executions in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, wait) {
  let waiting = false
  let lastArgs = null
  
  return function executedFunction(...args) {
    if (waiting) {
      lastArgs = args
      return
    }
    
    func(...args)
    waiting = true
    
    setTimeout(() => {
      waiting = false
      if (lastArgs) {
        executedFunction(...lastArgs)
        lastArgs = null
      }
    }, wait)
  }
}
