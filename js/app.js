import '../scss/main.scss';
const firebase = require("firebase/app");
require("firebase/database");

document.addEventListener('DOMContentLoaded', function() {

    /*--------------FireBase Configuration---------------*/

    const config = {
        apiKey: "AIzaSyA9w9_qdqbKe-uIXr23T1Sfpu9WRvRcuoU",
        authDomain: "memorygame-e9c95.firebaseapp.com",
        databaseURL: "https://memorygame-e9c95.firebaseio.com",
        projectId: "memorygame-e9c95",
        storageBucket: "memorygame-e9c95.appspot.com",
        messagingSenderId: "1074554477918"
    };

    firebase.initializeApp(config);
    const refOb = firebase.database().ref().child('scores');

    /*--------------Pushing data into ScoreBoard---------------*/

    const pushToScoreBoard = () => {
        let cardsArray = [];
        let counterRows = 0
        refOb.orderByChild('score').on('value', snapshot => {
            snapshot.forEach(function (child) {
                cardsArray.push(child.val());
            });

            for (let key in cardsArray) {
                counterRows++;
                if (counterRows < 11) {
                    const tableBody = document.querySelector("tbody");
                    const tr = document.createElement("tr");
                    tableBody.appendChild(tr);
                    const td1 = document.createElement("td");
                    td1.className = "td1";
                    const td2 = document.createElement("td");
                    td2.className = "td2";
                    const td3 = document.createElement("td");
                    td3.className = "td3";
                    td1.innerHTML = counterRows;
                    td2.innerHTML = cardsArray[key].name;
                    td3.innerHTML = cardsArray[key].score;
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tableBody.appendChild(tr);
                }
            }
        })
    }

pushToScoreBoard();


    /*--------------Preparing game board---------------*/

    const cards = [
    {
    name: 'luczniczka',
    img: "url('img/resized/luczniczka.jpg')"
    },
    {
        name: 'balaton',
        img: "url('img/resized/balaton.jpg')"
    },
    {
        name: 'exploseum',
        img: "url('img/resized/exploseum_muzeum.jpg')"
    },
    {
        name: 'mural',
        img: "url('img/resized/mural.jpg')"
    },
    {
        name: 'mydlo',
        img: "url('img/resized/mydlo.jpg')"
    },
    {
        name: 'myslecinek',
        img: "url('img/resized/myslecinek.jpg')"
    },
    {
        name: 'opera',
        img: "url('img/resized/opera.jpg')"
    },
    {
        name: 'planty',
        img: "url('img/resized/planty.jpg')"
    },
    {
        name: 'pomnik',
        img: "url('img/resized/pomnik.jpg')"
    },
    {
        name: 'potop',
        img: "url('img/resized/potop.jpg')"
    },
    {
        name: 'przechodzacy',
        img: "url('img/resized/przechodzacy.jpg')"
    },
    {
        name: 'rynek',
        img: "url('img/resized/rynek.jpg')"
    },
    {
        name: 'spichrze',
        img: "url('img/resized/spichrze.jpg')"
    },
    {
        name: 'stadion',
        img: "url('img/resized/stadion.jpg')"
    },
    {
        name: 'wieza',
        img: "url('img/resized/wieza.jpg')"
    },
    {
        name: 'wyspa',
        img: "url('img/resized/wyspa.jpg')"
    },
    {
        name: 'wodociagi',
        img: "url('img/resized/wodociagi.jpg')"
    },
    {
        name: 'tramwaj',
        img: "url('img/resized/tramwaj.jpg')"
    },
]

    let cardsDuplicate = cards.concat(cards);
    const start = document.querySelector('.start_btn');
    let fields = document.querySelectorAll('.field');
    const popup = document.getElementById('popup');
    const game = document.querySelector('.game');

    /*--------------Starting function---------------*/


    function startGame() {

        //Random position of the card
        cardsDuplicate.sort(() => 0.5 - Math.random());
        creatingCards();
    }

    const creatingCards = () => {
        cardsDuplicate.forEach((item, index) => {
            fields[index].setAttribute('data-name', item.name);

            // Create front of card
            const front = document.createElement('div');
            front.classList.add('front');

            // Create back of card
            const back = document.createElement('div');
            back.classList.add('back');
            back.style.backgroundImage = item.img;

            fields[index].appendChild(front);
            fields[index].appendChild(back);
        });
    }

    const handler = event => {
        const figure = document.querySelector('figure');
        const timer = document.querySelector("span");
        startGame();
        startTimer();
        start.disabled = true;
        event.currentTarget.removeEventListener(event.type, handler);
        timer.innerHTML = '00:00'
        figure.classList.add('no-hover');
    }

    start.addEventListener('click', handler);

    /*--------------Game actions---------------*/

    const board = document.querySelector('.board');
    let counter = 0;
    let firstCard = '';
    let secondCard = '';
    let matchedNumber = 2;
    let selectedCards = [];

    /*--------------Showing cards---------------*/

    const showCard = event => {
        let element = event.target;
        if (element.nodeName === 'DIV' && counter < 2 && selectedCards.length < matchedNumber &&
            !element.parentNode.classList.contains('matched') &&
            !element.parentNode.classList.contains('selected')) {
            element.parentNode.classList.add('selected');

            if (counter === 0) {
                firstCard = element.parentNode.dataset.name;
            } else if (counter === 1) {
                secondCard = element.parentNode.dataset.name;
            }
            counter++;
        }

    }

    /*--------------Checking if cards match---------------*/

    const isMatched = () => {

        if (firstCard === secondCard && firstCard !== '' && secondCard !== '') {
            setTimeout(matched,500);
            setTimeout(reset,500);
            setTimeout(matchedUp, 1000);
        } else if (firstCard !== secondCard && counter === 2) {
            setTimeout(reset, 500);
        }
    }

    board.addEventListener('click', (event) => {
        showCard(event);
        isMatched();
    })

    /*--------------Number of matched cards---------------*/


    const matchedUp = () => {
        matchedNumber = selectedCards.length + 2;
    }

    /*--------------Hiding matched cards---------------*/

    const matched = () => {
        let selected = document.querySelectorAll('.selected');

        selected.forEach(item => {
            selectedCards.push(item);
            item.classList.add('matched');
                    })
    }

    /*--------------Reset---------------*/

    const reset = () => {
        let selected = document.querySelectorAll('.selected');

        selected.forEach(item => {
            item.classList.remove('selected');
            firstCard = '';
            secondCard = '';
            counter = 0;
    })
    }

    /*--------------Timer---------------*/

    const timer = document.querySelector("span");
    let timeCount = 0;
    let interval;

    const startTimer = () => {
        let second = 0, minute = 0;
        interval = setInterval(() => {
            if (second < 10) {
                timer.innerHTML = "0"+minute + ":0"+second;
            } else {
                timer.innerHTML = "0"+minute + ":" + second;
            }
            second++;
            if(second == 60){
                minute++;
                second = 0;
            }
            timeCount++;
            if (selectedCards.length >= 36) {
                clearInterval(interval);
                setTimeout(end,500);
            }
        },1000);
    }

    /*--------------Finished game---------------*/

    const end = () => {
        const time = document.getElementById('final_time');
        const surprise = document.createElement('p');
        let timerValue = document.querySelector('span').innerHTML;

        surprise.classList.add('surprise');
        popup.style.visibility = 'visible';
        game.style.opacity = 0.4;
        time.innerHTML = timerValue;

        /*--------------Surprise conditional---------------*/

        if (((timeCount-1)*1) < 120) {
            surprise.innerHTML = "Nagroda: 53.03.351, 18.01.253";
            popup.appendChild(surprise);
                    } else {
            surprise.innerHTML = "Postaraj się bardziej! Musisz zejść poniżej 2 minut, by otrzymać nagrodę.";
            popup.appendChild(surprise);
        }
    }

    /*--------------Push data to FireBase---------------*/

    const pushData = () => {
        let input = document.getElementById('final_score').value;
        let timerValue = document.querySelector('span').innerHTML;


        let data = {
            name: input,
            score: timerValue
        };
        refOb.push(data);
        location.reload();
    }

    /*--------------Restart of the game---------------*/


    const restart = () => {
        let matchedCards = document.querySelectorAll('.matched');
        const surprise = document.querySelector('.surprise');
        for (let i = 0; i < matchedCards.length; i++) {
            matchedCards[i].classList.remove('matched');
        }
        popup.style.visibility = 'hidden';
        game.style.opacity = 1;
        matchedNumber = 2;
        timeCount = 0;
        selectedCards = [];
        surprise.parentElement.removeChild(surprise);
        reset();
        startGame();
        startTimer();
    }

    /*--------------Play again---------------*/

    let play_again = document.getElementById('play_again');
    play_again.addEventListener('click', () => {
        restart();
        pushData();
    });

});


