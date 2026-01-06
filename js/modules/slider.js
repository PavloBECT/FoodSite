import { getZero } from "../services/services.js";

function slider({ container, slide, nextArrow, prevArrow, totalcounter, currentCounter, wrapper, field }) {

    const slider = document.querySelector(container),
        slides = document.querySelectorAll(slide),
        prev = document.querySelector(prevArrow),
        next = document.querySelector(nextArrow),
        total = document.querySelector(totalcounter),
        current = document.querySelector(currentCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        indicators = document.createElement('ol'),
        dots = [],
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
        if (offset == deleteNotDigit(width) * (slides.length - 1)) {
            offset = 0;
        } else offset += deleteNotDigit(width);

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        };

        current.textContent = getZero(slideIndex);

        setActiveDot(slideIndex - 1);
    });

    prev.addEventListener('click', () => {

        if (offset == 0) {
            offset = deleteNotDigit(width) * (slides.length - 1);
        } else offset -= deleteNotDigit(width);

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        };

        current.textContent = getZero(slideIndex);

        setActiveDot(slideIndex - 1);
    });

    slider.style.position = 'relative';

    indicators.classList.add('carousel-indicators');

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

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
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
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    };

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigit(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;
            setActiveDot(slideIndex - 1);
            current.textContent = getZero(slideIndex);
        });
    });

    function setActiveDot(index) {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[index].style.opacity = 1;
    };

    function deleteNotDigit(str) {
        return +str.replace(/\D/g, '');
    };
};

export default slider;