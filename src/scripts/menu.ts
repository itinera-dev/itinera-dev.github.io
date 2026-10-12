// The site's navigation on a narrow screen: the list folds behind a Menu
// button, which opens and closes it. Without JavaScript the list is simply
// shown, so every page can still be reached; Base.astro marks the page with
// the class `js` before it is drawn, so the list never shows and then folds.

const siteNavigation = document.querySelector<HTMLElement>('.masthead__nav');
const menuButton = siteNavigation?.querySelector<HTMLButtonElement>('.masthead__toggle');

if (siteNavigation && menuButton) {
	const isOpen = () => menuButton.getAttribute('aria-expanded') === 'true';
	const setOpen = (open: boolean) => {
		menuButton.setAttribute('aria-expanded', String(open));
		siteNavigation.dataset.menu = open ? 'open' : 'closed';
	};
	const outside = (target: EventTarget | null) => !(target instanceof Node && siteNavigation.contains(target));

	menuButton.hidden = false;
	setOpen(false);
	menuButton.addEventListener('click', () => setOpen(!isOpen()));

	// The open list covers the page, so it closes as soon as the reader leaves it.
	siteNavigation.addEventListener('focusout', (event) => {
		if (isOpen() && event.relatedTarget !== null && outside(event.relatedTarget)) setOpen(false);
	});
	document.addEventListener('click', (event) => {
		if (isOpen() && outside(event.target)) setOpen(false);
	});
	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape' || !isOpen()) return;
		setOpen(false);
		menuButton.focus();
	});
}
