/**
 * 渲染检查：在已打开的页面里执行，返回只有渲染后才能发现的违规。
 * - overflow：内容宽于视口；元素越出视口且没有横向滚动或裁切的祖先（body / html 上的
 *   overflow-x-hidden 不算）；子项越出 flex / grid 容器
 * - text-overflow：文字溢出自身盒子，或被裁切却没有省略号与 line-clamp
 * - row-height：同一行的卡片或水平并排的控件（按钮与输入 / 只读值容器）高度不一致
 * - adjacent-fill：相邻兄弟元素填充色相同且有别于底色，彼此相接且交界处没有边框
 * - font-size：计算字号小于 12px
 *
 * 整个文件是一个无参函数，用浏览器工具的 evaluate 执行；
 * Playwright：await page.evaluate(`(${source})()`)。
 */
() => {
  const viewport = document.documentElement.clientWidth
  const violations = []
  const styleOf = (element) => getComputedStyle(element)

  const describe = (element) => {
    const id = element.id ? `#${element.id}` : ""
    const classes = (element.getAttribute("class") ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 4)
    const text = (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40)
    return `${element.tagName.toLowerCase()}${id}${classes.map((name) => `.${name}`).join("")}${text ? ` "${text}"` : ""}`
  }

  const isRendered = (element) => {
    const rect = element.getBoundingClientRect()
    return rect.width > 1 && rect.height > 1 && styleOf(element).visibility !== "hidden"
  }

  const clipsX = (element) => styleOf(element).overflowX !== "visible"

  const hasClippingAncestor = (element) => {
    for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      if (clipsX(parent)) return true
    }
    return false
  }

  const insideScroller = (element) => {
    for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      if (["auto", "scroll"].includes(styleOf(parent).overflowX)) return true
    }
    return false
  }

  const hasSurface = (element) => {
    const style = styleOf(element)
    return (
      !/rgba\(0, 0, 0, 0\)|transparent/.test(style.backgroundColor) ||
      parseFloat(style.borderTopWidth) > 0 ||
      style.boxShadow !== "none"
    )
  }

  // grid 子项会被拉伸，可见的卡片常是它唯一的子元素
  const surfaceOf = (element) => {
    for (let node = element; node; node = node.children.length === 1 ? node.children[0] : null) {
      if (hasSurface(node)) return node
    }
    return null
  }

  const elements = [...document.body.querySelectorAll("*")].filter(
    (element) => !["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(element.tagName) && isRendered(element)
  )

  const scrollWidth = document.documentElement.scrollWidth
  if (scrollWidth > viewport + 1) {
    violations.push({ rule: "overflow", element: "html", detail: `内容宽 ${scrollWidth}px，超出视口 ${viewport}px` })
  }
  const overflowing = []
  for (const element of elements) {
    if (overflowing.some((reported) => reported.contains(element))) continue
    const rect = element.getBoundingClientRect()
    const crossesEdge = (rect.left < viewport && rect.right > viewport + 1) || (rect.right > 0 && rect.left < -1)
    if (crossesEdge && styleOf(element).position !== "fixed" && !hasClippingAncestor(element)) {
      overflowing.push(element)
      violations.push({
        rule: "overflow",
        element: describe(element),
        detail: `占据 ${Math.round(rect.left)}–${Math.round(rect.right)}px，视口宽 ${viewport}px`,
      })
    }
  }

  // 长文本把 flex / grid 子项撑出容器（缺 min-w-0）；负边距是有意的对齐补偿，横向滚动区内的越界是预期行为
  for (const container of elements) {
    const style = styleOf(container)
    if (!/(?:flex|grid)$/.test(style.display) || style.overflowX !== "visible" || insideScroller(container)) continue
    const box = container.getBoundingClientRect()
    for (const child of container.children) {
      const childStyle = styleOf(child)
      if (!isRendered(child) || ["absolute", "fixed"].includes(childStyle.position)) continue
      const rect = child.getBoundingClientRect()
      const excess = Math.max(
        rect.right - box.right - Math.max(0, -parseFloat(childStyle.marginRight)),
        box.left - rect.left - Math.max(0, -parseFloat(childStyle.marginLeft))
      )
      if (excess > 1) {
        violations.push({ rule: "overflow", element: describe(child), detail: `越出 ${style.display} 容器 ${Math.round(excess)}px` })
        break
      }
    }
  }

  // 文字按所在块级盒子判断：Range 只量文字本身，不受角标等绝对定位子元素干扰
  const blockOf = (element) => {
    let node = element
    while (node.parentElement && /^(?:inline|contents)$/.test(styleOf(node).display)) node = node.parentElement
    return node
  }
  const smallText = new Set()
  const brokenText = new Set()
  const range = document.createRange()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement
    if (!node.textContent.trim() || !parent || !isRendered(parent)) continue
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "OPTION"].includes(parent.tagName) || parent.closest("svg")) continue

    const fontSize = parseFloat(styleOf(parent).fontSize)
    if (fontSize < 12 && !smallText.has(parent)) {
      smallText.add(parent)
      violations.push({ rule: "font-size", element: describe(parent), detail: `字号 ${fontSize}px` })
    }

    const container = blockOf(parent)
    if (brokenText.has(container)) continue
    range.selectNodeContents(node)
    const text = range.getBoundingClientRect()
    const box = container.getBoundingClientRect()
    // 字形盒可能高于行盒（leading-none、阿拉伯文等高字形字体）；真正的纵向溢出至少多出一行
    const slack = fontSize * 0.6
    const outX = text.right > box.right + 1 || text.left < box.left - 1
    const outY = text.bottom > box.bottom + slack || text.top < box.top - slack
    if (!outX && !outY) continue

    const style = styleOf(container)
    const clamped = style.webkitLineClamp !== "none" && style.webkitLineClamp !== ""
    const cut = (overflow) => ["hidden", "clip"].includes(overflow)
    let detail = null
    if ((outX && style.overflowX === "visible") || (outY && style.overflowY === "visible")) {
      detail = "文字越出所在盒子，压到相邻内容"
    } else if ((outX && cut(style.overflowX) && style.textOverflow !== "ellipsis" && !clamped) || (outY && cut(style.overflowY) && !clamped)) {
      detail = "文字被裁切且没有省略号或 line-clamp"
    }
    if (detail) {
      brokenText.add(container)
      violations.push({ rule: "text-overflow", element: describe(container), detail })
    }
  }

  for (const grid of elements.filter((element) => styleOf(element).display.endsWith("grid"))) {
    const rows = new Map()
    for (const child of grid.children) {
      const surface = isRendered(child) ? surfaceOf(child) : null
      if (!surface) continue
      const rect = surface.getBoundingClientRect()
      if (rect.height < 48) continue
      const top = Math.round(child.getBoundingClientRect().top)
      rows.set(top, [...(rows.get(top) ?? []), rect.height])
    }
    for (const heights of rows.values()) {
      if (heights.length > 1 && Math.max(...heights) - Math.min(...heights) > 1) {
        violations.push({
          rule: "row-height",
          element: describe(grid),
          detail: `同排卡片高度 ${heights.map(Math.round).join(" / ")}px`,
        })
      }
    }
  }

  const CONTROL = 'button, input, select, code, [role="combobox"], [data-slot="input"], [data-slot="select-trigger"], [data-slot="button"]'
  for (const row of elements.filter((element) => {
    const style = styleOf(element)
    return style.display.endsWith("flex") && style.flexDirection === "row"
  })) {
    const controls = [...row.children]
      .filter((child) => isRendered(child) && child.matches(CONTROL))
      .map((child) => child.getBoundingClientRect())
    if (controls.length < 2) continue
    // 排除 flex-wrap 折到下一行的子项，只比较纵向投影重叠的同行控件
    const first = controls[0]
    const sameLine = controls.filter((rect) => rect.top < first.bottom && first.top < rect.bottom)
    if (sameLine.length < 2) continue
    const heights = sameLine.map((rect) => rect.height)
    if (Math.max(...heights) - Math.min(...heights) > 2) {
      violations.push({
        rule: "row-height",
        element: describe(row),
        detail: `同行控件高度 ${heights.map(Math.round).join(" / ")}px`,
      })
    }
  }

  // 同色填充块零间距相接会读成一个整体；与底色相同的填充不可见，不算；
  // 有意合成的控件组与交界处带边框的成组列表（divide-y）本就要读成一组，豁免
  const isTransparent = (color) => /rgba\(0, 0, 0, 0\)|transparent/.test(color)
  const backdropOf = (element) => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const color = styleOf(parent).backgroundColor
      if (!isTransparent(color)) return color
    }
    return "rgb(255, 255, 255)"
  }
  const GROUP = '[role="group"], [role="radiogroup"], [role="tablist"], [role="toolbar"], [data-slot$="group"]'
  const edgeBorder = (element, side) => {
    const style = styleOf(element)
    return parseFloat(style[`border${side}Width`]) > 0 || style.boxShadow !== "none"
  }
  for (const element of elements) {
    const fill = styleOf(element).backgroundColor
    const next = element.nextElementSibling
    if (isTransparent(fill) || !next || !isRendered(next) || styleOf(next).backgroundColor !== fill) continue
    if (fill === backdropOf(element) || element.parentElement?.closest(GROUP)) continue
    const a = element.getBoundingClientRect()
    const b = next.getBoundingClientRect()
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left)
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    let touching = false
    if (overlapY > 1 && Math.abs(b.left - a.right) <= 1) touching = !edgeBorder(element, "Right") && !edgeBorder(next, "Left")
    else if (overlapX > 1 && Math.abs(b.top - a.bottom) <= 1) touching = !edgeBorder(element, "Bottom") && !edgeBorder(next, "Top")
    if (touching) {
      violations.push({ rule: "adjacent-fill", element: describe(element), detail: `与下一个兄弟元素同为 ${fill} 且零间距相接` })
    }
  }

  return { viewport:`${window.innerWidth}×${window.innerHeight}`, scrollWidth, violations }
}
