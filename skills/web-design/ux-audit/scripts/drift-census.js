/**
 * 漂移盘点：在已打开的页面里执行，按角色收集可见元素的视觉签名与界面用词。
 * - roles：每个角色下的签名及出现次数与样例；同一角色多个签名即漂移候选
 * - terms：按钮、链接、标题、表头、标签的去重文案；同一对象多个叫法即漂移候选
 *
 * 签名取渲染值，不看类名：不同写法得到相同外观算同一签名。
 * 整个文件是一个无参函数，用浏览器工具的 evaluate 执行；
 * Playwright：await page.evaluate(`(${source})()`)。
 * 跨页面比较时把各页 roles 按角色与签名合并。
 */
() => {
  const ROLES = {
    button: 'button, [role="button"], a[data-slot="button"], input[type="submit"], input[type="button"]',
    input: 'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select, [role="combobox"]',
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    link: 'a[href]:not([data-slot="button"]):not([role="button"])',
    badge: '[data-slot="badge"]',
    card: '[data-slot="card"]',
    dialog: '[role="dialog"], [role="alertdialog"]',
    tableHeader: 'th, [role="columnheader"]',
  }
  const TERM_ROLES = ["button", "link", "heading1", "heading2", "heading3", "tableHeader"]

  const px = (value) => `${Math.round(parseFloat(value) || 0)}`
  const isTransparent = (color) => /rgba\(0, 0, 0, 0\)|transparent/.test(color)
  const textOf = (element) =>
    (element.getAttribute("aria-label") || element.value || element.textContent || "").trim().replace(/\s+/g, " ")

  const isVisible = (element) => {
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return rect.width > 1 && rect.height > 1 && style.visibility !== "hidden" && style.display !== "none"
  }

  // 按钮的外观类别：填充 / 描边 / 文字
  const variantOf = (style) => {
    if (!isTransparent(style.backgroundColor)) return `fill ${style.backgroundColor}`
    if (parseFloat(style.borderTopWidth) > 0) return `outline ${style.borderTopColor}`
    return `ghost ${style.color}`
  }

  const signatureOf = (role, element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    const radius = px(style.borderTopLeftRadius)
    const font = `${px(style.fontSize)}/${style.fontWeight}`
    switch (role) {
      case "button": {
        const icon = element.querySelector("svg")
        const iconSize = icon ? ` icon ${px(icon.getBoundingClientRect().width)}` : ""
        return `h ${px(rect.height)} r ${radius} px ${px(style.paddingLeft)} ${font} ${variantOf(style)}${iconSize}`
      }
      case "input":
        return `h ${px(rect.height)} r ${radius} border ${px(style.borderTopWidth)} ${style.borderTopColor} ${font}`
      case "link":
        return `${style.color} ${style.textDecorationLine} ${font}`
      case "card":
      case "dialog":
        return `r ${radius} p ${px(style.paddingTop)}/${px(style.paddingLeft)} border ${px(style.borderTopWidth)} shadow ${style.boxShadow === "none" ? "none" : "yes"} bg ${style.backgroundColor}`
      case "badge":
        return `h ${px(rect.height)} r ${radius} ${font} bg ${style.backgroundColor}`
      default:
        return `${font} lh ${style.lineHeight === "normal" ? "normal" : px(style.lineHeight)} ${style.color} ${style.textTransform}`
    }
  }

  const describe = (element) => {
    const text = textOf(element).slice(0, 30)
    return `${element.tagName.toLowerCase()}${text ? ` "${text}"` : ""}`
  }

  const roles = {}
  const terms = {}
  for (const [role, selector] of Object.entries(ROLES)) {
    const groups = new Map()
    const words = new Set()
    for (const element of document.querySelectorAll(selector)) {
      if (!isVisible(element)) continue
      const signature = signatureOf(role, element)
      const group = groups.get(signature) ?? { signature, count: 0, samples: [] }
      group.count += 1
      if (group.samples.length < 3) group.samples.push(describe(element))
      groups.set(signature, group)
      const text = textOf(element)
      if (TERM_ROLES.includes(role) && text && text.length <= 40) words.add(text)
    }
    if (groups.size) roles[role] = [...groups.values()].sort((a, b) => b.count - a.count)
    if (words.size) terms[role] = [...words].sort()
  }

  return {
    url: location.pathname + location.search,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    roles,
    terms,
  }
}
