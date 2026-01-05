// Lesson92
// Webpack. Building our project
//
// npm init -y
// npm install webpack webpack-cli --save-dev
// npx webpack
//
//
// Command to start json-server
// npx json-server --watch db.json

"use strict";

window.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs'),
        modal = require('./modules/modal'),
        calc = require('./modules/calc'),
        cards = require('./modules/cards'),
        forms = require('./modules/forms'),
        slider = require('./modules/slider'),
        timer = require('./modules/timer');

    tabs();
    modal();
    calc();
    cards();
    forms();
    slider();
    timer();
});