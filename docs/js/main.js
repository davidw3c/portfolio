var nav_toggle = document.getElementById('nav_toggle');
var nav = document.querySelector('.header-nav');


nav_toggle.addEventListener('click', function(event) {
	event.preventDefault();

	if(nav.classList.contains('visible')) {
		nav_toggle.textContent = "Show Menu";
		nav.classList.remove('visible');
	} else {
		nav_toggle.textContent = "Hide Menu";
		nav.classList.add('visible');
	}
});