/* =========================================
   ONLY ONE MOVE — LEVEL MAP
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

    if (title) {
        title.textContent =
            `ЭТАП ${chapterId}`;
    }


    /* STARS */

    const progress =
        getChapterProgress(chapterId);

    if (stars && progress) {

        stars.textContent =
            `⭐ ${progress.earned} / 15`;
    }


    /* STATUS */

    if (status) {

        if (
            isChapterFirstRunComplete(
                chapterId
            )
        ) {

            status.innerHTML =
                `🔁 Этап пройден<br>
                 <span>
                 Теперь можно улучшать результаты
                 </span>`;

        } else {

            status.innerHTML =
                `🧠 Первый проход<br>
                 <span>
                 Иди вперёд — повторы откроются после уровня ${chapter.lastLevel}
                 </span>`;
        }
    }


    if (!path) {
        return;
    }

    path.innerHTML = "";


    /* =====================================
       LEVELS
    ===================================== */

    for (
        let level = chapter.firstLevel;
        level <= chapter.lastLevel;
        level++
    ) {

        const completed =
            isLevelCompleted(level);

        const bestStars =
            getBestStars(level);

        const playable =
            canPlayLevel(level);

        const isCurrent =
            !completed && playable;


        /* ROW */

        const row =
            document.createElement("div");

        row.className =
            "map-level-row";


        /*
            Делаем дорожку змейкой.
        */

        const position =
            (level - chapter.firstLevel) % 3;

        if (position === 0) {
            row.classList.add("map-left");
        }

        if (position === 1) {
            row.classList.add("map-center");
        }

        if (position === 2) {
            row.classList.add("map-right");
        }


        /* CONNECTOR */

        if (level !== chapter.firstLevel) {

            const connector =
                document.createElement("div");

            connector.className =
                "map-connector";

            row.appendChild(connector);
        }


        /* BUTTON */

        const button =
            document.createElement("button");

        button.className =
            "level-node";


        if (completed) {
            button.classList.add(
                "level-completed"
            );
        }


        if (isCurrent) {
            button.classList.add(
                "level-current"
            );
        }


        if (!playable) {
            button.classList.add(
                "level-locked"
            );
        }


        /*
            NUMBER / LOCK
        */

        const number =
            document.createElement("div");

        number.className =
            "level-number";


        if (
            !completed &&
            !playable
        ) {

            number.textContent = "🔒";

        } else {

            number.textContent =
                level;
        }


        button.appendChild(number);


        /* STARS */

        const starsRow =
            document.createElement("div");

        starsRow.className =
            "node-stars";


        if (completed) {

            let starText = "";

            for (
                let i = 1;
                i <= 3;
                i++
            ) {

                starText +=
                    i <= bestStars
                        ? "⭐"
                        : "☆";
            }

            starsRow.textContent =
                starText;

        } else if (isCurrent) {

            starsRow.textContent =
                "☆☆☆";

        } else {

            starsRow.textContent =
                " ";
        }


        button.appendChild(
            starsRow
        );


        /* CLICK */

        button.onclick = () => {

            handleMapLevelClick(
                level
            );
        };


        row.appendChild(button);

        path.appendChild(row);
    }


    /* =====================================
       FOOTER
    ===================================== */

    const footer =
        document.createElement("div");

    footer.className =
        "map-footer";


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

            footer.innerHTML =
                `
                <div class="map-perfect">
                    🏆 ИДЕАЛЬНО!
                </div>

                <div class="map-perfect-sub">
                    Все уровни пройдены на ⭐⭐⭐
                </div>
                `;

        } else {

            footer.innerHTML =
                `
                <div class="map-replay">
                    🔁 Можно улучшить:
                    ${improvement
                        .map(item =>
                            `Ур. ${item.level}`
                        )
                        .join(", ")}
                </div>
                `;
        }

    } else {

        footer.innerHTML =
            `
            <div class="map-first-run">
                🔒 Повторное прохождение
                откроется после завершения
                всех 5 уровней этапа
            </div>
            `;
    }


    path.appendChild(
        footer
    );
}


/* =========================================
   LEVEL CLICK
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
        Пока реально созданы
        только уровни 1 и 2.
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


    /*
        Загружаем конкретный уровень.
    */

    if (
        typeof loadLevel ===
        "function"
    ) {

        loadLevel(level);
    }
}
