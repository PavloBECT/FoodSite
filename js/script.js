// Lesson83
// Creating a Slider on a Website, Option 2
//
// Command to start json-server
// npx json-server --watch db.json

"use strict";

window.addEventListener('DOMContentLoaded', () => {

    //TABS
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    };
    function showTabContent(tab = 0) {
        tabContent[tab].classList.add('show', 'fade');
        tabContent[tab].classList.remove('hide');
        tabs[tab].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, index) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(index);
                };
            });
        };
    });

    //TIMER
    const deadLine = '2026-01-01';

    function getTimeRemaning(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t <= 0) {
            const timer = document.querySelector('.timer');
            timer.querySelector('#days').innerHTML = getZero(0);
            hours = timer.querySelector('#hours').innerHTML = getZero(0);
            minutes = timer.querySelector('#minutes').innerHTML = getZero(0);
            seconds = timer.querySelector('#seconds').innerHTML = getZero(0);
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60)) % 24),
                minutes = Math.floor((t / (1000 / 60)) % 60),
                seconds = Math.floor((t / 1000) % 60);
        };
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        };
    };

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setTimeout(updateClock, 15000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaning(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        };
    };

    if (Date.parse(deadLine) - Date.parse(new Date()) > 0) {
        setClock('.timer', deadLine);
    } else {
        getTimeRemaning(deadLine);
    };

    // MODAL WINDOW
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        };
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modelTimer);
    };

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        };
    });

    const modelTimer = setTimeout(openModal, 150000);

    window.addEventListener('scroll', showModalByScroll);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    };

    // MENU CARDS
    class Card {
        constructor(title, altText, description, price, bgImage, parentSelector, ...classes) {
            this.title = title;
            this.altText = altText;
            this.description = description;
            this.price = price;
            this.bgImage = bgImage;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 43.5;
        }

        changeToUAH() {
            return +this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length < 1) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            };

            element.innerHTML = `
                <img src=${this.bgImage} alt=${this.altText}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Ціна:</div>
                    <div class="menu__item-total"><span>${this.changeToUAH()}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    };

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not feach ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(
                ({ title, altimg, descr, price, img }) => {
                    new Card(title, altimg, descr, price, img, '.menu .container').render();
                }
            );
        });

    // FORMS
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: "Дякуємо! Ми зв'яжемося з Вами у найближчий час.",
        failure: 'Щось пішло не за планом...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    };

    // Beautiful User Notification
    function showThanksModal(message) {

        const previousModalDialog = document.querySelector('.modal__dialog');
        previousModalDialog.classList.add('hide');

        openModal();

        const thanksModal = document.createElement('div');

        thanksModal.classList.add('modal__dialog');

        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="model__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    };

    //Lesson83
    //Slider carusele

    //В HTML створимо обгортку <div class="offer__slider-inner"></div>  для наших слайдів

    //Отримуємо елементи зі сторінки
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        //Розмір ширини отримаємо з вже завантаженої сторінки, до якої вже застосовані стилі
        width = window.getComputedStyle(slidesWrapper).width;

    //Заведемо змінну для номеру активного слайду
    let slideIndex = 1;

    //Для розуміння відступу задамо змінну
    let offset = 0;

    //Встановлюємо ширину каруселі 100%. Для переводу в css стиль треба зразу з % 
    slidesField.style.width = 100 * slides.length + '%';

    //Міняємо властивість display на flex
    slidesField.style.display = 'flex';

    //Міняємо властивість transition на flex
    slidesField.style.transition = '0.5s all';

    //Обмжемо відображення елементів в середині slidesWrapper
    //Всі, що не влазять скриємо.
    slidesWrapper.style.overflow = 'hidden';

    //Всі слайди повинні потрапити всередину блоку
    //Всі слайди повинні мати одноковий розмір, тому підправимо це
    slides.forEach(slide => {
        slide.style.width = width;
    });

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    };

    //Обробка натискання на кнопку
    next.addEventListener('click', () => {
        //Контроль граничних значень
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else offset += +width.slice(0, width.length - 2);

        //Зміщуємо стріку слайдів вліво
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        };

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        //Контроль граничних значень
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1)
        } else offset -= +width.slice(0, width.length - 2);

        //Зміщуємо стріку слайдів вліво
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        };

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });
});