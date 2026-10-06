export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;

    if (key === 'className') {
      node.className = value;
    } else if (key === 'textContent') {
      node.textContent = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      // onClick → 'click', onMouseEnter → 'mouseenter'
      const eventName = key.slice(2).toLowerCase();
      node.addEventListener(eventName, value);
    } else {
      node.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child === undefined || child === null) continue;
    node.append(child);
  }

  return node;
}