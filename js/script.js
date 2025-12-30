// Lesson69
// Modal Window Modifications
// 

"use strict";

window.addEventListener('DOMContentLoaded', () => {

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

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        };
    });

    function openModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modelTimer);
    }

    function closeModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modelTimer = setInterval(openModal, 15000);

    window.addEventListener('scroll', showModalByScroll);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    };

    // Lesson69
    // Створення карток меню на базі класу
    class Card {
        constructor(title, altText, description, price, bgImage, parentSelector) {
            this.title = title;
            this.altText = altText;
            this.description = description;
            this.price = price;
            this.bgImage = bgImage;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 43.5;
        }

        changeToUAH() {
            return +this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                 <div class="menu__item">
                    <img src=${this.bgImage} alt=${this.altText}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Ціна:</div>
                        <div class="menu__item-total"><span>${this.changeToUAH()}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // Так як об'єкт будемо використовувати разово, то немає сенсу створювати змінну
    // Створимо об'єкт, помістимо на форму, після чого збирач сміття його видалить
    new Card(
        'Меню "Фитнес"',
        "vegy",
        'Меню "Фітнес" - це новий підхід до приготування блюд: більше свіжих овочів та фруктів. Продукт активних і здорових людей. Це абсолютно новий продукт з оптимальною ціною та високою якісттю!',
        9,
        "img/tabs/vegy.jpg",
        '.menu .container'
    ).render();

    new Card(
        'Меню “Преміум”',
        "elite",
        'В меню “Преміум” ми використовуємо не тільки красивий дізайн пакування, але й якісне виконання блюд. Червона риба, морепродукти, фрукти - ресторанне меню без походу в ресторан!',
        21,
        "img/tabs/elite.jpg",
        '.menu .container'
    ).render();

    new Card(
        'Меню "Пісне"',
        "post",
        'Меню “Пісне” - це ретельний відбір інгредієнтів: повна відсутність продуктів тваринного походження, молоко з мигдалю, вівса, кокоса або гречки, потрібну кількість білків з тофу та імпортних вегетаріанських стейків.',
        14,
        "img/tabs/post.jpg",
        '.menu .container'
    ).render();
});