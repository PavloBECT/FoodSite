"use strict";

let path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",

  module: {     //Модулі, що будуть використовуватися
    rules: [    //Правила для файлів
      {
        test: /\.m?js$/,     // Регулярний вираз: шукає крапку, не обов'язково m нуль або один раз, та js $ - в кінці рядку (Фактично: .js або .mjs)
        exclude: /(node_modules|bower_components)/,   //файли для виключення
        use: {                                          //будемо використовувати
          loader: 'babel-loader',                       // потрібно встановити в проект... npm i --save-dev babel-loader
          options: {
            presets: [['@babel/preset-env', {         //пресет babel
              debug: true,                            //з можливісттю відлагодження
              corejs: 3,                              // corejs бібліотека версії 3   npm i --save-dev core-js
              useBuiltIns: "usage"                    // дозволяє підключати тільки поліфіли, що будуть застосовані для коду проекту
            }]]
          }
        }
      }
    ]
  }
};