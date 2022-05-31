// Burger

const burger = ()=> {

	const burgerBtn = document.querySelector('.burger')
	const navMenu = document.querySelector('.nav__list')
	const navItems = document.querySelectorAll('.nav__item')
	
	burgerBtn.addEventListener('click', () => {
		burgerBtn.classList.toggle('burger--active')
		navMenu.classList.toggle('nav__list--active')
	})

	navItems.forEach(item => {
		item.addEventListener('click', () => {
			navItems.forEach((navItem) => {
				navItem.classList.remove('nav__item--active')
			})

			item.classList.add('nav__item--active')
		})
	})
}

burger()
