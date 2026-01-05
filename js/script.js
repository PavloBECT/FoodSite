// Lesson94
// Build our project and fix bugs
//
// npm init -y
// npm install webpack webpack-cli --save-dev
// npx webpack
//
//
// Command to start json-server
// npx json-server --watch db.json

"use strict";

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