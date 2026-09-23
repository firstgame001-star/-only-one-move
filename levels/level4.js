// =====================================
// ONLY ONE MOVE
// LEVEL 4 — RAILWAY NETWORK
// SVG TRACKS + 2 TRAINS + 16 SWITCHES
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

    timers: [],
    animationFrames: [],


    // =====================================
    // RENDER
    // =====================================

    render() {

        let switches = "";

        for (let i = 1; i <= 16; i++) {

            switches += `
                <button
                    class="rail-switch rail-switch-${i}"
                    data-switch="${i}"
                    aria-label="Стрелка ${i}"
                >
                    <span class="switch-handle">
                        <span class="switch-knob"></span>
                    </span>
                </button>
            `;
        }


        return `
        <div
            id="railwayPuzzle"
            class="puzzle-container"
        >

            <div class="railway-board">

                <div class="railway-grid"></div>


                <!-- =========================
                     DECOR
                ========================== -->

                <div class="rail-tree tree-1">🌲</div>
                <div class="rail-tree tree-2">🌲</div>
                <div class="rail-tree tree-3">🌲</div>
                <div class="rail-tree tree-4">🌲</div>
                <div class="rail-tree tree-5">🌲</div>
                <div class="rail-tree tree-6">🌲</div>
                <div class="rail-tree tree-7">🌲</div>
                <div class="rail-tree tree-8">🌲</div>
                <div class="rail-bush bush-1">🌿</div>
                <div class="rail-bush bush-2">🌿</div>
                <div class="rail-bush bush-3">🌿</div>
                <div class="rail-bush bush-4">🌿</div>
                <div class="rail-flower flower-1">✿</div>
                <div class="rail-flower flower-2">✿</div>
                <div class="rail-cabin">🏠</div>
                <div class="rail-lamp lamp-1">●</div>
                <div class="rail-lamp lamp-2">●</div>
                <div class="rail-lamp lamp-3">●</div>
                <div class="rail-lamp lamp-4">●</div>

                <div class="rail-rock rock-1"></div>
                <div class="rail-rock rock-2"></div>


                <!-- =========================
                     SVG RAILWAY
                ========================== -->

                <svg
                    class="railway-svg"
                    viewBox="0 0 350 405"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >

                    <defs>

                        <filter
                            id="railShadow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="2"
                                stdDeviation="2"
                                flood-color="#000000"
                                flood-opacity=".45"
                            />
                        </filter>

                    </defs>


                    <!-- =====================
                         BALLAST / DARK BASE
                    ====================== -->

                    <g
                        class="rail-ballast"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >

                        <!-- TOP LEFT -->
                        <path d="M 0 86 L 72 86 L 112 113 L 151 140 L 177 164"/>

                        <!-- TOP RIGHT -->
                        <path d="M 350 86 L 280 86 L 245 86 L 222 111 L 198 137 L 177 164"/>

                        <!-- CENTER TO B -->
                        <path d="M 177 164 L 147 195 L 111 231 L 76 266 L 51 309 L 51 356"/>

                        <!-- CENTER TO A -->
                        <path d="M 177 164 L 211 195 L 247 231 L 277 267 L 286 309 L 286 356"/>

                        <!-- FALSE LEFT BRANCH -->
                        <path d="M 112 113 L 134 160 L 134 238"/>

                        <!-- FALSE RIGHT BRANCH -->
                        <path d="M 222 111 L 247 157 L 280 218"/>

                        <!-- FALSE CROSS -->
                        <path d="M 111 231 L 177 164 L 247 231"/>

                    </g>


                    <!-- =====================
                         SLEEPERS
                    ====================== -->

                    <g class="rail-sleepers">

                        <!-- TOP LEFT -->
                        <line x1="14" y1="78" x2="14" y2="94"/>
                        <line x1="32" y1="78" x2="32" y2="94"/>
                        <line x1="50" y1="78" x2="50" y2="94"/>
                        <line x1="68" y1="78" x2="68" y2="94"/>

                        <line x1="82" y1="83" x2="75" y2="96"/>
                        <line x1="98" y1="94" x2="90" y2="107"/>
                        <line x1="116" y1="105" x2="108" y2="119"/>
                        <line x1="132" y1="116" x2="124" y2="130"/>
                        <line x1="149" y1="128" x2="141" y2="142"/>
                        <line x1="165" y1="145" x2="153" y2="157"/>


                        <!-- TOP RIGHT -->
                        <line x1="336" y1="78" x2="336" y2="94"/>
                        <line x1="318" y1="78" x2="318" y2="94"/>
                        <line x1="300" y1="78" x2="300" y2="94"/>
                        <line x1="282" y1="78" x2="282" y2="94"/>

                        <line x1="259" y1="82" x2="268" y2="96"/>
                        <line x1="242" y1="94" x2="252" y2="106"/>
                        <line x1="227" y1="107" x2="239" y2="118"/>
                        <line x1="211" y1="124" x2="223" y2="135"/>
                        <line x1="195" y1="142" x2="207" y2="153"/>


                        <!-- CENTER LEFT -->
                        <line x1="160" y1="170" x2="172" y2="182"/>
                        <line x1="146" y1="185" x2="158" y2="197"/>
                        <line x1="131" y1="200" x2="143" y2="212"/>
                        <line x1="116" y1="215" x2="128" y2="227"/>
                        <line x1="101" y1="231" x2="113" y2="243"/>
                        <line x1="87" y1="246" x2="99" y2="258"/>
                        <line x1="70" y1="265" x2="84" y2="273"/>

                        <line x1="43" y1="290" x2="58" y2="299"/>
                        <line x1="43" y1="316" x2="59" y2="316"/>
                        <line x1="43" y1="337" x2="59" y2="337"/>


                        <!-- CENTER RIGHT -->
                        <line x1="183" y1="169" x2="172" y2="181"/>
                        <line x1="198" y1="184" x2="187" y2="197"/>
                        <line x1="214" y1="200" x2="202" y2="212"/>
                        <line x1="229" y1="215" x2="217" y2="227"/>
                        <line x1="245" y1="231" x2="233" y2="243"/>
                        <line x1="260" y1="247" x2="248" y2="259"/>
                        <line x1="277" y1="264" x2="263" y2="274"/>

                        <line x1="278" y1="290" x2="293" y2="287"/>
                        <line x1="278" y1="316" x2="294" y2="316"/>
                        <line x1="278" y1="337" x2="294" y2="337"/>


                        <!-- FALSE LEFT -->
                        <line x1="119" y1="128" x2="132" y2="122"/>
                        <line x1="127" y1="148" x2="141" y2="143"/>
                        <line x1="126" y1="172" x2="142" y2="172"/>
                        <line x1="126" y1="196" x2="142" y2="196"/>
                        <line x1="126" y1="220" x2="142" y2="220"/>


                        <!-- FALSE RIGHT -->
                        <line x1="225" y1="128" x2="239" y2="121"/>
                        <line x1="237" y1="150" x2="251" y2="143"/>
                        <line x1="249" y1="173" x2="263" y2="166"/>
                        <line x1="262" y1="196" x2="276" y2="189"/>

                    </g>


                    <!-- =====================
                         STEEL RAILS
                    ====================== -->

                    <g
                        class="rail-steel"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >

                        <path d="M 0 82 L 72 82 L 114 109 L 154 136 L 180 160"/>
                        <path d="M 0 90 L 70 90 L 110 117 L 148 144 L 174 168"/>


                        <path d="M 350 82 L 280 82 L 242 82 L 218 107 L 194 133 L 174 160"/>
                        <path d="M 350 90 L 282 90 L 248 90 L 226 115 L 202 141 L 180 168"/>


                        <path d="M 174 160 L 143 191 L 107 227 L 72 262 L 47 307 L 47 356"/>
                        <path d="M 180 168 L 151 199 L 115 235 L 80 270 L 55 311 L 55 356"/>


                        <path d="M 180 160 L 215 191 L 251 227 L 281 263 L 290 307 L 290 356"/>
                        <path d="M 174 168 L 207 199 L 243 235 L 273 271 L 282 311 L 282 356"/>


                        <!-- FALSE LEFT -->
                        <path d="M 108 111 L 130 161 L 130 238"/>
                        <path d="M 116 115 L 138 159 L 138 238"/>


                        <!-- FALSE RIGHT -->
                        <path d="M 218 109 L 243 159 L 276 220"/>
                        <path d="M 226 113 L 251 155 L 284 216"/>

                    </g>


                    <!-- CENTRAL GLOW -->
                    <circle
                        class="junction-core"
                        cx="177"
                        cy="164"
                        r="8"
                    />

                </svg>


                <!-- =========================
                     STATIONS
                ========================== -->

                <div class="rail-station station-b">
                    <span>🏁</span>
                    <b>B</b>
                </div>

                <div class="rail-station station-a">
                    <span>🏁</span>
                    <b>A</b>
                </div>


                <!-- =========================
                     TRAIN A — RED
                ========================== -->

                <div
                    class="train train-a"
                    id="trainA"
                >

                    <span class="train-smoke smoke-1"></span><span class="train-smoke smoke-2"></span>
                    <div class="train-car train-car-back"><span class="car-window"></span></div>

                    <div class="train-car train-car-middle"><span class="car-window"></span></div>

                    <div class="train-engine">

                        <span class="train-window"></span>

                        <span class="train-light"></span>

                    </div>

                </div>


                <!-- =========================
                     TRAIN B — BLUE
                ========================== -->

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


                <!-- SWITCHES -->

                ${switches}

            </div>

        </div>
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
        this.arrived = 0;


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


                button.onclick = () => {

                    this.chooseSwitch(
                        button,
                        Number(
                            button.dataset.switch
                        )
                    );

                };

            });


        // Красный поезд слева
        this.setTrainPosition(
            "trainA",
            5,
            86,
            0
        );


        // Синий поезд справа
        this.setTrainPosition(
            "trainB",
            345,
            86,
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
    // CHOOSE SWITCH
    // =====================================

    chooseSwitch(button, number) {
        if (this.locked || this.solved || levelSolved || levelFailed) return;

        this.locked = true;
        this.selectedSwitch = number;

        const puzzle = document.getElementById("railwayPuzzle");
        if (!puzzle) return;

        puzzle.classList.add("railway-running");
        button.classList.add("switch-selected", "switch-changed");

        puzzle.querySelectorAll(".rail-switch").forEach(item => {
            item.disabled = true;
        });

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🚂 Поезда в пути…";
        }

        const timer = setTimeout(() => {
            if (number === this.correctSwitch) {
                button.classList.add("switch-correct");
                this.runCorrectRoute();
            } else {
                button.classList.add("switch-wrong");
                this.runWrongRoute(number);
            }
        }, 300);

        this.timers.push(timer);
    },

    runCorrectRoute() {
        const routeA = [
            [5,86],[72,86],[112,113],[151,140],[177,164],
            [211,195],[247,231],[277,267],[286,309],[286,356]
        ];
        const routeB = [
            [345,86],[280,86],[245,86],[222,111],[198,137],[177,164],
            [147,195],[111,231],[76,266],[51,309],[51,356]
        ];

        // Both trains start together, but B is slightly slower so they do not
        // occupy the central junction at the same instant.
        this.animateTrain("trainA", routeA, 3900, () => this.trainArrived("A"));
        this.animateTrain("trainB", routeB, 4400, () => this.trainArrived("B"));
    },

    runWrongRoute(number) {
        let routeA;
        let routeB;

        if ([1,4,7,10,14].includes(number)) {
            routeA = [[5,86],[72,86],[112,113],[151,140],[177,164]];
            routeB = [[345,86],[280,86],[245,86],[222,111],[198,137],[177,164]];
        } else if ([2,5,8,12,15].includes(number)) {
            routeA = [[5,86],[72,86],[112,113],[134,160],[134,238]];
            routeB = [[345,86],[280,86],[245,86],[222,111],[247,157],[280,218]];
        } else {
            routeA = [[5,86],[72,86],[112,113],[151,140],[177,164],[147,195],[111,231]];
            routeB = [[345,86],[280,86],[245,86],[222,111],[198,137],[177,164],[211,195],[247,231]];
        }

        let finished = 0;
        const done = () => {
            finished += 1;
            if (finished === 2) this.wrongMove();
        };

        this.animateTrain("trainA", routeA, 2500, done);
        this.animateTrain("trainB", routeB, 2500, done);
    },

    animateTrain(id, points, duration, onDone) {
        const train = document.getElementById(id);
        if (!train || !points || points.length < 2) return;

        const segments = [];
        let totalLength = 0;

        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
            segments.push({ a, b, length, start: totalLength });
            totalLength += length;
        }

        const start = performance.now();
        let rafId = 0;

        const frame = now => {
            const raw = Math.min(1, (now - start) / duration);
            const t = raw < .5
                ? 2 * raw * raw
                : 1 - Math.pow(-2 * raw + 2, 2) / 2;
            const distance = t * totalLength;

            let segment = segments[segments.length - 1];
            for (const item of segments) {
                if (distance <= item.start + item.length) {
                    segment = item;
                    break;
                }
            }

            const local = segment.length
                ? Math.max(0, Math.min(1, (distance - segment.start) / segment.length))
                : 0;

            const x = segment.a[0] + (segment.b[0] - segment.a[0]) * local;
            const y = segment.a[1] + (segment.b[1] - segment.a[1]) * local;
            const angle = Math.atan2(
                segment.b[1] - segment.a[1],
                segment.b[0] - segment.a[0]
            ) * 180 / Math.PI;

            this.setTrainPosition(id, x, y, angle);

            if (raw < 1 && this.locked) {
                rafId = requestAnimationFrame(frame);
                this.rafByTrain[id] = rafId;
            } else if (raw >= 1 && typeof onDone === "function") {
                delete this.rafByTrain[id];
                onDone();
            }
        };

        if (!this.rafByTrain) this.rafByTrain = {};
        rafId = requestAnimationFrame(frame);
        this.rafByTrain[id] = rafId;
    },

    setTrainPosition(id, x, y, angle) {
        const train = document.getElementById(id);
        const board = document.querySelector("#railwayPuzzle .railway-board");
        if (!train || !board) return;

        const sx = board.clientWidth / 350;
        const sy = board.clientHeight / 405;

        // Route coordinates are the exact centre line of the SVG track.
        // The train is centred on that point, then rotated around its own centre.
        train.style.left = (x * sx) + "px";
        train.style.top = (y * sy) + "px";
        train.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    },

    trainArrived() {
        this.arrived = (this.arrived || 0) + 1;
        if (this.arrived < 2) return;

        this.solved = true;
        this.locked = false;

        const puzzle = document.getElementById("railwayPuzzle");
        if (puzzle) puzzle.classList.add("railway-solved");

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "✓ Оба поезда прибыли";
        }

        const timer = setTimeout(() => {
            if (!levelSolved && !levelFailed) solveLevel(40);
        }, 650);
        this.timers.push(timer);
    },

    wrongMove() {
        const puzzle = document.getElementById("railwayPuzzle");
        if (puzzle) puzzle.classList.add("railway-wrong");

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "✕ Неверная стрелка";
        }

        if (!levelSolved && !levelFailed) registerWrongMove();

        const timer = setTimeout(() => {
            if (!levelSolved && !levelFailed) this.reset();
        }, 850);
        this.timers.push(timer);
    },

    reset() {
        this.clearAnimations();
        this.arrived = 0;
        this.start();
    },

    stop() {
        this.clearAnimations();
        this.locked = true;
    },

    clearAnimations() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];

        this.animationFrames.forEach(frame => cancelAnimationFrame(frame));
        this.animationFrames = [];

        if (this.rafByTrain) {
            Object.values(this.rafByTrain).forEach(frame => cancelAnimationFrame(frame));
            this.rafByTrain = {};
        }
    }
};
