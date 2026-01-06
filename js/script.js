// Lesson98
// How to turn ES6+ code into the old ES5 format.
// Babel, Core.js, and polyfills
//
// npm init -y
// npm install webpack webpack-cli --save-dev
// npx webpack
//
//
// Command to start json-server
// npx json-server --watch db.json

"use strict";
//Додамо використання поліфілу
import 'es6-promise/auto.js';
//require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

//import 'slick-slider'; Приклад використання стороннього скрипту

import tabs from './modules/tabs.js';
import modal from './modules/modal.js';
import calc from './modules/calc.js';
import cards from './modules/cards.js';
import forms from './modules/forms.js';
import slider from './modules/slider.js';
import timer from './modules/timer.js';
import { openModal } from './modules/modal.js';

window.addEventListener('DOMContentLoaded', () => {

    //Запуск таймеру перенесаний в головний файл скрипту
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 150000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    calc();
    cards();
    forms('formm', modalTimerId);
    timer('.timer', '2026-01-01');
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalcounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});

// BABEL - трансплітер, це інструмент, який перетворює код з нового формату в старий для застарілих браузерів
// Поліфіли - це участки коду, які емулюють поведінку сучасних стандартів
// (наприклад forEach в застарілих версіях перетворюється на додаткову функцію)
// babeljs.io
// Preset - набір налаштувань, який буде використовуватися в нашом проекті

// npm install --save-dev @babel/core @babel/cli @babel/preset-env
// npm install --save @babel/polyfill           //встановлюємо окремо, бо вони встроюються в готовий продукт
// можна створити окремо файл налаштувань babel.config.json     але ми внесемо налаштування в наш файл webpack.config.js
// npm i --save-dev babel-loader
// npm i --save-dev core-js

// https://browserslist.dev/ - перевірка браузерів

// ES-6 promise polyfill шукаємо в гугл         npm install es6-promise
// NodeList.forEach polyfill                    npm i nodelist-foreach-polyfill