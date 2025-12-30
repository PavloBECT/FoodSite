// Lesson84
// Creating Slide Navigation
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
            };
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
                // 1) Спосіб
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

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
    }

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
        }
        );

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

    //New Slider - carusele
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;

    let offset = 0;

    slidesField.style.width = 100 * slides.length + '%';

    slidesField.style.display = 'flex';

    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    total.textContent = getZero(slides.length);
    current.textContent = getZero(slideIndex);

    next.addEventListener('click', () => {

        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else offset += +width.slice(0, width.length - 2);

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        };

        current.textContent = getZero(slideIndex);

        //Lesson84
        //Додаємо інтерактив до крапок знизу
        //Функція для застосування стилю активної крапки
        setActiveDot(slideIndex - 1);
    });

    prev.addEventListener('click', () => {

        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else offset -= +width.slice(0, width.length - 2);

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        };

        current.textContent = getZero(slideIndex);

        //Lesson84
        //Додаємо інтерактив до крапок знизу
        //Функція для застосування стилю активної крапки
        setActiveDot(slideIndex - 1);
    });

    //Lesson84
    //Додавання крапок на слайдер
    //Крапки будуть генеруватися скриптом та будуть розташовані внизу слайдера

    //Треба отримати як елемент весь слайдер
    const slider = document.querySelector('.offer__slider');

    //Встановити позішін релатів, якщо такого немає (краппи будуть розташовані в нижній частині слайду)
    slider.style.position = 'relative';

    //Створимо обгортку для наших крапок
    const indicators = document.createElement('ol'),
        //Самі крапки будеио зберінати в звичайному масиві
        dots = [];

    //Призначаємо класс для нашої обгортки     
    indicators.classList.add('carousel-indicators');

    //Призначаємо стиль для нашої обгортки
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    //Додаємо обгортку до головного елементу слайдеру
    slider.append(indicators);

    //Через звичайний цикл створюємо самі крапки
    for (let i = 0; i < slides.length; i++) {
        //Створюєм крапку
        const dot = document.createElement('li');
        //Призначаємо їй атрибут
        dot.setAttribute('data-slide-to', i + 1);
        //Застосовуємо стиль
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        //Для першого елементу застосуємо виділення
        //як і у випадку з каруселлю зображень
        if (i == 0) {
            dot.style.opacity = 1;
        }
        //Тепер крапка готова для додання її на форму
        indicators.append(dot);
        //Не забуваемо додати в наш масив
        dots.push(dot);
    };

    //Для кожної крапки призначаємо обробчик клік
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            //Визначаємо номер крпаки, що був натисрутий
            const slideTo = e.target.getAttribute('data-slide-to');
            //Змвнюємо індекс зображення на номер крапки
            slideIndex = slideTo;
            //Розраховуємо положення слайду
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);
            //Міняємо слайд за отриманим розрахунком
            slidesField.style.transform = `translateX(-${offset}px)`;

            //Функція для застосування стилю активної крапки
            setActiveDot(slideIndex - 1);

            //Встановлюємо відповідний номер слайду
            current.textContent = getZero(slideIndex);
        });
    });

    //Окрема функція для позначення активної крапки 
    function setActiveDot(index) {
        //Для всіх крапок ставимо стиль, що відповідає не активності
        dots.forEach(dot => dot.style.opacity = '0.5');
        //До нашої активної крапки застосовуємо відповідний стиль
        dots[index].style.opacity = 1;
    };
});