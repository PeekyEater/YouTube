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

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach(item => {
        item.textContent.trim();
        if (item.textContent.length < count) {
            return;
        } else {
            const str = item.textContent.slice(0, count + 1) + '...';
            item.textContent = str;
        }
    });
}

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    player.stopVideo();
}

function bindModal(cards) {
    cards.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = item.getAttribute('data-url');
            loadVideo(id);
            openModal();
        });
    });
}

function createVideo() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
   setTimeout(() => {
    player = new YT.Player('frame', {
        height: '100%',
        width: '100%',
        videoId: 'M7lc1UVf-VE',
      });
   }, 500);
}

function loadVideo(id) {
    player.loadVideoById({'videoId': `${id}`});
}

function start(number = 9) {
    gapi.client.init({
        'apiKey': 'AIzaSyB03ygVmuojHox1yYAZUz8l2FZA9gwt7TI',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function(){
        return gapi.client.youtube.playlistItems.list({
            "part": "snippet,contentDetails",
            "maxResults": `${number}`,
            "playlistId": "PLnOieOP_Tjow38LqU7FfgvSQ5_g5qnnWA" 
        });
    }).then(function(response){
        const videosWrapper = document.querySelector('.videos__wrapper');
        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.classList.add('videos__item', 'videos__item-active');
            card.setAttribute('data-url', item.contentDetails.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    loading...
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');}, 100);
            if(document.body.classList.contains('night')) {
                card.querySelector('.videos__item-descr').style.color = '#fff';
                card.querySelector('.videos__item-views').style.color = '#fff';
            }
            setViewCount(card,item.contentDetails.videoId);
        });
        sliceTitle('.videos__item-descr', 100);
        bindModal(document.querySelectorAll('.videos__item'));
    }).catch(e => {
        console.log(e);
    });
}

function search(target) {
    if(document.getElementById('suggested')) document.getElementById('suggested').remove();
    gapi.client.init({
        'apiKey': 'AIzaSyB03ygVmuojHox1yYAZUz8l2FZA9gwt7TI',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
        return gapi.client.youtube.search.list({
            'maxResults': '6',
            'part': 'snippet',
            'q': `${target}`,
            'type': ''
        });
    }).then(function (response) {
        const videosWrapper = document.querySelector('.videos__wrapper');
        console.log(response.result);
        while(videosWrapper.firstChild){
            videosWrapper.removeChild(videosWrapper.firstChild);
        }
        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.classList.add('videos__item', 'videos__item-active');
            card.setAttribute('data-url', item.id.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    loading...
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');}, 10);
            if(document.body.classList.contains('night')) {
                card.querySelector('.videos__item-descr').style.color = '#fff';
                card.querySelector('.videos__item-views').style.color = '#fff';
            }
            setViewCount(card,item.id.videoId);
        });
        sliceTitle('.videos__item-descr', 100);
        bindModal(document.querySelectorAll('.videos__item'));
    });
}

function addLess(parent) {
    if(document.getElementById('less')){
        return ;
    }
    let less = document.createElement('button');
    less.classList.add('less');
    less.id = 'less';
    less.innerHTML = 'Show less';
    parent.appendChild(less);
    less.addEventListener('click', () => {
        const videosWrapper = document.querySelector('.videos__wrapper');
        document.querySelector('.less').remove();
        while( videosWrapper.firstChild ) {
            videosWrapper.removeChild(videosWrapper.firstChild);
        }
        setTimeout( () => {
        more.style.display = 'block';
        }, 0);
    });
    more.style.display = 'none';
    setTimeout( () => {
    less.style.opacity = '1';
    }, 1000);
}

function setViewCount(item, targetID){
    gapi.client.init({
        'apiKey': 'AIzaSyB03ygVmuojHox1yYAZUz8l2FZA9gwt7TI',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
        return gapi.client.youtube.videos.list({
            'part': 'statistics',
            'id': `${targetID}`
        });
    }).then(function (response) {
        item.querySelector('.videos__item-views').innerHTML = `${response.result.items[0].statistics.viewCount} people wached this video`;
    });
}

bindSlideToggle('.hamburger', '[data-slide="nav"]', '.header__menu', 'slide-active');

switcher.addEventListener('change', () => {
    switchMode();
});

modal.addEventListener('click', (e) => {
    if (!e.target.classList.contains('modal__body')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
});

more.addEventListener('click', () => {
    const videosWrapper = document.querySelector('.videos__wrapper');
    while(videosWrapper.firstChild){
        videosWrapper.removeChild(videosWrapper.firstChild);
    }
    addLess(document.querySelector('.videos'));
    gapi.load('client', start);
});

createVideo();

document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    gapi.load('client', () => {search(document.querySelector('.search > input').value);});
    document.querySelector('.search > input').value = '';
    addLess(document.querySelector('.videos'));
});

(() => {
    gapi.load('client', () => {start(3);});
})();

