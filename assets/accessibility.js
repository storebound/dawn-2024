new MutationObserver(() => {
  document.querySelectorAll('picture').forEach(el => {
    el.removeAttribute('role')
  });
  document.querySelectorAll('div[role="button"]').forEach(el => {
    el.removeAttribute('role')
  });
  document.querySelectorAll('img').forEach(el => {
    if (!el.hasAttribute('alt')) {
        el.setAttribute('alt', '')
    }
  });
  document.querySelectorAll('button[data-replo-add-product-variant-to-cart]').forEach(el => {
    if (!el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', 'Add to cart')
    }
  });
}).observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('picture').forEach(el => {
  el.removeAttribute('role')
})

document.querySelectorAll('div[role="button"]').forEach(el => {
  el.removeAttribute('role')
})

document.querySelectorAll('img').forEach(el => {
    if (!el.hasAttribute('alt')) {
        el.setAttribute('alt', '')
    }
})

document.querySelectorAll('button[data-replo-add-product-variant-to-cart]').forEach(el => {
    if (!el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', 'Add to cart')
    }
})
