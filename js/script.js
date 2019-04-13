const switcher = document.querySelector('#cbx'),
    more = document.querySelector('.more'),
    modal = document.querySelector('.modal'),
    videos = document.querySelectorAll('.videos__item');

let player;

function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        'element': document.querySelector(trigger),
        'active': false
    };
    const box = document.querySelector(boxBody),
        boxContent = document.querySelector(content);

    button.element.addEventListener('click', () => {
        if (button.active === false) { 
            button.active = true;
            box.style.height = boxContent.clientHeight + 'px';
            box.classList.add(openClass); 
        } else {
            button.active = false;
            box.style.height = 0 + 'px';
            box.classList.remove(openClass);
        }
    });
}

function switchMode() {
    if (!document.body.classList.contains('night')) {
        document.body.classList.add('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = '#fff';
        });
        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = '#fff';
        });
        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = '#fff';
        });
        document.querySelector('.header__item-descr').style.color = '#fff';
        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    } else {
        document.body.classList.remove('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = '#000';
        });
        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = '#000';
        });
        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = '#000';
        });
        document.querySelector('.header__item-descr').style.color = '#000';
        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
}

bindSlideToggle('.hamburger', '[data-slide="nav"]', '.header__menu', 'slide-active');
switcher.addEventListener('change', () => {
    switchMode();
});