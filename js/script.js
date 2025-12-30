// Lesson80
// Getting data from the server. Asyns/Await (ES8)
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
        //Запит виконується асінхронно
        const res = await fetch(url);
        //Але потрібно перевірити ще статус
        if (!res.ok) {
            //У випадку, що запит не пройшов - видамо помилку
            throw new Error(`Could not feach ${url}, status: ${res.status}`);
        }
        //Повертаємо результат promise, конвертуємо в json
        //Так само дочекаємося результату від res.json(), а потім передамо в return
        return await res.json();
    };

    //Варіант №1
    //Видалемо код який повторюється та замінимо даними, які ми отримуємо з серверу
    /*     getResource('http://localhost:3000/menu')
            .then(data => {
                //З отриманих даних перебираємо всі об'єкти
                data.forEach(
                    //Для простоти деструктуруємо (розложимо на прості елементи)
                    ({title, altimg, descr, price, img}) => {
                    //Тепер створимо стільки карток, скільки їх є в базі
                    //Код зменшився в декілька разів, не треба кожну картку створювати окремо
                    new Card(title, altimg, descr, price, img, '.menu .container').render();
                });
            }); */

    //Варіант №2
    getResource('http://localhost:3000/menu')
        .then(data => createCard(data));

    //Функція дінамічного формування елементів на стрінці   
    function createCard(data) {
        data.forEach(
            ({ title, altimg, descr, price, img }) => {
                const element = document.createElement('div');
                element.classList.add('menu__item');
                element.innerHTML = `
                    <img src=${img} alt=${altimg}>
                    <h3 class="menu__item-subtitle">${title}</h3>
                    <div class="menu__item-descr">${descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Ціна:</div>
                        <div class="menu__item-total"><span>${price * 43.5}</span> грн/день</div>
                    </div>
                `;
                document.querySelector('.menu .container').append(element);
            })
    };


    /* new Card(
        'Меню "Фитнес"',
        "vegy",
        'Меню "Фітнес" - це новий підхід до приготування блюд: більше свіжих овочів та фруктів. Продукт активних і здорових людей. Це абсолютно новий продукт з оптимальною ціною та високою якісттю!',
        9,
        "img/tabs/vegy.jpg",
        '.menu .container',
        'menu__item'
    ).render();
    
    new Card(
        'Меню “Преміум”',
        "elite",
        'В меню “Преміум” ми використовуємо не тільки красивий дізайн пакування, але й якісне виконання блюд. Червона риба, морепродукти, фрукти - ресторанне меню без походу в ресторан!',
        21,
        "img/tabs/elite.jpg",
        '.menu .container',
        'menu__item',
        'big'
    ).render();

    new Card(
        'Меню "Пісне"',
        "post",
        'Меню “Пісне” - це ретельний відбір інгредієнтів: повна відсутність продуктів тваринного походження, молоко з мигдалю, вівса, кокоса або гречки, потрібну кількість білків з тофу та імпортних вегетаріанських стейків.',
        14,
        "img/tabs/post.jpg",
        '.menu .container',
        'menu__item',
        'big'
    ).render(); */

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

    //Lesson80
    //Конфігуруємо запрос до JSON-сервера
    //Використаємо async - await для уникнення помилки
    //при очікуванні відповіді, тобто return буде виконано тільки 
    //після отримання результату fetch
    const postData = async (url, data) => {
        //Запит виконується асінхронно
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        //Повертаємо результат promise, конвертуємо в json
        //Так само дочекаємося результату від res.json(), а потім передамо в return
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

            /* const obj = {};                                      
            formData.forEach(function (value, key) {
                obj[key] = value;
            }); */
            //Замінемо об'єкт на json
            //Спочатку formData (псевдо масив) перетворюємо на масив масивів
            //Потім масив масивів перетворюємо на об'єкт
            //І вже тепер об'єкт перетворюємо на JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            /*  fetch ('serverJSON.php', {
                method: 'POST',                                     
                headers: {                                          
                    'Content-type': 'application/json'              
                },                                                                                    
                body: JSON.stringify(obj)                           
            }) */
            //Замінюємо наш старий код на функцію, та вказуємо наш сервер, а перетворення на JSON тут вже не потрібне
            postData('http://localhost:3000/requests', json)            //JSON.stringify(obj))
                //.then(data => data.text())        //Не потрібно, так як сервер вже обробляє сам
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

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});