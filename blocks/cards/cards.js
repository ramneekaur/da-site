import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * A cell is an image cell when it holds a single picture/img (optionally
 * wrapped in a paragraph by EDS) and no text content.
 * @param {Element} cell
 * @returns {boolean}
 */
function isImageCell(cell) {
  return cell.children.length === 1
    && !!cell.querySelector('picture, img')
    && cell.textContent.trim() === '';
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = isImageCell(div) ? 'cards-card-image' : 'cards-card-body';
    });
    ul.append(li);
  });
  // createOptimizedPicture keeps only the path, so leave external images untouched
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (new URL(img.src, window.location.href).origin !== window.location.origin) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
