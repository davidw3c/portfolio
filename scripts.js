var menu_toggle = document.getElementById('menu-toggle');
var menu = document.querySelector('.header-nav');
var header_nav_underlay = document.querySelector('.header-nav-underlay');

menu_toggle.addEventListener('click', function() {

	if (this.classList.contains('inactive')) {
		// Make the mobile menu ACTIVE
		this.classList.remove('inactive');
		this.classList.add('active');
		menu.classList.remove('hidden-mobile');
		menu.classList.add('visible-mobile');
		header_nav_underlay.classList.remove('inactive');
		header_nav_underlay.classList.add('active');
	} else {
		// Make the mobile menu INACTIVE
		this.classList.add('inactive');
		this.classList.remove('active');
		menu.classList.add('hidden-mobile');
		menu.classList.remove('visible-mobile');
		header_nav_underlay.classList.add('inactive');
		header_nav_underlay.classList.remove('active');		
	}

});

header_nav_underlay.addEventListener('click', function() {

	// Make the mobile menu INACTIVE
	menu_toggle.classList.add('inactive');
	menu_toggle.classList.remove('active');
	menu.classList.add('hidden-mobile');
	menu.classList.remove('visible-mobile');
	header_nav_underlay.classList.add('inactive');
	header_nav_underlay.classList.remove('active');	

});