// Loads the Vimeo Player SDK once and resolves with window.Vimeo.
let promise;

export function loadVimeo() {
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    if (window.Vimeo && window.Vimeo.Player) { resolve(window.Vimeo); return; }
    const tag = document.createElement('script');
    tag.src = 'https://player.vimeo.com/api/player.js';
    tag.onload = () => resolve(window.Vimeo);
    tag.onerror = reject;
    document.head.appendChild(tag);
  });
  return promise;
}
