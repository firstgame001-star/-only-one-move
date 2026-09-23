// =====================================
// ONLY ONE MOVE
// LEVEL 3 — LASER LABYRINTH
// 16 MIRRORS + FALSE ROUTES
// =====================================

window.ONE_MOVE_LEVELS =
    window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[3] = {

    id: 3,
    type: "laser",

    locked: false,
    solved: false,
    selectedMirror: null,

    // Единственное правильное зеркало
    correctMirror: 13,


    // =====================================
    // RENDER
    // =====================================

    render() {

        return `
        <div
            id="laserPuzzle"
            class="puzzle-container"
        >

            <div class="laser-board">

                <div class="laser-grid"></div>


                <!-- =====================
                     LASER SOURCE
                ====================== -->

                <div class="laser-source">
                    <div class="laser-source-core"></div>
                </div>


                <!-- =====================
                     TARGET
                ====================== -->

                <div class="laser-target">

                    <div
                        class="laser-target-ring ring-1"
                    ></div>

                    <div
                        class="laser-target-ring ring-2"
                    ></div>

                    <div
                        class="laser-target-core"
                    ></div>

                </div>


                <!-- =====================
                     METAL OBSTACLES
                ====================== -->

                <div class="laser-block block-1"></div>
                <div class="laser-block block-2"></div>
                <div class="laser-block block-3"></div>
                <div class="laser-block block-4"></div>
                <div class="laser-block block-5"></div>
                <div class="laser-block block-6"></div>


                <!-- =====================
                     STARTING LASER PATH
                ====================== -->

                <div class="laser-beam beam-1"></div>
                <div class="laser-beam beam-2"></div>
                <div class="laser-beam beam-3"></div>
                <div class="laser-beam beam-4"></div>
                <div class="laser-beam beam-5"></div>


                <!-- =====================
                     MIRRORS 1–16
                ====================== -->

                <button
                    class="laser-mirror mirror-1 angle-back"
                    data-mirror="1"
                    aria-label="Зеркало 1"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-2 angle-forward"
                    data-mirror="2"
                    aria-label="Зеркало 2"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-3 angle-back"
                    data-mirror="3"
                    aria-label="Зеркало 3"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-4 angle-forward"
                    data-mirror="4"
                    aria-label="Зеркало 4"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-5 angle-back"
                    data-mirror="5"
                    aria-label="Зеркало 5"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-6 angle-forward"
                    data-mirror="6"
                    aria-label="Зеркало 6"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-7 angle-forward"
                    data-mirror="7"
                    aria-label="Зеркало 7"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-8 angle-back"
                    data-mirror="8"
                    aria-label="Зеркало 8"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-9 angle-forward"
                    data-mirror="9"
                    aria-label="Зеркало 9"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-10 angle-back"
                    data-mirror="10"
                    aria-label="Зеркало 10"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-11 angle-forward"
                    data-mirror="11"
                    aria-label="Зеркало 11"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-12 angle-back"
                    data-mirror="12"
                    aria-label="Зеркало 12"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!--
                    ПРАВИЛЬНОЕ ЗЕРКАЛО
                -->

                <button
                    class="laser-mirror mirror-13 angle-back"
                    data-mirror="13"
                    aria-label="Зеркало 13"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-14 angle-forward"
                    data-mirror="14"
                    aria-label="Зеркало 14"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-15 angle-back"
                    data-mirror="15"
                    aria-label="Зеркало 15"
                >
                    <span class="mirror-glass"></span>
                </button>


                <button
                    class="laser-mirror mirror-16 angle-forward"
                    data-mirror="16"
                    aria-label="Зеркало 16"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- =====================
                     CORRECT FINAL ROUTE
                ====================== -->

                <div
                    class="laser-beam final-beam final-beam-1"
                ></div>

                <div
                    class="laser-beam final-beam final-beam-2"
                ></div>

                <div
                    class="laser-beam final-beam final-beam-3"
                ></div>

                <div
                    class="laser-beam final-beam final-beam-4"
                ></div>


                <!-- =====================
                     FALSE ROUTE A
                ====================== -->

                <div class="false-route false-route-a">

                    <div
                        class="false-beam false-a-1"
                    ></div>

                    <div
                        class="false-beam false-a-2"
                    ></div>

                </div>


                <!-- =====================
                     FALSE ROUTE B
                ====================== -->

                <div class="false-route false-route-b">

                    <div
                        class="false-beam false-b-1"
                    ></div>

                    <div
                        class="false-beam false-b-2"
                    ></div>

                    <div
                        class="false-beam false-b-3"
                    ></div>

                </div>


                <!-- =====================
                     FALSE ROUTE C
                ====================== -->

                <div class="false-route false-route-c">

                    <div
                        class="false-beam false-c-1"
                    ></div>

                    <div
                        class="false-beam false-c-2"
                    ></div>

                </div>

            </div>

        </div>
        `;
    },


    // =====================================
    // START
    // =====================================

    start() {

        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;

        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.remove(
            "laser-solved",
            "laser-wrong",
            "show-false-a",
            "show-false-b",
            "show-false-c"
        );


        const mirrors =
            puzzle.querySelectorAll(
                ".laser-mirror"
            );


        mirrors.forEach(mirror => {

            mirror.disabled = false;

            mirror.onclick = () => {

                const mirrorNumber =
                    Number(
                        mirror.dataset.mirror
                    );

                this.rotateMirror(
                    mirror,
                    mirrorNumber
                );

            };

        });

    },


    // =====================================
    // ROTATE MIRROR
    // =====================================

    rotateMirror(
        mirror,
        mirrorNumber
    ) {

        if (
            this.locked ||
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.locked = true;

        this.selectedMirror =
            mirrorNumber;


        mirror.classList.add(
            "mirror-turning"
        );


        /*
            Поворачиваем зеркало
            ровно на 90 градусов.
        */

        if (
            mirror.classList.contains(
                "angle-forward"
            )
        ) {

            mirror.classList.remove(
                "angle-forward"
            );

            mirror.classList.add(
                "angle-back"
            );

        } else {

            mirror.classList.remove(
                "angle-back"
            );

            mirror.classList.add(
                "angle-forward"
            );

        }


        /*
            Единственный
            правильный ход.
        */

        if (
            mirrorNumber ===
            this.correctMirror
        ) {

            setTimeout(() => {

                this.correctMove(
                    mirror
                );

            }, 350);

            return;
        }


        /*
            Для неправильных зеркал
            выбираем один из трёх
            ложных маршрутов.

            Маршрут определяется
            номером зеркала, поэтому
            результат не случайный.
        */

        let falseRoute = "a";


        if (
            [
                1,
                4,
                7,
                10,
                14
            ].includes(
                mirrorNumber
            )
        ) {

            falseRoute = "a";

        } else if (
            [
                2,
                5,
                8,
                11,
                15
            ].includes(
                mirrorNumber
            )
        ) {

            falseRoute = "b";

        } else {

            falseRoute = "c";

        }


        setTimeout(() => {

            this.wrongMove(
                mirror,
                falseRoute
            );

        }, 350);

    },


    // =====================================
    // WRONG MOVE
    // =====================================

    wrongMove(
        mirror,
        falseRoute
    ) {

        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.add(
            "laser-wrong"
        );


        puzzle.classList.add(
            `show-false-${falseRoute}`
        );


        mirror.classList.add(
            "mirror-wrong"
        );


        gameMessage.className =
            "message bad";


        gameMessage.textContent =
            "Луч ушёл по ложному маршруту. −⭐";


        /*
            Показываем ошибочный луч,
            затем возвращаем зеркало
            в исходное положение.
        */

        setTimeout(() => {

            if (
                mirror.classList.contains(
                    "angle-forward"
                )
            ) {

                mirror.classList.remove(
                    "angle-forward"
                );

                mirror.classList.add(
                    "angle-back"
                );

            } else {

                mirror.classList.remove(
                    "angle-back"
                );

                mirror.classList.add(
                    "angle-forward"
                );

            }


            mirror.classList.remove(
                "mirror-turning",
                "mirror-wrong"
            );


            puzzle.classList.remove(
                "laser-wrong",
                "show-false-a",
                "show-false-b",
                "show-false-c"
            );


            /*
                Общая механика игры:
                снимает одну ⭐.
            */

            registerWrongMove();


            if (
                !levelSolved &&
                !levelFailed
            ) {

                this.locked = false;

                this.selectedMirror =
                    null;

            }

        }, 850);

    },


    // =====================================
    // CORRECT MOVE
    // =====================================

    correctMove(
        mirror
    ) {

        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) {
            return;
        }


        this.solved = true;


        mirror.classList.remove(
            "mirror-turning"
        );


        mirror.classList.add(
            "mirror-correct"
        );


        puzzle.classList.add(
            "laser-solved"
        );


        /*
            После правильного хода
            больше ничего нажать нельзя.
        */

        puzzle
            .querySelectorAll(
                ".laser-mirror"
            )
            .forEach(item => {

                item.disabled = true;

            });


        movesText.textContent =
            "✓ Лазер направлен";


        gameMessage.className =
            "message good";


        gameMessage.textContent =
            "Есть! Луч прошёл лабиринт и попал в цель 🔴";


        /*
            Даём игроку увидеть
            финальную анимацию.
        */

        setTimeout(() => {

            if (
                !levelSolved &&
                !levelFailed
            ) {

                solveLevel(35);

            }

        }, 1600);

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;


        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle.classList.remove(
            "laser-solved",
            "laser-wrong",
            "show-false-a",
            "show-false-b",
            "show-false-c"
        );


        puzzle
            .querySelectorAll(
                ".laser-mirror"
            )
            .forEach(mirror => {

                mirror.disabled = false;

                mirror.classList.remove(
                    "mirror-turning",
                    "mirror-wrong",
                    "mirror-correct"
                );

            });


        /*
            Возвращаем правильное
            зеркало №13
            в стартовое положение.
        */

        const correctMirror =
            puzzle.querySelector(
                '[data-mirror="13"]'
            );


        if (correctMirror) {

            correctMirror.classList.remove(
                "angle-forward"
            );

            correctMirror.classList.add(
                "angle-back"
            );

        }

    },


    // =====================================
    // STOP
    // =====================================

    stop() {

        this.locked = true;


        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) {
            return;
        }


        puzzle
            .querySelectorAll(
                ".laser-mirror"
            )
            .forEach(mirror => {

                mirror.disabled = true;

            });

    }

};
