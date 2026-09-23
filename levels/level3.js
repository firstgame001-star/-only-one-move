// =====================================
// ONLY ONE MOVE
// LEVEL 3 — LASER LABYRINTH
// =====================================

window.ONE_MOVE_LEVELS =
    window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[3] = {

    id: 3,
    type: "laser",

    locked: false,
    solved: false,
    selectedMirror: null,


    // =====================================
    // LEVEL HTML
    // =====================================

    render() {

        return `
        <div id="laserPuzzle" class="puzzle-container">

            <div class="laser-board">

                <!-- decorative grid -->
                <div class="laser-grid"></div>


                <!-- =========================
                     LASER SOURCE
                ========================== -->

                <div class="laser-source">
                    <div class="laser-source-core"></div>
                </div>


                <!-- =========================
                     TARGET
                ========================== -->

                <div class="laser-target">
                    <div class="laser-target-ring ring-1"></div>
                    <div class="laser-target-ring ring-2"></div>
                    <div class="laser-target-core"></div>
                </div>


                <!-- =========================
                     OBSTACLES
                ========================== -->

                <div class="laser-block block-1"></div>
                <div class="laser-block block-2"></div>
                <div class="laser-block block-3"></div>
                <div class="laser-block block-4"></div>
                <div class="laser-block block-5"></div>


                <!-- =========================
                     LASER BEAM
                     Initial visible path
                ========================== -->

                <div class="laser-beam beam-1"></div>
                <div class="laser-beam beam-2"></div>
                <div class="laser-beam beam-3"></div>
                <div class="laser-beam beam-4"></div>


                <!-- =========================
                     MIRRORS
                     12 mirrors total
                ========================== -->


                <!-- mirror 1 -->
                <button
                    class="laser-mirror mirror-1 angle-back"
                    data-mirror="1"
                    aria-label="Зеркало 1"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 2 -->
                <button
                    class="laser-mirror mirror-2 angle-forward"
                    data-mirror="2"
                    aria-label="Зеркало 2"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 3 -->
                <button
                    class="laser-mirror mirror-3 angle-back"
                    data-mirror="3"
                    aria-label="Зеркало 3"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 4 -->
                <button
                    class="laser-mirror mirror-4 angle-forward"
                    data-mirror="4"
                    aria-label="Зеркало 4"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 5 -->
                <button
                    class="laser-mirror mirror-5 angle-back"
                    data-mirror="5"
                    aria-label="Зеркало 5"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 6 -->
                <button
                    class="laser-mirror mirror-6 angle-forward"
                    data-mirror="6"
                    aria-label="Зеркало 6"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 7 -->
                <button
                    class="laser-mirror mirror-7 angle-forward"
                    data-mirror="7"
                    aria-label="Зеркало 7"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 8 -->
                <button
                    class="laser-mirror mirror-8 angle-back"
                    data-mirror="8"
                    aria-label="Зеркало 8"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 9 -->
                <button
                    class="laser-mirror mirror-9 angle-forward"
                    data-mirror="9"
                    aria-label="Зеркало 9"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!--
                    MIRROR 10
                    This is the correct mirror.
                    It starts in the wrong direction.
                -->

                <button
                    class="laser-mirror mirror-10 angle-back"
                    data-mirror="10"
                    aria-label="Зеркало 10"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 11 -->
                <button
                    class="laser-mirror mirror-11 angle-back"
                    data-mirror="11"
                    aria-label="Зеркало 11"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- mirror 12 -->
                <button
                    class="laser-mirror mirror-12 angle-forward"
                    data-mirror="12"
                    aria-label="Зеркало 12"
                >
                    <span class="mirror-glass"></span>
                </button>


                <!-- =========================
                     FINAL BEAMS
                     Hidden until solved
                ========================== -->

                <div class="laser-beam final-beam final-beam-1"></div>
                <div class="laser-beam final-beam final-beam-2"></div>
                <div class="laser-beam final-beam final-beam-3"></div>


                <!-- wrong laser flash -->
                <div class="wrong-laser-path"></div>

            </div>

        </div>
        `;
    },


    // =====================================
    // START LEVEL
    // =====================================

    start() {

        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;

        const puzzle =
            document.getElementById("laserPuzzle");

        if (!puzzle) return;


        puzzle.classList.remove(
            "laser-solved",
            "laser-wrong"
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
    // MIRROR CLICK
    // =====================================

    rotateMirror(mirror, mirrorNumber) {

        if (
            this.locked ||
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }


        this.locked = true;
        this.selectedMirror = mirrorNumber;


        // rotate mirror visually
        mirror.classList.add(
            "mirror-turning"
        );


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


        // =================================
        // CORRECT MIRROR
        // =================================

        if (mirrorNumber === 10) {

            setTimeout(() => {

                this.correctMove(
                    mirror
                );

            }, 350);

            return;
        }


        // =================================
        // WRONG MIRROR
        // =================================

        setTimeout(() => {

            this.wrongMove(
                mirror
            );

        }, 350);

    },


    // =====================================
    // WRONG MOVE
    // =====================================

    wrongMove(mirror) {

        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) return;


        puzzle.classList.add(
            "laser-wrong"
        );


        mirror.classList.add(
            "mirror-wrong"
        );


        gameMessage.className =
            "message bad";


        gameMessage.textContent =
            "Луч ушёл не туда. −⭐";


        setTimeout(() => {

            // return mirror to original angle

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
                "laser-wrong"
            );


            registerWrongMove();


            if (
                !levelSolved &&
                !levelFailed
            ) {

                this.locked = false;
                this.selectedMirror = null;

            }

        }, 700);

    },


    // =====================================
    // CORRECT MOVE
    // =====================================

    correctMove(mirror) {

        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );

        if (!puzzle) return;


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


        // disable all mirrors

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
            "Есть! Луч попал в цель 🔴";


        // allow beam animation to finish

        setTimeout(() => {

            if (
                !levelSolved &&
                !levelFailed
            ) {

                solveLevel(35);

            }

        }, 1500);

    },


    // =====================================
    // RESET LEVEL
    // =====================================

    reset() {

        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;


        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );


        if (!puzzle) return;


        puzzle.classList.remove(
            "laser-solved",
            "laser-wrong"
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


        // restore correct initial position
        // mirror 10 must begin as angle-back

        const mirror10 =
            puzzle.querySelector(
                '[data-mirror="10"]'
            );


        if (mirror10) {

            mirror10.classList.remove(
                "angle-forward"
            );

            mirror10.classList.add(
                "angle-back"
            );

        }

    },


    // =====================================
    // STOP LEVEL
    // =====================================

    stop() {

        this.locked = true;


        const puzzle =
            document.getElementById(
                "laserPuzzle"
            );


        if (!puzzle) return;


        puzzle
            .querySelectorAll(
                ".laser-mirror"
            )
            .forEach(mirror => {

                mirror.disabled = true;

            });

    }

};
