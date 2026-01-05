//Винесемо ці дві функції на зовні
//Та додамо в кінці файлу до експорту

//Для таймера необхідно передавати ще й modalTimerId
function openModal(modalSelector, modalTimerId) {
    modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    //Перевіримо чи переданий параметр в функцію
    console.log(modalTimerId);
    if (modalTimerId) {
        //Тільки тепер вимикаємо таймер
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
};


//Переробимо функцію для використання з аргументами triggerSelector, modalSelector, modalTimerId
function modal(triggerSelector, modalSelector, modalTimerId) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        };
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    //Перенесемо в script.js
    //const modalTimer = setTimeout(openModal, 150000);

    window.addEventListener('scroll', showModalByScroll);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        };
    };
};

export default modal;

//Додамо до експорту
export { closeModal };
export { openModal };