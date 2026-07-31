export function initializeBlogTagNav(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-blog-tag-nav]').forEach(nav => {
    if (nav.dataset.blogTagDisclosureReady === 'true') return;

    const button = nav.querySelector<HTMLButtonElement>('.blog-tag-toggle');
    const overflow = nav.querySelector<HTMLElement>('[data-blog-tag-overflow]');

    if (!button || !overflow) return;

    nav.dataset.blogTagDisclosureReady = 'true';
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      overflow.hidden = isExpanded;
      button.setAttribute('aria-expanded', String(!isExpanded));
      button.textContent = isExpanded
        ? button.dataset.showMoreLabel ?? ''
        : button.dataset.showLessLabel ?? '';
    });
  });
}
