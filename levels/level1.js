// =====================================
// ONLY ONE MOVE
// LEVEL 1 — MATCHSTICKS
// =====================================

window.ONE_MOVE_LEVELS =
    window.ONE_MOVE_LEVELS || {};


// =====================================
// LEVEL 1
// =====================================

window.ONE_MOVE_LEVELS[1] = {

    id: 1,

    type: "matchsticks",


    // =================================
    // HTML
    // =================================

    render() {

        return `

        <div
            id="matchstickPuzzle"
            class="puzzle-container"
        >

            <div
                class="equation"
                id="matchEquation"
            >


                <!-- 6 -->

                <div
                    class="digit"
                    data-symbol="6"
                >

                    <span
                        class="match h a"
                        data-segment="A"
                    ></span>

                    <span
                        class="match v f"
                        data-segment="F"
                    ></span>

                    <span
                        class="match h g"
                        data-segment="G"
                    ></span>

                    <span
                        class="match v e"
                        data-segment="E"
                    ></span>

                    <span
                        class="match v c"
                        data-segment="C"
                    ></span>

                    <span
                        class="match h d"
                        data-segment="D"
                    ></span>


                    <!--
                        Пустое место.
                        Сюда переносится спичка
                        из знака +
                    -->

                    <span
                        class="match-slot v-slot b"
                        data-empty-segment="B"
                    ></span>

                </div>


                <!-- + -->

                <div
                    class="operator"
                    data-symbol="+"
                >

                    <span
                        class="match match-h"
                        data-segment="H"
                    ></span>

                    <span
                        class="match match-v"
                        data-segment="V"
                    ></span>

                </div>


                <!-- 4 -->

                <div
                    class="digit"
                    data-symbol="4"
                >

                    <span
                        class="match v f"
                        data-segment="F"
                    ></span>

                    <span
                        class="match h g"
                        data-segment="G"
                    ></span>

                    <span
                        class="match v b"
                        data-segment="B"
                    ></span>

                    <span
                        class="match v c"
                        data-segment="C"
                    ></span>

                </div>


                <!-- = -->

                <div
                    class="equals-symbol"
                    data-symbol="="
                >

                    <span
                        class="match eq-top"
                        data-segment="TOP"
                    ></span>

                    <span
                        class="match eq-bottom"
                        data-segment="BOTTOM"
                    ></span>

                </div>


                <!-- 4 -->

                <div
                    class="digit"
                    data-symbol="4"
                >

                    <span
                        class="match v f"
                        data-segment="F"
                    ></span>

                    <span
                        class="match h g"
                        data-segment="G"
                    ></span>

                    <span
                        class="match v b"
                        data-segment="B"
                    ></span>

                    <span
                        class="match v c"
                        data-segment="C"
                    ></span>

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
            typeof resetMatchstickVisual ===
            "function"
        ) {

            resetMatchstickVisual();

        }


        if (
            typeof startMatchstickPuzzle ===
            "function"
        ) {

            startMatchstickPuzzle();

        }

    },


    // =================================
    // RESET
    // =================================

    reset() {

        if (
            typeof resetMatchstickVisual ===
            "function"
        ) {

            resetMatchstickVisual();

        }

    },


    // =================================
    // STOP
    // =================================

    stop() {

        if (
            typeof cancelCurrentDrag ===
            "function"
        ) {

            cancelCurrentDrag();

        }

    }

};
