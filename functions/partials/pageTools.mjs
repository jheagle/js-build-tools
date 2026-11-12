/* global MutationObserver -- the functions given to page.evaluate run in the browser, where it exists */
/**
 * Small helpers for scripts that drive a real page with Playwright (see launchBrowser and serveStatic): collect what
 * went wrong on the page, click a control by its label, and count how much of the page changes.
 */

/**
 * Collect everything that goes wrong on a page from now on: uncaught errors, console errors, requests that fail, and
 * responses with an HTTP error status. Read the returned array whenever you like; it keeps filling while the page runs.
 * @memberOf module:partials
 * @param {Object} page - A Playwright page.
 * @param {Object} [options]
 * @param {Array<RegExp>} [options.ignore=[]] - Messages or URLs to leave out, such as an analytics script that is
 * blocked when testing locally.
 * @returns {Array<string>} The problems, each as "kind: message", in the order they happened.
 */
export const watchPage = (page, { ignore = [] } = {}) => {
  const problems = []
  const add = (kind, text) => {
    if (!ignore.some(pattern => pattern.test(text))) {
      problems.push(`${kind}: ${text}`)
    }
  }
  page.on('pageerror', error => add('pageerror', error.message))
  page.on('console', message => {
    if (message.type() === 'error') {
      // The browser's own "Failed to load resource" message doesn't say which one; its location does
      const where = message.location()?.url
      const text = message.text()
      add('console', /^Failed to load resource/.test(text) && where ? `${text} (${where})` : text)
    }
  })
  page.on('requestfailed', request => add('requestfailed', request.url()))
  page.on('response', response => {
    if (response.status() >= 400) {
      add(`HTTP ${response.status()}`, response.url())
    }
  })
  return problems
}

/**
 * The visible controls that can be clicked by a label: buttons, and inputs of type button or submit. Runs in the page.
 * @private
 */
const findControl = ({ label, list }) => {
  const visible = element => element.offsetParent !== null || element.getClientRects().length > 0
  const controls = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).filter(visible)
  const name = element => (element.tagName === 'INPUT' ? element.value : element.textContent).trim()
  if (list) {
    return controls.map(name)
  }
  const exact = controls.find(element => name(element) === label)
  const control = exact ?? controls.find(element => name(element).includes(label))
  if (!control) {
    return false
  }
  control.click()
  return true
}

/**
 * Click the visible button (or input of type button/submit) with this label: its exact text or value, otherwise the
 * first whose text contains it. Fails straight away, naming the controls that are there, instead of waiting for a
 * timeout.
 * @memberOf module:partials
 * @param {Object} page - A Playwright page.
 * @param {string} label - The text on the control.
 * @param {Object} [options]
 * @param {boolean} [options.inPage=false] - Find and click it in one step inside the page, rather than with
 * Playwright's click (which waits for the element to be stable, and moves the mouse). Use it for a page that
 * replaces its elements while you click (one that re-renders on every update), where Playwright's click can find an
 * element that is gone a moment later ("element was detached").
 * @returns {Promise<void>}
 * @throws {Error} When no visible control has that label.
 */
export const clickLabel = async (page, label, { inPage = false } = {}) => {
  if (inPage) {
    if (await page.evaluate(findControl, { label, list: false })) {
      return
    }
  } else {
    const controls = page.locator('button:visible, input[type=button]:visible, input[type=submit]:visible')
    const exact = controls.filter({ hasText: new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) })
    const byValue = page.locator(`input[type=button][value="${label}"]:visible, input[type=submit][value="${label}"]:visible`)
    for (const candidate of [exact, byValue, controls.filter({ hasText: label })]) {
      if (await candidate.count()) {
        return candidate.first().click()
      }
    }
  }
  const present = await page.evaluate(findControl, { label, list: true })
  throw new Error(`No visible control labelled "${label}". Visible: ${present.length ? present.map(name => `"${name}"`).join(', ') : 'none'}`)
}

/**
 * Start counting how much of the page changes: elements added and removed (every element of an added or removed
 * subtree counts, not just its top), attribute writes and text changes. Useful to measure what one action costs, or to
 * check that an update only touched what it should.
 * @memberOf module:partials
 * @param {Object} page - A Playwright page, already loaded.
 * @param {string} [selector='body'] - The element to watch, with everything inside it.
 * @returns {Promise<{read: function(): Promise<{added: number, removed: number, attributes: number, text: number}>}>}
 * read() returns the counts since the last read (or since counting started) and starts the next count from zero.
 */
export const trackMutations = async (page, selector = 'body') => {
  const key = `__pageToolsMutations${Math.random().toString(36).slice(2)}`
  await page.evaluate(({ key, selector }) => {
    const counts = { added: 0, removed: 0, attributes: 0, text: 0 }
    const size = node => 1 + (node.getElementsByTagName ? node.getElementsByTagName('*').length : 0)
    const count = records => records.forEach(record => {
      if (record.type === 'childList') {
        record.addedNodes.forEach(node => { counts.added += size(node) })
        record.removedNodes.forEach(node => { counts.removed += size(node) })
      } else if (record.type === 'attributes') {
        counts.attributes++
      } else {
        counts.text++
      }
    })
    const observer = new MutationObserver(count)
    observer.observe(document.querySelector(selector), { subtree: true, childList: true, attributes: true, characterData: true })
    window[key] = () => {
      count(observer.takeRecords())
      const result = { ...counts }
      Object.keys(counts).forEach(name => { counts[name] = 0 })
      return result
    }
  }, { key, selector })
  return {
    read: () => page.evaluate(key => window[key](), key)
  }
}
