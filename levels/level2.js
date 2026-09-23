// =====================================
// ONLY ONE MOVE
// LEVEL 2 — FREE THE FISH
// =====================================

window.ONE_MOVE_LEVELS =
    window.ONE_MOVE_LEVELS || {};


// =====================================
// LEVEL 2
// =====================================

window.ONE_MOVE_LEVELS[2] = {

    id: 2,

    type: "fish",


    // =================================
    // HTML
    // =================================

    render() {

        return `

        <div
            id="fishPuzzle"
            class="puzzle-container"
        >

            <div class="fish-area">


                <!-- BUBBLES -->

                <span class="fish-bubble b1"></span>
                <span class="fish-bubble b2"></span>
                <span class="fish-bubble b3"></span>
                <span class="fish-bubble b4"></span>


                <!-- SEAWEED -->

                <span class="seaweed s1"></span>
                <span class="seaweed s2"></span>
                <span class="seaweed s3"></span>
                <span class="seaweed s4"></span>


                <!-- ROCKS -->

                <span class="fish-rock r1"></span>
                <span class="fish-rock r2"></span>


                <!-- OPEN WATER -->

                <div class="fish-exit"></div>


                <!-- WOODEN CAGE -->

                <div class="fish-trap">


                    <!-- FISH -->

                    <div
                        class="fish"
                        id="fish"
                    >
                        🐠
                    </div>


                    <!-- BAR 1 -->

                    <button
                        class="fish-bar fish-bar-top"
                        data-bar="1"
                        onclick="moveFishBar(1)"
                        aria-label="Планка 1"
                    ></button>


                    <!-- BAR 2 -->

                    <button
                        class="fish-bar fish-bar-left"
                        data-bar="2"
                        onclick="moveFishBar(2)"
                        aria-label="Планка 2"
                    ></button>


                    <!-- BAR 3 -->

                    <button
                        class="fish-bar fish-bar-right"
                        data-bar="3"
                        onclick="moveFishBar(3)"
                        aria-label="Планка 3"
                    ></button>


                    <!--
                        BAR 4

                        Правильная планка.
                        Игрок этого визуально
                        не видит.
                    -->

                    <button
                        class="fish-bar fish-bar-bottom-right"
                        data-bar="4"
                        onclick="moveFishBar(4)"
                        aria-label="Планка 4"
                    ></button>


                    <!-- BAR 5 -->

                    <button
                        class="fish-bar fish-bar-bottom-left"
                        data-bar="5"
                        onclick="moveFishBar(5)"
                        aria-label="Планка 5"
                    ></button>


                    <!-- BAR 6 -->

                    <button
                        class="fish-bar fish-cage-v fish-cage-v1"
                        data-bar="6"
                        onclick="moveFishBar(6)"
                        aria-label="Планка 6"
                    ></button>


                    <!-- BAR 7 -->

                    <button
                        class="fish-bar fish-cage-v fish-cage-v2"
                        data-bar="7"
                        onclick="moveFishBar(7)"
                        aria-label="Планка 7"
                    ></button>


                    <!-- BAR 8 -->

                    <button
                        class="fish-bar fish-cage-v fish-cage-v3"
                        data-bar="8"
                        onclick="moveFishBar(8)"
                        aria-label="Планка 8"
                    ></button>


                    <!-- BAR 9 -->

                    <button
                        class="fish-bar fish-cage-h"
                        data-bar="9"
                        onclick="moveFishBar(9)"
                        aria-label="Планка 9"
                    ></button>


                </div>

            </div>

        </div>

        `;

    },


    // =================================
    // START
    // =================================

    start() {

        if (
            typeof startObjectPuzzle ===
            "function"
        ) {

            startObjectPuzzle();

            return;

        }


        if (
            typeof resetFishPuzzle ===
            "function"
        ) {

            resetFishPuzzle();

        }

    },


    // =================================
    // RESET
    // =================================

    reset() {

        if (
            typeof resetFishPuzzle ===
            "function"
        ) {

            resetFishPuzzle();

        }

    },


    // =================================
    // STOP
    // =================================

    stop() {

        if (
            typeof stopFishSwimming ===
            "function"
        ) {

            stopFishSwimming();

        }

    }

};
