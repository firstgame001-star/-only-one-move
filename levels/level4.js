// =====================================
// ONLY ONE MOVE
// LEVEL 4 — RAILWAY SWITCH
// 2 TRAINS + 16 SWITCHES
// =====================================

window.ONE_MOVE_LEVELS =
    window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[4] = {

    id: 4,
    type: "railway",

    locked: false,
    solved: false,
    selectedSwitch: null,

    // Правильная стрелка
    correctSwitch: 11,

    timers: [],
    animationFrame: null,

    // =====================================
    // HTML
    // =====================================

    render() {

        let switches = "";

        for (let i = 1; i <= 16; i++) {

            switches += this.renderSwitch(i);

        }

        return `
        <div id="railwayPuzzle" class="puzzle-container">

            <div class="railway-board">

                <div class="railway-grid"></div>


                <!-- ДЕКОР -->

                <div class="rail-tree tree-1">🌲</div>
                <div class="rail-tree tree-2">🌲</div>
                <div class="rail-tree tree-3">🌲</div>
                <div class="rail-tree tree-4">🌲</div>

                <div class="rail-rock rock-1"></div>
                <div class="rail-rock rock-2"></div>


                <!-- СТАНЦИИ -->

                <div class="rail-station station-b">
                    <span>🏁</span>
                    <b>B</b>
                </div>

                <div class="rail-station station-a">
                    <span>🏁</span>
                    <b>A</b>
                </div>


                <!-- =================================
                     РЕЛЬСОВАЯ СЕТЬ
                ================================== -->

                <div class="track-segment track-1"></div>
                <div class="track-segment track-2"></div>
                <div class="track-segment track-3"></div>
                <div class="track-segment track-4"></div>
                <div class="track-segment track-5"></div>

                <div class="track-segment track-6"></div>
                <div class="track-segment track-7"></div>
                <div class="track-segment track-8"></div>
                <div class="track-segment track-9"></div>
                <div class="track-segment track-10"></div>

                <div class="track-segment track-11"></div>
                <div class="track-segment track-12"></div>
                <div class="track-segment track-13"></div>
                <div class="track-segment track-14"></div>

                <div class="track-segment track-false-1"></div>
                <div class="track-segment track-false-2"></div>
                <div class="track-segment track-false-3"></div>
                <div class="track-segment track-false-4"></div>
                <div class="track-segment track-false-5"></div>
                <div class="track-segment track-false-6"></div>


                <!-- ЦЕНТРАЛЬНАЯ РАЗВЯЗКА -->

                <div class="rail-junction junction-main"></div>


                <!-- =================================
                     ПОЕЗД A — КРАСНЫЙ
                ================================== -->

                <div
                    class="train train-a"
                    id="trainA"
                >

                    <div class="train-car train-car-back"></div>

                    <div class="train-car train-car-middle"></div>

                    <div class="train-engine">

                        <span class="train-window"></span>

                        <span class="train-light"></span>

                    </div>

                </div>


                <!-- =================================
                     ПОЕЗД B — СИНИЙ
                ================================== -->

                <div
                    class="train train-b"
                    id="trainB"
                >

                    <div class="train-car train-car-back"></div>

                    <div class="train-car train-car-middle"></div>

                    <div class="train-engine">

                        <span class="train-window"></span>

                        <span class="train-light"></span>

                    </div>

                </div>


                <!-- =================================
                     16 СТРЕЛОК
                ================================== -->

                ${switches}

            </div>

        </div>
        `;
    },


    // =====================================
    // SWITCH
    // =====================================

    renderSwitch(number) {

        return `
        <button
            class="rail-switch rail-switch-${number}"
            data-switch="${number}"
            aria-label="Стрелка ${number}"
        >

            <span class="switch-base"></span>

            <span class="switch-handle">

                <span class="switch-knob"></span>

            </span>

        </button>
        `;
    },


    // =====================================
    // START
    // =====================================

    start() {

        this.clearAnimations();

        this.locked = false;
        this.solved = false;
        this.selectedSwitch = null;

        const puzzle =
            document.getElementById("railwayPuzzle");

        if (!puzzle) {
            return;
        }


        puzzle.classList.remove(
            "railway-running",
            "railway-wrong",
            "railway-solved"
        );


        const switches =
            puzzle.querySelectorAll(".rail-switch");


        switches.forEach(button => {

            button.disabled = false;

            button.classList.remove(
                "switch-selected",
                "switch-changed",
                "switch-wrong",
                "switch-correct"
            );


            button.onclick = () => {

                this.chooseSwitch(
                    button,
                    Number(button.dataset.switch)
                );

            };

        });


        this.setTrainPosition(
            "trainA",
            20,
            74,
            0
        );


        this.setTrainPosition(
            "trainB",
            280,
            74,
            180
        );


        if (
            typeof movesText !== "undefined" &&
            movesText
        ) {

            movesText.textContent =
                "🚦 Переключи одну стрелку";

        }

    },


    // =====================================
    // SELECT SWITCH
    // =====================================

    chooseSwitch(button, number) {

        if (
            this.locked ||
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.locked = true;

        this.selectedSwitch = number;


        const puzzle =
            document.getElementById("railwayPuzzle");

        if (!puzzle) {
            return;
        }


        button.classList.add(
            "switch-selected",
            "switch-changed"
        );


        puzzle
            .querySelectorAll(".rail-switch")
            .forEach(item => {

                item.disabled = true;

            });


        if (
            typeof gameMessage !== "undefined" &&
            gameMessage
        ) {

            gameMessage.className =
                "message";

            gameMessage.textContent =
                "🚂 Поезда отправляются...";

        }


        this.addTimer(() => {

            if (
                levelSolved ||
                levelFailed
            ) {
                return;
            }

            this.startTrains();

        }, 350);

    },


    // =====================================
    // START TRAINS
    // =====================================

    startTrains() {

        const puzzle =
            document.getElementById("railwayPuzzle");

        if (!puzzle) {
            return;
        }


        puzzle.classList.add(
            "railway-running"
        );


        if (
            this.selectedSwitch ===
            this.correctSwitch
        ) {

            this.runCorrectRoute();

            return;
        }


        this.runWrongRoute();

    },


    // =====================================
    // CORRECT ROUTE
    // =====================================

    runCorrectRoute() {

        /*
            Все координаты соответствуют
            новой сетке рельсов в level4.css.

            Красный:
            слева → центр → вправо → A

            Синий:
            справа → центр → влево → B
        */


        const routeA = [

            { x:20,  y:74  },

            { x:72,  y:74  },

            { x:112, y:101 },

            { x:151, y:128 },

            { x:177, y:153 },

            { x:211, y:184 },

            { x:247, y:220 },

            { x:277, y:255 },

            { x:286, y:302 },

            { x:286, y:337 }

        ];


        const routeB = [

            { x:280, y:74  },

            { x:245, y:74  },

            { x:222, y:99  },

            { x:198, y:125 },

            { x:177, y:153 },

            { x:147, y:184 },

            { x:111, y:220 },

            { x:76,  y:255 },

            { x:51,  y:298 },

            { x:51,  y:337 }

        ];


        let finished = 0;


        const completeTrain = () => {

            finished++;

            if (finished === 2) {

                this.correctMove();

            }

        };


        this.animateTrain(
            "trainA",
            routeA,
            4000,
            completeTrain
        );


        this.animateTrain(
            "trainB",
            routeB,
            4000,
            completeTrain
        );

    },


    // =====================================
    // WRONG ROUTE
    // =====================================

    runWrongRoute() {

        const group =
            this.getWrongRouteGroup(
                this.selectedSwitch
            );


        let routeA;
        let routeB;


        /*
            Ошибочные маршруты тоже идут
            по существующим рельсам.
        */


        if (group === 1) {

            routeA = [

                { x:20,  y:74  },

                { x:72,  y:74  },

                { x:112, y:101 },

                { x:151, y:128 },

                { x:177, y:153 }

            ];


            routeB = [

                { x:280, y:74  },

                { x:245, y:74  },

                { x:222, y:99  },

                { x:198, y:125 },

                { x:177, y:153 }

            ];

        }


        else if (group === 2) {

            routeA = [

                { x:20,  y:74  },

                { x:72,  y:74  },

                { x:112, y:101 },

                { x:135, y:145 },

                { x:134, y:205 },

                { x:134, y:239 }

            ];


            routeB = [

                { x:280, y:74  },

                { x:245, y:74  },

                { x:222, y:99  },

                { x:237, y:145 },

                { x:260, y:186 },

                { x:280, y:217 }

            ];

        }


        else {

            routeA = [

                { x:20,  y:74  },

                { x:72,  y:74  },

                { x:112, y:101 },

                { x:151, y:128 },

                { x:177, y:153 },

                { x:147, y:184 },

                { x:111, y:220 }

            ];


            routeB = [

                { x:280, y:74  },

                { x:245, y:74  },

                { x:222, y:99  },

                { x:198, y:125 },

                { x:177, y:153 },

                { x:211, y:184 },

                { x:247, y:220 }

            ];

        }


        let finished = 0;


        const finishWrong = () => {

            finished++;

            if (finished === 2) {

                this.wrongMove();

            }

        };


        this.animateTrain(
            "trainA",
            routeA,
            2850,
            finishWrong
        );


        this.animateTrain(
            "trainB",
            routeB,
            2850,
            finishWrong
        );

    },


    // =====================================
    // WRONG GROUP
    // =====================================

    getWrongRouteGroup(number) {

        if (
            [1, 4, 7, 10, 14]
                .includes(number)
        ) {

            return 1;

        }


        if (
            [2, 5, 8, 12, 15]
                .includes(number)
        ) {

            return 2;

        }


        return 3;

    },


    // =====================================
    // ANIMATE TRAIN
    // =====================================

    animateTrain(
        trainId,
        points,
        duration,
        callback
    ) {

        const train =
            document.getElementById(trainId);

        if (
            !train ||
            !points ||
            points.length < 2
        ) {

            if (callback) {
                callback();
            }

            return;
        }


        const segments = [];

        let totalLength = 0;


        for (
            let i = 0;
            i < points.length - 1;
            i++
        ) {

            const start =
                points[i];

            const end =
                points[i + 1];


            const dx =
                end.x - start.x;

            const dy =
                end.y - start.y;


            const length =
                Math.hypot(dx, dy);


            segments.push({

                start,
                end,
                dx,
                dy,
                length,

                angle:
                    Math.atan2(
                        dy,
                        dx
                    ) * 180 / Math.PI

            });


            totalLength += length;

        }


        const startTime =
            performance.now();


        const step = now => {

            if (
                levelSolved ||
                levelFailed
            ) {
                return;
            }


            const elapsed =
                now - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const targetDistance =
                totalLength * progress;


            let passed = 0;
            let activeSegment =
                segments[
                    segments.length - 1
                ];


            for (
                let i = 0;
                i < segments.length;
                i++
            ) {

                const segment =
                    segments[i];


                if (
                    targetDistance <=
                    passed + segment.length
                ) {

                    activeSegment =
                        segment;

                    break;

                }


                passed +=
                    segment.length;

            }


            const localDistance =
                Math.max(
                    0,
                    targetDistance - passed
                );


            const localProgress =
                activeSegment.length > 0

                    ? Math.min(
                        localDistance /
                        activeSegment.length,
                        1
                    )

                    : 1;


            const x =
                activeSegment.start.x +
                activeSegment.dx *
                localProgress;


            const y =
                activeSegment.start.y +
                activeSegment.dy *
                localProgress;


            this.setTrainPosition(
                trainId,
                x,
                y,
                activeSegment.angle
            );


            if (progress < 1) {

                const frame =
                    requestAnimationFrame(
                        step
                    );

                this.animationFrame =
                    frame;

                return;

            }


            if (callback) {

                callback();

            }

        };


        const frame =
            requestAnimationFrame(
                step
            );

        this.animationFrame =
            frame;

    },


    // =====================================
    // TRAIN POSITION
    // =====================================

    setTrainPosition(
        trainId,
        x,
        y,
        angle
    ) {

        const train =
            document.getElementById(trainId);

        if (!train) {
            return;
        }


        train.style.left =
            `${x}px`;

        train.style.top =
            `${y}px`;

        train.style.right =
            "auto";


        /*
            Поезд рисуется носом вправо,
            поэтому угол совпадает
            с направлением сегмента.
        */

        train.style.transform =
            `rotate(${angle}deg)`;

    },


    // =====================================
    // WRONG MOVE
    // =====================================

    wrongMove() {

        if (
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        const puzzle =
            document.getElementById(
                "railwayPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.add(
            "railway-wrong"
        );


        const selected =
            puzzle.querySelector(
                `[data-switch="${this.selectedSwitch}"]`
            );


        if (selected) {

            selected.classList.add(
                "switch-wrong"
            );

        }


        if (
            typeof gameMessage !== "undefined" &&
            gameMessage
        ) {

            gameMessage.className =
                "message bad";

            gameMessage.textContent =
                "Неверный маршрут. −⭐";

        }


        registerWrongMove();


        if (
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.addTimer(() => {

            this.resetAfterWrongMove();

        }, 850);

    },


    // =====================================
    // RESET AFTER WRONG
    // =====================================

    resetAfterWrongMove() {

        if (
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        const puzzle =
            document.getElementById(
                "railwayPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.remove(
            "railway-running",
            "railway-wrong"
        );


        this.setTrainPosition(
            "trainA",
            20,
            74,
            0
        );


        this.setTrainPosition(
            "trainB",
            280,
            74,
            180
        );


        puzzle
            .querySelectorAll(".rail-switch")
            .forEach(button => {

                button.disabled = false;

                button.classList.remove(
                    "switch-selected",
                    "switch-changed",
                    "switch-wrong",
                    "switch-correct"
                );

            });


        this.selectedSwitch = null;

        this.locked = false;


        if (
            typeof movesText !== "undefined" &&
            movesText
        ) {

            movesText.textContent =
                "🚦 Попробуй другую стрелку";

        }

    },


    // =====================================
    // CORRECT
    // =====================================

    correctMove() {

        if (
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.solved = true;


        const puzzle =
            document.getElementById(
                "railwayPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.add(
            "railway-solved"
        );


        const selected =
            puzzle.querySelector(
                `[data-switch="${this.correctSwitch}"]`
            );


        if (selected) {

            selected.classList.remove(
                "switch-selected"
            );

            selected.classList.add(
                "switch-correct"
            );

        }


        puzzle
            .querySelectorAll(".rail-switch")
            .forEach(button => {

                button.disabled = true;

            });


        if (
            typeof movesText !== "undefined" &&
            movesText
        ) {

            movesText.textContent =
                "✓ Оба поезда прибыли";

        }


        if (
            typeof gameMessage !== "undefined" &&
            gameMessage
        ) {

            gameMessage.className =
                "message good";

            gameMessage.textContent =
                "Маршрут построен! 🚂🚂";

        }


        this.addTimer(() => {

            if (
                !levelSolved &&
                !levelFailed
            ) {

                solveLevel(40);

            }

        }, 700);

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.clearAnimations();

        this.locked = false;
        this.solved = false;
        this.selectedSwitch = null;


        const puzzle =
            document.getElementById(
                "railwayPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.remove(
            "railway-running",
            "railway-wrong",
            "railway-solved"
        );


        this.setTrainPosition(
            "trainA",
            20,
            74,
            0
        );


        this.setTrainPosition(
            "trainB",
            280,
            74,
            180
        );


        puzzle
            .querySelectorAll(".rail-switch")
            .forEach(button => {

                button.disabled = false;

                button.classList.remove(
                    "switch-selected",
                    "switch-changed",
                    "switch-wrong",
                    "switch-correct"
                );

            });

    },


    // =====================================
    // STOP
    // =====================================

    stop() {

        this.clearAnimations();

        this.locked = true;


        const puzzle =
            document.getElementById(
                "railwayPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle
            .querySelectorAll(".rail-switch")
            .forEach(button => {

                button.disabled = true;

            });

    },


    // =====================================
    // TIMER HELPER
    // =====================================

    addTimer(callback, delay) {

        const timer =
            setTimeout(() => {

                this.timers =
                    this.timers.filter(
                        item =>
                            item !== timer
                    );

                callback();

            }, delay);


        this.timers.push(
            timer
        );

        return timer;

    },


    // =====================================
    // CLEAR ANIMATIONS
    // =====================================

    clearAnimations() {

        this.timers.forEach(timer => {

            clearTimeout(timer);

        });


        this.timers = [];


        if (
            this.animationFrame !== null
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame = null;

        }

    }

};
