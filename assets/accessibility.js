new MutationObserver(() => {
  document.querySelectorAll('picture').forEach(el => {
    el.removeAttribute('role')
  })
  document.querySelectorAll('div[role="button"]').forEach(el => {
    el.removeAttribute('role')
  })
}).observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('picture').forEach(el => {
  el.removeAttribute('role')
})

document.querySelectorAll('div[role="button"]').forEach(el => {
  el.removeAttribute('role')
})
