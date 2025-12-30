// Lesson77
// Fetch API
//

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

    // Modal window
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
        }
    });

    const modelTimer = setInterval(openModal, 150000);

    window.addEventListener('scroll', showModalByScroll);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    };

    // Menu Cards
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

    new Card(
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
        'menu__item'
    ).render();

    new Card(
        'Меню "Пісне"',
        "post",
        'Меню “Пісне” - це ретельний відбір інгредієнтів: повна відсутність продуктів тваринного походження, молоко з мигдалю, вівса, кокоса або гречки, потрібну кількість білків з тофу та імпортних вегетаріанських стейків.',
        14,
        "img/tabs/post.jpg",
        '.menu .container',
        'menu__item'
    ).render();

    // FORMS
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: "Дякуємо! Ми зв'яжемося з Вами у найближчий час.",
        failure: 'Щось пішло не за планом...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
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

            //Просто так form не можливо перетворити на json
            //Тому потрвбно зробити додатково document.element перетворити на object
            const obj = {};
            formData.forEach(function (value, key) {
                obj[key] = value;
            });

            //Lesson77. Використаємо API та Promise                 //Lesson77
            //fetch ('serverSTD.php', {
            fetch('serverJSON.php', {
                method: 'POST',                                     //Видалити для TEXT format
                headers: {                                          //Видалити для TEXT format
                    'Content-type': 'application/json'              //Видалити для TEXT format
                },                                                  //Видалити для TEXT format
                //body: formData                                    //Text format
                body: JSON.stringify(obj)                           //JSON format
                //Потрібно обробити дані (відповідь з серверу)
            }).then(data => data.text())
                //Потрібно обробити дані (відповідь з серверу)
                .then(data => {
                    console.log(data);
                    //Сповіщаємо користувача, що все гаразд
                    //Lesson75 змінюємо повідомлення на форму
                    showThanksModal(message.success);
                    // Встановлюємо таймер для видалення сповіщення для користувача
                    statusMessage.remove();
                }).catch(() => {
                    // Змінюємо повідомлення на форму
                    showThanksModal(message.failure);
                    //Якщо під час запиту вказати неправильну адресу ми не попадемо у це виключення
                    //бо promise відпрацював правильно та отримав статус 404, тобто дані від серверу повернулися
                    //Цей блок спрацює лише за відсутності відповіді серверу 
                }).finally(() => {
                    // Очищаємо форму (ім'я та номер телефону)
                    form.reset();
                });

            //відправляємо запит, додавши formData як параметр
            //Звичайний formData
            //request.send(formData);

            //відправляємо запит, додавши formData як параметр
            //Звичайний формат json
            /* request.send(json);                                     //Видалено для Lesson77 */

            //Формуємо обробчик події на завантаження даних 
            /* request.addEventListener ('load', () => {                //Видалено для Lesson77
                // Перевіряємо, що статус ОК
                if (request.status === 200) {
                    console.log(request.response);
                    //Сповіщаємо користувача, що все гаразд
                    //Lesson75 змінюємо повідомлення на форму
                    showThanksModal(message.success);
                    // Очищаємо форму (ім'я та номер телефону)
                    form.reset();
                    // Встановлюємо таймер для видалення сповіщення для користувача
                    statusMessage.remove();
                } else {
                    // Lesson75 змінюємо повідомлення на форму
                    showThanksModal(message.failure);
                };
            }); */
        });
    };

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

    //Lesson77
    //API   Application Programming Interface
    //DOM API

    //Команда fetch повертає нам Promise як результат
    //Дає можливість виконати запит на сервер
    /*   fetch('https://jsonplaceholder.typicode.com/todos/1')   //Повертає проміс GET запит
        .then(response => response.json())                    //Повертає json
        .then(json => console.log(json));                     //Виводить на консоль */

    //Наступний варіант дозволяє формувати розширений запит
    /*    fetch('https://jsonplaceholder.typicode.com/posts', {
           method: "POST",                                     //Тип запиту GET, POST, PUT ...
           body: JSON.stringify({name: 'Alex'}),               //Наші дані для запиту
           headers: {                                          //Заголовки запиту    
               'Content-type': 'application/json'              //Безпосаредньо, що дані у форматі json
           }
       })   //Повертає проміс
         .then(response => response.json())                    //Повертає json
         .then(json => console.log(json));                     //Виводить на консоль   */

    //Наступні дії будуть в коді вище, дивись коментарі
});