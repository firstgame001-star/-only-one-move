/* =========================================
   ONLY ONE MOVE
   LEVEL 2 — FREE THE FISH
   WOODEN CAGE V2
========================================= */

let objectPuzzleLocked = false;
let fishAnimationTimer = null;


/* =========================================
   START
========================================= */

function startObjectPuzzle(){

    objectPuzzleLocked = false;

    buildExtraFishBars();
    resetFishPuzzle();
}


/* =========================================
   ADD EXTRA CAGE BARS
========================================= */

function buildExtraFishBars(){

    const trap =
        document.querySelector(
            "#fishPuzzle .fish-trap"
        );

    if(!trap) return;


    /*
       Не добавляем второй раз,
       если уровень был перезапущен.
    */

    if(
        trap.querySelector(
            ".fish-extra-bar"
        )
    ){
        return;
    }


    const extraBars = [

        {
            number:6,
            className:
                "fish-extra-v fish-extra-v1",
            label:
                "Внутренняя планка 1"
        },

        {
            number:7,
            className:
                "fish-extra-v fish-extra-v2",
            label:
                "Внутренняя планка 2"
        },

        {
            number:8,
            className:
                "fish-extra-v fish-extra-v3",
            label:
                "Внутренняя планка 3"
        },

        {
            number:9,
            className:
                "fish-extra-h",
            label:
                "Средняя планка"
        }

    ];


    extraBars.forEach(item => {

        const bar =
            document.createElement(
                "button"
            );

        bar.className =
            "fish-bar fish-extra-bar " +
            item.className;

        bar.dataset.bar =
            String(item.number);

        bar.setAttribute(
            "aria-label",
            item.label
        );

        bar.onclick = () => {
            moveFishBar(
                item.number
            );
        };

        trap.appendChild(bar);
    });


    injectFishCageStyles();
}


/* =========================================
   EXTRA STYLES
========================================= */

function injectFishCageStyles(){

    if(
        document.getElementById(
            "fishCageV2Styles"
        )
    ){
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "fishCageV2Styles";


    style.textContent = `

    /*
       EXTRA WOODEN CAGE
    */

    .fish-extra-bar{
        z-index:9;
    }


    /*
       Вертикальная решётка слева.
    */

    .fish-extra-v1{
        width:16px;
        height:116px;

        left:65px;
        top:17px;
    }


    /*
       Центральная решётка.
       Немного смещена, чтобы клетка
       не выглядела идеально симметричной.
    */

    .fish-extra-v2{
        width:16px;
        height:118px;

        left:117px;
        top:17px;
    }


    /*
       Правая внутренняя решётка.
    */

    .fish-extra-v3{
        width:16px;
        height:116px;

        right:65px;
        top:17px;
    }


    /*
       Поперечная планка.
    */

    .fish-extra-h{
        width:202px;
        height:16px;

        left:24px;
        top:44px;
    }


    /*
       Болты на дополнительных
       вертикальных планках.
    */

    .fish-extra-v1::after,
    .fish-extra-v2::after,
    .fish-extra-v3::after{
        left:2px;
        top:9px;
    }


    /*
       Болт поперечной планки.
    */

    .fish-extra-h::after{
        right:9px;
        top:2px;
    }


    /*
       Рыбка должна быть видна
       между решётками.
    */

    #fishPuzzle .fish{
        z-index:8;
    }


    /*
       Дополнительный эффект глубины:
       некоторые планки чуть темнее.
       Это НЕ подсказка к решению.
    */

    .fish-extra-v1,
    .fish-extra-v3{
        filter:brightness(.91);
    }


    /*
       При нажатии возвращаем
       нормальную яркость.
    */

    .fish-extra-v1:active,
    .fish-extra-v3:active{
        filter:brightness(1.08);
    }


    /*
       На маленьких телефонах
       всё остаётся внутри клетки.
    */

    @media(max-width:380px){

        .fish-extra-v1{
            left:65px;
        }

        .fish-extra-v2{
            left:117px;
        }

        .fish-extra-v3{
            right:65px;
        }

    }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================
   RESET
========================================= */

function resetFishPuzzle(){

    objectPuzzleLocked = false;


    if(fishAnimationTimer){

        clearTimeout(
            fishAnimationTimer
        );

        fishAnimationTimer = null;
    }


    const puzzle =
        document.getElementById(
            "fishPuzzle"
        );


    const fish =
        document.getElementById(
            "fish"
        );


    if(puzzle){

        puzzle.classList.remove(
            "fish-solved"
        );
    }


    if(fish){

        fish.classList.remove(
            "fish-free",
            "fish-turn",
            "fish-escaping",
            "fish-swim-left",
            "fish-swim-right"
        );

        fish.style.transform = "";
        fish.style.left = "";
        fish.style.top = "";
        fish.style.opacity = "";
    }


    document
        .querySelectorAll(
            "#fishPuzzle .fish-bar"
        )
        .forEach(bar => {

            bar.classList.remove(
                "bar-moved",
                "fish-exit-open",
                "bar-wrong"
            );

            bar.style.transform = "";
            bar.style.opacity = "";
        });


    startFishSwimming();
}


/* =========================================
   FISH SWIMMING
========================================= */

function startFishSwimming(){

    const fish =
        document.getElementById(
            "fish"
        );


    if(!fish){
        return;
    }


    if(fishAnimationTimer){

        clearTimeout(
            fishAnimationTimer
        );
    }


    function swimRight(){

        if(
            levelSolved ||
            levelFailed ||
            objectPuzzleLocked
        ){
            return;
        }


        fish.classList.remove(
            "fish-swim-left"
        );

        fish.classList.add(
            "fish-swim-right"
        );


        fishAnimationTimer =
            setTimeout(
                swimLeft,
                2600
            );
    }


    function swimLeft(){

        if(
            levelSolved ||
            levelFailed ||
            objectPuzzleLocked
        ){
            return;
        }


        fish.classList.remove(
            "fish-swim-right"
        );

        fish.classList.add(
            "fish-swim-left"
        );


        fishAnimationTimer =
            setTimeout(
                swimRight,
                2600
            );
    }


    fish.classList.remove(
        "fish-swim-left",
        "fish-swim-right"
    );


    fishAnimationTimer =
        setTimeout(
            swimRight,
            180
        );
}


/* =========================================
   PLAYER CHOOSES BAR
========================================= */

function moveFishBar(barNumber){

    if(
        objectPuzzleLocked ||
        levelSolved ||
        levelFailed
    ){
        return;
    }


    const bar =
        document.querySelector(
            `#fishPuzzle .fish-bar[data-bar="${barNumber}"]`
        );


    if(!bar){
        return;
    }


    objectPuzzleLocked = true;


    stopFishSwimming();


    /*
       Единственное решение
       остаётся прежним:
       нижняя правая планка №4.
    */

    if(
        Number(barNumber) === 4
    ){

        correctFishMove(bar);

    }else{

        wrongFishMove(bar);
    }
}


/* =========================================
   WRONG BAR
========================================= */

function wrongFishMove(bar){

    bar.classList.add(
        "bar-wrong"
    );


    if(
        typeof showGameMessage ===
        "function"
    ){

        showGameMessage(
            "🐠 Эта планка не открыла выход. −⭐",
            "bad"
        );

    }else{

        const message =
            document.getElementById(
                "gameMessage"
            );

        if(message){

            message.className =
                "message bad";

            message.textContent =
                "🐠 Эта планка не открыла выход. −⭐";
        }
    }


    setTimeout(() => {

        bar.classList.remove(
            "bar-wrong"
        );


        if(
            typeof registerWrongMove ===
            "function"
        ){

            registerWrongMove();
        }


        if(
            !levelFailed &&
            !levelSolved
        ){

            objectPuzzleLocked =
                false;

            startFishSwimming();
        }

    },430);
}


/* =========================================
   CORRECT BAR
========================================= */

function correctFishMove(bar){

    const puzzle =
        document.getElementById(
            "fishPuzzle"
        );


    const fish =
        document.getElementById(
            "fish"
        );


    /*
       Планка отодвигается.
    */

    bar.classList.add(
        "fish-exit-open"
    );


    if(puzzle){

        puzzle.classList.add(
            "fish-solved"
        );
    }


    if(
        typeof showGameMessage ===
        "function"
    ){

        showGameMessage(
            "🌊 Выход открыт!",
            "good"
        );

    }else{

        const message =
            document.getElementById(
                "gameMessage"
            );

        if(message){

            message.className =
                "message good";

            message.textContent =
                "🌊 Выход открыт!";
        }
    }


    /*
       Рыбка замечает проход.
    */

    setTimeout(() => {

        if(!fish){
            return;
        }


        fish.classList.remove(
            "fish-swim-left",
            "fish-swim-right"
        );


        fish.classList.add(
            "fish-escaping"
        );

    },280);


    /*
       И выплывает.
    */

    setTimeout(() => {

        if(!fish){
            return;
        }


        fish.classList.add(
            "fish-free"
        );

    },560);


    /*
       После анимации —
       победа.
    */

    setTimeout(() => {

        if(
            !levelSolved &&
            !levelFailed &&
            typeof solveLevel ===
            "function"
        ){

            solveLevel(30);
        }

    },1550);
}


/* =========================================
   STOP
========================================= */

function stopFishSwimming(){

    if(fishAnimationTimer){

        clearTimeout(
            fishAnimationTimer
        );

        fishAnimationTimer = null;
    }
}
