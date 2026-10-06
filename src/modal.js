import { el } from './dom.js';
export function createModal({ title, onClose } = {}) {
  const titleEl = el('h2', { className: 'modal__title', textContent: title || '' });
  const body = el('div', { className: 'modal__body' });
  const actions = el('div', { className: 'modal__actions' });

  const closeBtn = el('button', {
    className: 'button',
    type: 'button',
    textContent: 'Закрыть',
    onClick: () => close(),
  });

  actions.append(closeBtn);

  const content = el('div', { className: 'modal__content' }, [titleEl, body, actions]);
  const dialog = el('dialog', { className: 'modal' }, [content]);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (typeof onClose === 'function') onClose();
  });

  function open() {
    document.body.append(dialog);
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  function setBody(nodes) {
    body.replaceChildren(...(Array.isArray(nodes) ? nodes : [nodes]));
  }

  function setActions(nodes) {
    actions.replaceChildren(...(Array.isArray(nodes) ? nodes : [nodes]));
  }

  return { dialog, open, close, setBody, setActions, body, actions };
}