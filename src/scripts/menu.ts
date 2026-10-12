// The site's navigation on a narrow screen: the list folds behind a Menu
// button, which opens and closes it. Without this script the list is simply
// shown, so every page can still be reached.

const NARROW = window.matchMedia('(max-width: 47.99rem)');

const siteNavigation = document.querySelector<HTMLElement>('.masthead__nav');
const menuButton = siteNavigation?.querySelector<HTMLButtonElement>('.masthead__toggle');

if (siteNavigation && menuButton) {
	const setOpen = (open: boolean) => {
		menuButton.setAttribute('aria-expanded', String(open));
		siteNavigation.dataset.menu = open ? 'open' : 'closed';
	};

	menuButton.hidden = false;
	setOpen(false);
	menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));

	// Escape closes the menu and returns to its button.
	siteNavigation.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape' || !NARROW.matches || menuButton.getAttribute('aria-expanded') !== 'true') return;
		setOpen(false);
		menuButton.focus();
	});
}
