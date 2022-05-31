const scrollForHeader = () => {
    const headerElem = document.querySelector('.header')

    window.addEventListener('scroll', () => {
        if (pageYOffset >= 800) {
            headerElem.classList.add('header--active')
        } else {
            headerElem.classList.remove('header--active')
        }
    })
}

scrollForHeader()