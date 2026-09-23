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

    // Единственная правильная стрелка
    correctSwitch: 11,

    resetTimer: null,

    render() {
        return `
        <div id="railwayPuzzle" class="puzzle-container">

            <div class="railway-info">
                🚦 Переключи одну стрелку, чтобы поезда
                безопасно разъехались.
            </div>

            <div class="railway-board">

                <!-- ДЕКОРАЦИИ -->

                <div class="railway-grid"></div>

                <div class="rail-tree tree-1">🌲</div>
                <div class="rail-tree tree-2">🌲</div>
                <div class="rail-tree tree-3">🌲</div>
                <div class="rail-tree tree-4">🌲</div>

                <div class="rail-rock rock-1"></div>
                <div class="rail-rock rock-2"></div>

                <!-- СТАНЦИИ -->

                <div class="rail-station station-a">
                    <span class="station-flag">🏁</span>
                    <span>A</span>
                </div>

                <div class="rail-station station-b">
                    <span class="station-flag">🏁</span>
                    <span>B</span>
                </div>


                <!-- =================================
                     РЕЛЬСЫ
                ================================== -->

                <div class="rail-track track-a-start"></div>
                <div class="rail-track track-a-mid"></div>
                <div class="rail-track track-a-turn"></div>
                <div class="rail-track track-a-finish"></div>

                <div class="rail-track track-b-start"></div>
                <div class="rail-track track-b-mid"></div>
                <div class="rail-track track-b-turn"></div>
                <div class="rail-track track-b-finish"></div>

                <!-- ЛОЖНЫЕ ПУТИ -->

                <div class="rail-track false-track false-track-1"></div>
                <div class="rail-track false-track false-track-2"></div>
                <div class="rail-track false-track false-track-3"></div>
                <div class="rail-track false-track false-track-4"></div>
                <div class="rail-track false-track false-track-5"></div>
                <div class="rail-track false-track false-track-6"></div>


                <!-- =================================
                     ПОЕЗД A
                ================================== -->

                <div class="train train-a" id="trainA">

                    <div class="train-light"></div>

                    <div class="train-engine">
                        <span class="train-window"></span>
                    </div>

                    <div class="train-car train-car-1"></div>
                    <div class="train-car train-car-2"></div>

                    <div class="train-smoke smoke-1"></div>
                    <div class="train-smoke smoke-2"></div>

                </div>


                <!-- =================================
                     ПОЕЗД B
                ================================== -->

                <div class="train train-b" id="trainB">

                    <div class="train-light"></div>

                    <div class="train-engine">
                        <span class="train-window"></span>
                    </div>

                    <div class="train-car train-car-1"></div>
                    <div class="train-car train-car-2"></div>

                    <div class="train-smoke smoke-1"></div>
                    <div class="train-smoke smoke-2"></div>

                </div>


                <!-- =================================
                     16 СТРЕЛОК
                ================================== -->

                ${this.renderSwitch(1)}
                ${this.renderSwitch(2)}
                ${this.renderSwitch(3)}
                ${this.renderSwitch(4)}

                ${this.renderSwitch(5)}
                ${this.renderSwitch(6)}
                ${this.renderSwitch(7)}
                ${this.renderSwitch(8)}

                ${this.renderSwitch(9)}
                ${this.renderSwitch(10)}
                ${this.renderSwitch(11)}
                ${this.renderSwitch(12)}

                ${this.renderSwitch(13)}
                ${this.renderSwitch(14)}
                ${this.renderSwitch(15)}
                ${this.renderSwitch(16)}

            </div>

        </div>
        `;
    },


    // =====================================
    // SWITCH HTML
    // =====================================

    renderSwitch(number) {

        return `
        <button
            class="rail-switch rail-switch-${number}"
            data-switch="${number}"
            aria-label="Железнодорожная стрелка ${number}"
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

        this.clearResetTimer();

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
            "railway-solved",
            "railway-resetting"
        );

        const switches =
            puzzle.querySelectorAll(".rail-switch");

        switches.forEach(button => {

            button.disabled = false;

            button.classList.remove(
                "switch-selected",
                "switch-correct",
                "switch-wrong"
            );

            button.onclick = () => {

                const number =
                    Number(button.dataset.switch);

                this.chooseSwitch(
                    button,
                    number
                );
            };
        });


        const trainA =
            document.getElementById("trainA");

        const trainB =
            document.getElementById("trainB");


        if (trainA) {

            trainA.className =
                "train train-a";

        }


        if (trainB) {

            trainB.className =
                "train train-b";

        }


        if (
            typeof movesText !== "undefined" &&
            movesText
        ) {

            movesText.textContent =
                "🚦 Переключи одну стрелку";

        }
    },


    // =====================================
    // PLAYER MOVE
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

        this.selectedSwitch =
            number;


        const puzzle =
            document.getElementById("railwayPuzzle");

        if (!puzzle) {
            return;
        }


        button.classList.add(
            "switch-selected"
        );


        // Физически переключаем рычаг

        button.classList.add(
            "switch-changed"
        );


        // Блокируем остальные стрелки

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


        // Небольшая пауза после переключения

        setTimeout(() => {

            if (
                levelSolved ||
                levelFailed
            ) {
                return;
            }

            this.startTrains();

        }, 450);
    },


    // =====================================
    // START BOTH TRAINS
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


        const trainA =
            document.getElementById("trainA");

        const trainB =
            document.getElementById("trainB");


        if (trainA) {

            trainA.classList.add(
                "train-moving"
            );

        }


        if (trainB) {

            trainB.classList.add(
                "train-moving"
            );

        }


        // =================================
        // ПРАВИЛЬНАЯ СТРЕЛКА
        // =================================

        if (
            this.selectedSwitch ===
            this.correctSwitch
        ) {

            if (trainA) {

                trainA.classList.add(
                    "train-a-success"
                );

            }

            if (trainB) {

                trainB.classList.add(
                    "train-b-success"
                );

            }


            setTimeout(() => {

                this.correctMove();

            }, 4300);

            return;
        }


        // =================================
        // НЕПРАВИЛЬНЫЕ МАРШРУТЫ
        // =================================

        let route = 1;


        if (
            [1, 4, 7, 10, 14]
                .includes(
                    this.selectedSwitch
                )
        ) {

            route = 1;

        }

        else if (
            [2, 5, 8, 12, 15]
                .includes(
                    this.selectedSwitch
                )
        ) {

            route = 2;

        }

        else {

            route = 3;

        }


        if (trainA) {

            trainA.classList.add(
                `train-a-wrong-${route}`
            );

        }


        if (trainB) {

            trainB.classList.add(
                `train-b-wrong-${route}`
            );

        }


        setTimeout(() => {

            this.wrongMove();

        }, 3300);
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
            document.getElementById("railwayPuzzle");

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
                "Маршруты пересеклись. −⭐";

        }


        // Сначала регистрируем ошибку
        // в общей системе игры.

        registerWrongMove();


        if (
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        // После ошибки возвращаем
        // поезда в исходное положение.

        this.resetTimer =
            setTimeout(() => {

                this.resetAfterWrongMove();

            }, 900);
    },


    // =====================================
    // RESET AFTER WRONG MOVE
    // =====================================

    resetAfterWrongMove() {

        if (
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        const puzzle =
            document.getElementById("railwayPuzzle");

        if (!puzzle) {
            return;
        }


        puzzle.classList.add(
            "railway-resetting"
        );


        puzzle.classList.remove(
            "railway-running",
            "railway-wrong"
        );


        const trainA =
            document.getElementById("trainA");

        const trainB =
            document.getElementById("trainB");


        if (trainA) {

            trainA.className =
                "train train-a";

        }


        if (trainB) {

            trainB.className =
                "train train-b";

        }


        const switches =
            puzzle.querySelectorAll(
                ".rail-switch"
            );


        switches.forEach(button => {

            button.disabled = false;

            button.classList.remove(
                "switch-selected",
                "switch-changed",
                "switch-wrong",
                "switch-correct"
            );

        });


        this.selectedSwitch =
            null;


        setTimeout(() => {

            puzzle.classList.remove(
                "railway-resetting"
            );

            this.locked =
                false;

        }, 250);


        if (
            typeof movesText !== "undefined" &&
            movesText
        ) {

            movesText.textContent =
                "🚦 Попробуй другую стрелку";

        }
    },


    // =====================================
    // CORRECT MOVE
    // =====================================

    correctMove() {

        if (
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.solved =
            true;


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
                "Отлично! Поезда безопасно разъехались 🚂";

        }


        setTimeout(() => {

            if (
                !levelSolved &&
                !levelFailed
            ) {

                solveLevel(40);

            }

        }, 900);
    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.clearResetTimer();

        this.locked =
            false;

        this.solved =
            false;

        this.selectedSwitch =
            null;


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
            "railway-solved",
            "railway-resetting"
        );


        const trainA =
            document.getElementById(
                "trainA"
            );

        const trainB =
            document.getElementById(
                "trainB"
            );


        if (trainA) {

            trainA.className =
                "train train-a";

        }


        if (trainB) {

            trainB.className =
                "train train-b";

        }


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

        this.clearResetTimer();

        this.locked =
            true;


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
    // CLEAR TIMER
    // =====================================

    clearResetTimer() {

        if (
            this.resetTimer
        ) {

            clearTimeout(
                this.resetTimer
            );

            this.resetTimer =
                null;
        }
    }
};
