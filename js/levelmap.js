/* =========================================
   ONLY ONE MOVE — COMPACT LEVEL MAP
   20 этапов × 5 уровней
========================================= */

let openedChapter = 1;


/* =========================================
   OPEN MAP
========================================= */

function openLevelMap(chapterId = 1) {

    openedChapter = Number(chapterId) || 1;

    const home =
        document.getElementById("homeScreen");

    const game =
        document.getElementById("gameScreen");

    const map =
        document.getElementById("levelMapScreen");

    if (!map) {
        console.error("Не найден #levelMapScreen");
        return;
    }

    if (home) {
        home.classList.add("hidden");
    }

    if (game) {
        game.classList.add("hidden");
    }

    map.classList.remove("hidden");

    renderLevelMap(openedChapter);
}


/* =========================================
   CLOSE MAP
========================================= */

function closeLevelMap() {

    const map =
        document.getElementById("levelMapScreen");

    const home =
        document.getElementById("homeScreen");

    if (map) {
        map.classList.add("hidden");
    }

    if (home) {
        home.classList.remove("hidden");
    }

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
   RENDER MAP
========================================= */

function renderLevelMap(chapterId) {

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return;
    }

    const title =
        document.getElementById("mapTitle");

    const stars =
        document.getElementById("mapStars");

    const status =
        document.getElementById("mapStatus");

    const path =
        document.getElementById("levelPath");


    /* =====================================
       HEADER
    ===================================== */

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


    /* =====================================
       STATUS
    ===================================== */

    if (status) {

        if (
            isChapterFirstRunComplete(
                chapterId
            )
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


    if (!path) {
        return;
    }

    path.innerHTML = "";


    /* =====================================
       COMPACT MAP
    ===================================== */

    const compactMap =
        document.createElement("div");

    compactMap.className =
        "compact-level-map";


    /*
       SVG-дорожка.

       Она декоративная.
       Кнопки уровней располагаются
       поверх неё.
    */

    compactMap.innerHTML = `
        <svg
            class="level-road"
            viewBox="0 0 340 480"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>

                <linearGradient
                    id="roadGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#ffd166"
                    />

                    <stop
                        offset="30%"
                        stop-color="#765cff"
                    />

                    <stop
                        offset="100%"
                        stop-color="#354056"
                    />
                </linearGradient>

                <filter id="roadGlow">

                    <feGaussianBlur
                        stdDeviation="3"
                        result="blur"
                    />

                    <feMerge>

                        <feMergeNode
                            in="blur"
                        />

                        <feMergeNode
                            in="SourceGraphic"
                        />

                    </feMerge>

                </filter>

            </defs>

            <path
                d="
                    M 82 58
                    C 200 55, 275 75, 255 145
                    C 235 205, 110 180, 95 255
                    C 80 320, 265 300, 250 375
                    C 240 425, 160 430, 170 455
                "
                fill="none"
                stroke="#263146"
                stroke-width="8"
                stroke-linecap="round"
            />

            <path
                d="
                    M 82 58
                    C 200 55, 275 75, 255 145
                "
                fill="none"
                stroke="url(#roadGradient)"
                stroke-width="7"
                stroke-linecap="round"
                filter="url(#roadGlow)"
            />

        </svg>
    `;


    /* =====================================
       POSITIONS
    ===================================== */

    const positions = [

        {
            left: "7%",
            top: "3%"
        },

        {
            right: "7%",
            top: "20%"
        },

        {
            left: "15%",
            top: "40%"
        },

        {
            right: "13%",
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
            Position
        */

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
           LOCK ICON
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


        if (!playable) {

            button.classList.add(
                "compact-locked"
            );
        }


        /*
            Number always stays visible.
            We don't replace it with 🔒.
        */

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


        button.appendChild(
            starRow
        );


        /* =================================
           CLICK
        ================================= */

        button.onclick = () => {

            handleMapLevelClick(
                level
            );
        };


        wrapper.appendChild(
            button
        );


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

            wrapper.appendChild(
                check
            );
        }


        /* =================================
           CURRENT LABEL
        ================================= */

        if (current) {

            const label =
                document.createElement("div");

            label.className =
                "compact-play-label";

            label.textContent =
                "ИГРАТЬ";

            wrapper.appendChild(
                label
            );
        }


        compactMap.appendChild(
            wrapper
        );
    }


    path.appendChild(
        compactMap
    );


    /* =====================================
       FOOTER
    ===================================== */

    const footer =
        document.createElement("div");

    footer.className =
        "compact-map-footer";


    if (
        isChapterFirstRunComplete(
            chapterId
        )
    ) {

        const improvement =
            getLevelsToImprove(
                chapterId
            );


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


    path.appendChild(
        footer
    );
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
        Сейчас реально готовы
        уровни 1 и 2.
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
