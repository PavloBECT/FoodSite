// Lesson63
// Creating a Modal Window
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
            timeInterval = setTimeout(updateClock, 10000);

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


    //////// Lesson 63
    // Модальне вікно "Передзонить мені"
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    //На всі кнопки "Зв'язатися з нами" призначаємо обробку події 'click'
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            //Перевіряємо чи присутній класс show. Якщо не присутній додаємо.
            modal.classList.toggle('show');
            //Блокуємо прокрутку основної сторінки
            document.body.style.overflow = 'hidden';
        });
    });

    //У вікні modal призначаємо обробчик події на кнопку закрити
    modalCloseBtn.addEventListener('click', closeModal);

    //Призначемо обробчик події батьківському елементу
    //Тобто якщо клікнулт поза межами modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        };
    });

    function closeModal() {
        //Перевіряємо чи присутній класс show. Якщо присутній видаляємо.
        modal.classList.toggle('show');
        //РозБлокуємо прокрутку основної сторінки
        document.body.style.overflow = '';
    };

    //Призначаємо обробчик події всій формі (натискання Esc)
    document.addEventListener('keydown', (e) => {
        //Перевіряємо що кнопка дійсно Escape та наше вікно відображене
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});