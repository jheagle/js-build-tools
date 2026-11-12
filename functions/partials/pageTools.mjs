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
 * Find the visible control with this label, in the page: buttons, and inputs of type button or submit, by their text or
 * value with whitespace collapsed (a label written over several lines matches). The exact label first, otherwise the
 * first that contains it (case-sensitive). With a mark, the control found gets that data attribute so Playwright can
 * click it; with list, the visible labels are returned instead.
 * @private
 */
const findControl = ({ label, mark, list }) => {
  const visible = element => element.offsetParent !== null || element.getClientRects().length > 0
  const controls = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).filter(visible)
  const name = element => (element.tagName === 'INPUT' ? element.value : element.textContent).replace(/\s+/g, ' ').trim()
  if (list) {
    return controls.map(name)
  }
  const wanted = label.replace(/\s+/g, ' ').trim()
  const control = controls.find(element => name(element) === wanted) ?? controls.find(element => name(element).includes(wanted))
  if (!control) {
    return false
  }
  if (mark) {
    control.setAttribute(mark, '')
  } else {
    control.click()
  }
  return true
}

/**
 * Click the visible button (or input of type button/submit) with this label: its exact text or value, otherwise the
 * first whose text or value contains it (whitespace collapsed, case-sensitive). Both ways of clicking find the control
 * the same way. Fails straight away, naming the controls that are there, instead of waiting for a timeout.
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
  const mark = inPage ? null : `data-page-tools-${Math.random().toString(36).slice(2)}`
  if (await page.evaluate(findControl, { label, mark, list: false })) {
    if (mark) {
      const control = page.locator(`[${mark}]`)
      await control.click()
      await control.evaluate((element, name) => element.removeAttribute(name), mark).catch(() => {})
    }
    return
  }
  const present = await page.evaluate(findControl, { label, list: true })
  throw new Error(`No visible control labelled "${label}". Visible: ${present.length ? present.map(name => `"${name}"`).join(', ') : 'none'}`)
}

/**
 * Start counting how much of the page changes: elements added and removed (every element of an added or removed
 * subtree counts, not just its top), attribute writes, and text changes (a text node's value changed, or a text node
 * added or removed). Useful to measure what one action costs, or to check that an update only touched what it should.
 * Counting stops when the page navigates or reloads; read() then fails saying so.
 * @memberOf module:partials
 * @param {Object} page - A Playwright page, already loaded.
 * @param {string} [selector='body'] - The element to watch, with everything inside it.
 * @returns {Promise<{read: function(): Promise<{added: number, removed: number, attributes: number, text: number}>}>}
 * read() returns the counts since the last read (or since counting started) and starts the next count from zero.
 * @throws {Error} When no element matches the selector.
 */
export const trackMutations = async (page, selector = 'body') => {
  const key = `__pageToolsMutations${Math.random().toString(36).slice(2)}`
  await page.evaluate(({ key, selector }) => {
    const counts = { added: 0, removed: 0, attributes: 0, text: 0 }
    const target = document.querySelector(selector)
    if (!target) {
      throw new Error(`No element matches "${selector}"`)
    }
    // An element counts with every element inside it; a text or comment node counts as a text change
    const tally = (node, name) => {
      if (node.nodeType === 1) {
        counts[name] += 1 + node.getElementsByTagName('*').length
      } else {
        counts.text++
      }
    }
    const count = records => records.forEach(record => {
      if (record.type === 'childList') {
        record.addedNodes.forEach(node => tally(node, 'added'))
        record.removedNodes.forEach(node => tally(node, 'removed'))
      } else if (record.type === 'attributes') {
        counts.attributes++
      } else {
        counts.text++
      }
    })
    const observer = new MutationObserver(count)
    observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true })
    window[key] = () => {
      count(observer.takeRecords())
      const result = { ...counts }
      Object.keys(counts).forEach(name => { counts[name] = 0 })
      return result
    }
  }, { key, selector })
  return {
    read: () => page.evaluate(key => {
      if (typeof window[key] !== 'function') {
        throw new Error('trackMutations stopped counting: the page navigated or reloaded; start it again')
      }
      return window[key]()
    }, key)
  }
}
