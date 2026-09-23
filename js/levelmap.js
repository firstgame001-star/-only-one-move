/* =========================================
   ONLY ONE MOVE — LEVEL MAP
   20 этапов × 5 уровней
   SVG SCENERY VERSION
========================================= */

let openedChapter = 1;


/* =========================================
   OPEN MAP
========================================= */

function openLevelMap(chapterId = 1) {

    openedChapter = Number(chapterId) || 1;

    const home = document.getElementById("homeScreen");
    const game = document.getElementById("gameScreen");
    const map = document.getElementById("levelMapScreen");

    if (!map) {
        console.error("Не найден #levelMapScreen");
        return;
    }

    if (home) home.classList.add("hidden");
    if (game) game.classList.add("hidden");

    map.classList.remove("hidden");

    renderLevelMap(openedChapter);
}


/* =========================================
   CLOSE MAP
========================================= */

function closeLevelMap() {

    const map = document.getElementById("levelMapScreen");
    const home = document.getElementById("homeScreen");

    if (map) map.classList.add("hidden");
    if (home) home.classList.remove("hidden");

    if (typeof updateMainUI === "function") {
        updateMainUI();
    }

    if (typeof updateProgress === "function") {
        updateProgress();
    }

    if (typeof updateChapterUI === "function") {
        updateChapterUI();
    }

    if (typeof updateHomeLevel === "function") {
        updateHomeLevel();
    }
}


/* =========================================
   SVG MAP
========================================= */

function createMapSVG() {

    return `
        <svg
            class="level-road"
            viewBox="0 0 340 510"
            preserveAspectRatio="none"
            aria-hidden="true"
            style="
                position:absolute;
                inset:0;
                width:100%;
                height:100%;
                z-index:1;
                pointer-events:none;
            "
        >

            <defs>

                <!-- ROAD -->

                <linearGradient
                    id="roadGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#8b6cff"
                    />

                    <stop
                        offset="50%"
                        stop-color="#7057e8"
                    />

                    <stop
                        offset="100%"
                        stop-color="#39425a"
                    />
                </linearGradient>


                <filter
                    id="roadGlow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                >

                    <feGaussianBlur
                        stdDeviation="5"
                        result="blur"
                    />

                    <feMerge>

                        <feMergeNode in="blur"/>

                        <feMergeNode in="SourceGraphic"/>

                    </feMerge>

                </filter>


                <!-- CRYSTAL -->

                <linearGradient
                    id="crystalGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#9df5ff"
                    />

                    <stop
                        offset="45%"
                        stop-color="#6e9cff"
                    />

                    <stop
                        offset="100%"
                        stop-color="#7b5cff"
                    />

                </linearGradient>


                <filter
                    id="crystalGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                >

                    <feGaussianBlur
                        stdDeviation="4"
                        result="glow"
                    />

                    <feMerge>

                        <feMergeNode in="glow"/>

                        <feMergeNode in="SourceGraphic"/>

                    </feMerge>

                </filter>


                <!-- ROCK -->

                <linearGradient
                    id="rockGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#536077"
                    />

                    <stop
                        offset="100%"
                        stop-color="#252e3e"
                    />

                </linearGradient>


                <!-- SIGN -->

                <linearGradient
                    id="woodGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#9b7049"
                    />

                    <stop
                        offset="100%"
                        stop-color="#59402d"
                    />

                </linearGradient>

            </defs>


            <!-- =================================
                 BACKGROUND PARTICLES
            ================================== -->

            <g opacity=".8">

                <circle
                    cx="30"
                    cy="42"
                    r="2.3"
                    fill="#9c8cff"
                />

                <circle
                    cx="304"
                    cy="62"
                    r="2"
                    fill="#8edcff"
                />

                <circle
                    cx="318"
                    cy="176"
                    r="1.8"
                    fill="#9c8cff"
                />

                <circle
                    cx="26"
                    cy="212"
                    r="2"
                    fill="#8edcff"
                />

                <circle
                    cx="310"
                    cy="290"
                    r="2.4"
                    fill="#9c8cff"
                />

                <circle
                    cx="24"
                    cy="363"
                    r="1.8"
                    fill="#9c8cff"
                />

                <circle
                    cx="295"
                    cy="453"
                    r="2.2"
                    fill="#8edcff"
                />

            </g>


            <!-- =================================
                 ROCKS — LEFT TOP
            ================================== -->

            <g transform="translate(10 93)">

                <ellipse
                    cx="18"
                    cy="18"
                    rx="19"
                    ry="13"
                    fill="url(#rockGradient)"
                />

                <ellipse
                    cx="7"
                    cy="23"
                    rx="10"
                    ry="7"
                    fill="#303a4c"
                />

                <path
                    d="M6 13 Q18 5 30 13"
                    fill="none"
                    stroke="#69768b"
                    stroke-width="2"
                    opacity=".55"
                />

            </g>


            <!-- GRASS LEFT -->

            <g
                transform="translate(24 118)"
                stroke-linecap="round"
            >

                <path
                    d="M0 19 Q-3 5 -8 0"
                    fill="none"
                    stroke="#3d9d74"
                    stroke-width="5"
                />

                <path
                    d="M2 19 Q4 2 3 -5"
                    fill="none"
                    stroke="#53b887"
                    stroke-width="5"
                />

                <path
                    d="M4 19 Q11 6 14 1"
                    fill="none"
                    stroke="#337d61"
                    stroke-width="5"
                />

            </g>


            <!-- =================================
                 CRYSTAL — RIGHT TOP
            ================================== -->

            <g
                transform="translate(304 78)"
                filter="url(#crystalGlow)"
            >

                <polygon
                    points="
                        0,-18
                        10,-5
                        6,17
                        -6,17
                        -10,-5
                    "
                    fill="url(#crystalGradient)"
                />

                <polyline
                    points="
                        0,-18
                        0,17
                        10,-5
                    "
                    fill="none"
                    stroke="rgba(255,255,255,.45)"
                    stroke-width="1"
                />

            </g>


            <!-- SMALL CRYSTAL RIGHT -->

            <g
                transform="translate(318 111)"
                opacity=".75"
            >

                <polygon
                    points="
                        0,-10
                        6,-2
                        3,10
                        -3,10
                        -6,-2
                    "
                    fill="#755cff"
                />

            </g>


            <!-- =================================
                 ROCK RIGHT MIDDLE
            ================================== -->

            <g transform="translate(298 224)">

                <ellipse
                    cx="15"
                    cy="14"
                    rx="18"
                    ry="12"
                    fill="url(#rockGradient)"
                />

                <ellipse
                    cx="28"
                    cy="19"
                    rx="10"
                    ry="7"
                    fill="#303a4c"
                />

                <path
                    d="M3 10 Q16 3 27 10"
                    fill="none"
                    stroke="#657187"
                    stroke-width="2"
                    opacity=".45"
                />

            </g>


            <!-- GRASS RIGHT -->

            <g
                transform="translate(315 250)"
                stroke-linecap="round"
            >

                <path
                    d="M0 20 Q-5 6 -9 1"
                    fill="none"
                    stroke="#3b926e"
                    stroke-width="5"
                />

                <path
                    d="M2 20 Q3 4 4 -5"
                    fill="none"
                    stroke="#55bd8b"
                    stroke-width="5"
                />

                <path
                    d="M4 20 Q12 8 15 3"
                    fill="none"
                    stroke="#34795e"
                    stroke-width="5"
                />

            </g>


            <!-- =================================
                 CRYSTALS LEFT MIDDLE
            ================================== -->

            <g
                transform="translate(25 287)"
                filter="url(#crystalGlow)"
            >

                <polygon
                    points="
                        0,-17
                        9,-4
                        5,16
                        -5,16
                        -9,-4
                    "
                    fill="url(#crystalGradient)"
                />

                <polygon
                    points="
                        15,-8
                        21,0
                        18,13
                        12,13
                        9,0
                    "
                    fill="#6754d8"
                    opacity=".85"
                />

            </g>


            <!-- =================================
                 SIGN RIGHT
            ================================== -->

            <g
                transform="translate(278 340) rotate(-7)"
            >

                <rect
                    x="22"
                    y="22"
                    width="7"
                    height="42"
                    rx="3"
                    fill="#513927"
                />

                <path
                    d="
                        M0 0
                        H39
                        L52 14
                        L39 28
                        H0
                        Z
                    "
                    fill="url(#woodGradient)"
                />

                <path
                    d="
                        M13 14
                        H36
                        M30 8
                        L37 14
                        L30 20
                    "
                    fill="none"
                    stroke="#f2dfbd"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

            </g>


            <!-- =================================
                 BOTTOM LEFT ROCKS
            ================================== -->

            <g transform="translate(15 427)">

                <ellipse
                    cx="16"
                    cy="17"
                    rx="17"
                    ry="11"
                    fill="url(#rockGradient)"
                />

                <ellipse
                    cx="31"
                    cy="20"
                    rx="11"
                    ry="7"
                    fill="#2c3545"
                />

            </g>


            <!-- BOTTOM LEFT GRASS -->

            <g
                transform="translate(43 435)"
                stroke-linecap="round"
            >

                <path
                    d="M0 22 Q-4 6 -10 0"
                    fill="none"
                    stroke="#388767"
                    stroke-width="5"
                />

                <path
                    d="M3 22 Q4 5 4 -6"
                    fill="none"
                    stroke="#53b887"
                    stroke-width="5"
                />

                <path
                    d="M6 22 Q13 9 17 3"
                    fill="none"
                    stroke="#347a5e"
                    stroke-width="5"
                />

            </g>


            <!-- =================================
                 BOTTOM RIGHT CRYSTAL
            ================================== -->

            <g
                transform="translate(307 455)"
                filter="url(#crystalGlow)"
            >

                <polygon
                    points="
                        0,-19
                        10,-5
                        6,18
                        -6,18
                        -10,-5
                    "
                    fill="url(#crystalGradient)"
                />

            </g>


            <!-- =================================
                 ROAD SHADOW
            ================================== -->

            <path
                d="
                    M 65 55
                    C 190 40, 285 75, 260 145
                    C 235 205, 90 190, 95 260
                    C 100 330, 275 300, 250 380
                    C 230 435, 155 420, 165 455
                "
                fill="none"
                stroke="#263146"
                stroke-width="11"
                stroke-linecap="round"
                opacity=".9"
            />


            <!-- =================================
                 ROAD GLOW
            ================================== -->

            <path
                d="
                    M 65 55
                    C 190 40, 285 75, 260 145
                    C 235 205, 90 190, 95 260
                    C 100 330, 275 300, 250 380
                    C 230 435, 155 420, 165 455
                "
                fill="none"
                stroke="#765cff"
                stroke-width="13"
                stroke-linecap="round"
                opacity=".13"
                filter="url(#roadGlow)"
            />


            <!-- =================================
                 MAIN ROAD
            ================================== -->

            <path
                d="
                    M 65 55
                    C 190 40, 285 75, 260 145
                    C 235 205, 90 190, 95 260
                    C 100 330, 275 300, 250 380
                    C 230 435, 155 420, 165 455
                "
                fill="none"
                stroke="url(#roadGradient)"
                stroke-width="5"
                stroke-linecap="round"
                filter="url(#roadGlow)"
            />

        </svg>
    `;
}


/* =========================================
   RENDER MAP
========================================= */

function renderLevelMap(chapterId) {

    const chapter = getChapterData(chapterId);

    if (!chapter) return;


    const title =
        document.getElementById("mapTitle");

    const stars =
        document.getElementById("mapStars");

    const status =
        document.getElementById("mapStatus");

    const path =
        document.getElementById("levelPath");


    /* HEADER */

    if (title) {
        title.textContent =
            `ЭТАП ${chapterId}`;
    }


    const progress =
        getChapterProgress(chapterId);


    if (stars && progress) {

        stars.textContent =
            `⭐ ${progress.earned} / 15`;
    }


    /* STATUS */

    if (status) {

        if (
            isChapterFirstRunComplete(chapterId)
        ) {

            status.innerHTML = `
                <div style="
                    font-size:16px;
                    font-weight:900;
                ">
                    🔁 Можно улучшать результаты
                </div>

                <span>
                    Нажми на уровень,
                    где не хватает звёзд
                </span>
            `;

        } else {

            status.innerHTML = `
                <div style="
                    font-size:16px;
                    font-weight:900;
                ">
                    🧠 Первый проход
                </div>

                <span>
                    Пройди все 5 уровней —
                    после этого откроются повторы
                </span>
            `;
        }
    }


    if (!path) return;


    path.innerHTML = "";


    /* =====================================
       COMPACT MAP
    ===================================== */

    const compactMap =
        document.createElement("div");


    compactMap.className =
        "compact-level-map";


    compactMap.style.position =
        "relative";


    compactMap.style.overflow =
        "hidden";


    /*
       Дорога + декорации теперь
       находятся В ОДНОМ SVG.
    */

    compactMap.innerHTML =
        createMapSVG();


    /* =====================================
       LEVEL POSITIONS
    ===================================== */

    const positions = [

        {
            left: "5%",
            top: "2%"
        },

        {
            right: "5%",
            top: "20%"
        },

        {
            left: "13%",
            top: "40%"
        },

        {
            right: "11%",
            top: "60%"
        },

        {
            left: "34%",
            top: "79%"
        }

    ];


    /* =====================================
       CREATE LEVELS
    ===================================== */

    for (
        let level = chapter.firstLevel;
        level <= chapter.lastLevel;
        level++
    ) {

        const index =
            level - chapter.firstLevel;


        const completed =
            isLevelCompleted(level);


        const bestStars =
            getBestStars(level);


        const playable =
            canPlayLevel(level);


        const current =
            !completed && playable;


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "compact-node-wrap";


        /*
           Ставим уровни ВЫШЕ SVG.
        */

        wrapper.style.zIndex = "10";


        const position =
            positions[index];


        if (position.left) {

            wrapper.style.left =
                position.left;
        }


        if (position.right) {

            wrapper.style.right =
                position.right;
        }


        wrapper.style.top =
            position.top;


        /* =================================
           LOCK
        ================================= */

        if (
            !completed &&
            !playable
        ) {

            const lock =
                document.createElement("div");


            lock.className =
                "compact-lock";


            lock.textContent =
                "🔒";


            wrapper.appendChild(lock);
        }


        /* =================================
           BUTTON
        ================================= */

        const button =
            document.createElement("button");


        button.className =
            "compact-level-node";


        if (completed) {

            button.classList.add(
                "compact-completed"
            );
        }


        if (current) {

            button.classList.add(
                "compact-current"
            );
        }


        /*
           Пройденный уровень
           не затемняем.
        */

        if (
            !completed &&
            !playable
        ) {

            button.classList.add(
                "compact-locked"
            );
        }


        /* NUMBER */

        const number =
            document.createElement("div");


        number.className =
            "compact-level-number";


        number.textContent =
            level;


        button.appendChild(number);


        /* =================================
           STARS
        ================================= */

        const starRow =
            document.createElement("div");


        starRow.className =
            "compact-stars";


        if (completed) {

            let text = "";


            for (
                let star = 1;
                star <= 3;
                star++
            ) {

                text +=
                    star <= bestStars
                        ? "⭐"
                        : "☆";
            }


            starRow.textContent =
                text;

        } else {

            starRow.textContent =
                "☆☆☆";
        }


        button.appendChild(starRow);


        /* CLICK */

        button.onclick = () => {

            handleMapLevelClick(level);
        };


        wrapper.appendChild(button);


        /* =================================
           COMPLETED CHECK
        ================================= */

        if (completed) {

            const check =
                document.createElement("div");


            check.className =
                "compact-check";


            check.textContent =
                "✓";


            wrapper.appendChild(check);
        }


        /* =================================
           CURRENT
        ================================= */

        if (current) {

            const label =
                document.createElement("div");


            label.className =
                "compact-play-label";


            label.textContent =
                "ИГРАТЬ";


            wrapper.appendChild(label);
        }


        compactMap.appendChild(wrapper);
    }


    path.appendChild(compactMap);


    /* =====================================
       FOOTER
    ===================================== */

    const footer =
        document.createElement("div");


    footer.className =
        "compact-map-footer";


    if (
        isChapterFirstRunComplete(chapterId)
    ) {

        const improvement =
            getLevelsToImprove(chapterId);


        if (
            improvement.length === 0
        ) {

            footer.innerHTML = `
                <div class="compact-perfect">
                    🏆 ИДЕАЛЬНО
                </div>

                <div class="compact-footer-sub">
                    Все уровни пройдены
                    на ⭐⭐⭐
                </div>
            `;

        } else {

            footer.innerHTML = `
                <div class="compact-footer-title">
                    🔁 Улучшить результат
                </div>

                <div class="compact-footer-sub">
                    Нажми на уровень,
                    где не хватает ⭐
                </div>
            `;
        }

    } else {

        footer.innerHTML = `
            <div class="compact-footer-title">
                🔒 Повторное прохождение
            </div>

            <div class="compact-footer-sub">
                Откроется после завершения
                всех 5 уровней этапа
            </div>
        `;
    }


    path.appendChild(footer);
}


/* =========================================
   CLICK LEVEL
========================================= */

function handleMapLevelClick(level) {

    const playable =
        canPlayLevel(level);


    if (!playable) {

        const reason =
            getLevelLockReason(level);


        if (
            typeof showAppNotice ===
            "function"
        ) {

            showAppNotice(reason);

        } else {

            alert(reason);
        }


        return;
    }


    /*
       Сейчас готовы уровни 1 и 2.
    */

    if (level > 2) {

        if (
            typeof showAppNotice ===
            "function"
        ) {

            showAppNotice(
                `Уровень ${level} скоро добавим 🧩`
            );

        } else {

            alert(
                `Уровень ${level} скоро добавим 🧩`
            );
        }


        return;
    }


    const energy =
        typeof getEnergyData === "function"
            ? getEnergyData()
            : { energy: 5 };


    if (energy.energy <= 0) {

        if (
            typeof openEnergyShop ===
            "function"
        ) {

            openEnergyShop();
        }


        return;
    }


    const map =
        document.getElementById(
            "levelMapScreen"
        );


    const game =
        document.getElementById(
            "gameScreen"
        );


    if (map) {

        map.classList.add(
            "hidden"
        );
    }


    if (game) {

        game.classList.remove(
            "hidden"
        );
    }


    if (
        typeof loadLevel ===
        "function"
    ) {

        loadLevel(level);
    }
}
