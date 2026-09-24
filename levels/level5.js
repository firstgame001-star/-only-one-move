// =====================================
// ONLY ONE MOVE — LEVEL 5
// PIPE NETWORK — ONE ROTATION
// =====================================

window.ONE_MOVE_LEVELS = window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[5] = {
    id: 5,
    type: "pipes",

    locked: false,
    solved: false,
    selectedCell: null,
    correctCell: 25,
    timers: [],

    // Маршрут от источника до приёмника.
    // В клетке 25 труба изначально повернута неверно.
    solutionPath: [
        0, 1, 2,
        9,
        16, 17, 18,
        25,
        32, 31, 30,
        37,
        44, 45, 46, 47, 48
    ],

    preBreakPath: [
        0, 1, 2,
        9,
        16, 17, 18
    ],

    layout: null,

    buildLayout() {
        const types = ["elbow", "straight", "tee", "elbow", "straight", "cross", "tee"];
        const rotations = [0, 90, 180, 270];

        const layout = Array.from({ length: 49 }, (_, index) => {
            const row = Math.floor(index / 7);

            return {
                type: types[(index * 3 + row * 2) % types.length],
                rot: rotations[(index * 5 + row * 3) % rotations.length],
                role: "pipe"
            };
        });

        const set = (index, type, rot, role = "pipe") => {
            layout[index] = { type, rot, role };
        };

        // Настоящий путь.
        set(0,  "straight", 0,   "source");
        set(1,  "straight", 0);
        set(2,  "elbow",    0);    // left -> down
        set(9,  "straight", 90);
        set(16, "elbow",    180);  // up -> right
        set(17, "straight", 0);
        set(18, "elbow",    0);    // left -> down

        // Единственный разрыв. После одного поворота 0° -> 90°.
        set(25, "straight", 0);

        set(32, "elbow",    90);   // up -> left
        set(31, "straight", 0);
        set(30, "elbow",    270);  // right -> down
        set(37, "straight", 90);
        set(44, "elbow",    180);  // up -> right
        set(45, "straight", 0);
        set(46, "straight", 0);
        set(47, "straight", 0);
        set(48, "straight", 0,   "receiver");

        // Дополнительные ложные развилки для средней сложности.
        set(3,  "tee",      180);
        set(4,  "elbow",    270);
        set(5,  "straight", 90);
        set(6,  "elbow",    90);
        set(7,  "tee",      90);
        set(8,  "elbow",    180);
        set(10, "tee",      0);
        set(11, "straight", 0);
        set(12, "tee",      270);
        set(13, "straight", 90);
        set(14, "elbow",    270);
        set(15, "tee",      90);
        set(19, "cross",    0);
        set(20, "elbow",    0);
        set(21, "straight", 90);
        set(22, "elbow",    180);
        set(23, "tee",      270);
        set(24, "elbow",    90);
        set(26, "tee",      180);
        set(27, "straight", 90);
        set(28, "elbow",    270);
        set(29, "tee",      0);
        set(33, "elbow",    180);
        set(34, "tee",      90);
        set(35, "straight", 90);
        set(36, "elbow",    0);
        set(38, "tee",      180);
        set(39, "elbow",    270);
        set(40, "straight", 90);
        set(41, "elbow",    0);
        set(42, "tee",      0);
        set(43, "straight", 90);

        this.layout = layout;
        return layout;
    },

    pipePath(type) {
        const paths = {
            straight: "M 0 50 L 100 50",
            elbow: "M 0 50 L 43 50 Q 50 50 50 57 L 50 100",
            tee: "M 0 50 L 100 50 M 50 50 L 50 100",
            cross: "M 0 50 L 100 50 M 50 0 L 50 100"
        };

        return paths[type] || paths.straight;
    },

    render() {
        const layout = this.buildLayout();

        const cells = layout.map((cell, index) => {
            const path = this.pipePath(cell.type);
            const special = cell.role !== "pipe";
            const label = special
                ? (cell.role === "source" ? "Источник воды" : "Приёмник")
                : `Труба ${index + 1}`;

            return `
                <button
                    type="button"
                    class="pipe-cell pipe-${cell.role}"
                    data-cell="${index}"
                    data-base-rot="${cell.rot}"
                    data-rot="${cell.rot}"
                    aria-label="${label}"
                    ${special ? "disabled" : ""}
                >
                    <span
                        class="pipe-rotor"
                        style="--pipe-rot:${cell.rot}deg"
                    >
                        <svg
                            class="pipe-svg"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path class="pipe-shadow" d="${path}"></path>
                            <path class="pipe-metal" d="${path}"></path>
                            <path class="pipe-shine" d="${path}"></path>
                            <path class="pipe-water" d="${path}"></path>
                        </svg>
                    </span>

                    ${cell.role === "source" ? `
                        <span class="pipe-source-tank">
                            <span class="source-water"></span>
                            <span class="source-drop">💧</span>
                        </span>
                    ` : ""}

                    ${cell.role === "receiver" ? `
                        <span class="pipe-receiver-box">
                            <span class="receiver-flag">🏁</span>
                        </span>
                    ` : ""}
                </button>
            `;
        }).join("");

        return `
            <div id="pipePuzzle" class="pipe-puzzle">
                <div class="pipe-board" id="pipeBoard">
                    <div class="pipe-forest-glow glow-a"></div>
                    <div class="pipe-forest-glow glow-b"></div>
                    <div class="pipe-decor decor-a">🌲</div>
                    <div class="pipe-decor decor-b">🌿</div>
                    <div class="pipe-decor decor-c">🌲</div>
                    <div class="pipe-grid">
                        ${cells}
                    </div>
                </div>
            </div>
        `;
    },

    start() {
        this.clearTimers();

        this.locked = false;
        this.solved = false;
        this.selectedCell = null;

        const puzzle = document.getElementById("pipePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "pipe-running",
            "pipe-wrong-state",
            "pipe-solved"
        );

        puzzle.querySelectorAll(".pipe-cell").forEach(button => {
            const index = Number(button.dataset.cell);
            const data = this.layout && this.layout[index];

            button.classList.remove(
                "pipe-selected",
                "pipe-wrong",
                "pipe-filled",
                "pipe-correct"
            );

            if (data) {
                button.dataset.rot = String(data.rot);
                button.dataset.baseRot = String(data.rot);

                const rotor = button.querySelector(".pipe-rotor");
                if (rotor) {
                    rotor.style.setProperty("--pipe-rot", data.rot + "deg");
                }
            }

            if (button.classList.contains("pipe-source") ||
                button.classList.contains("pipe-receiver")) {
                button.disabled = true;
                button.onclick = null;
                return;
            }

            button.disabled = false;
            button.onclick = event => {
                event.preventDefault();
                this.choosePipe(button, index);
            };
        });

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "⚡ Поверни одну трубу";
        }
    },

    choosePipe(button, index) {
        if (this.locked || this.solved || levelSolved || levelFailed) return;

        this.locked = true;
        this.selectedCell = index;

        const puzzle = document.getElementById("pipePuzzle");
        if (puzzle) {
            puzzle.classList.add("pipe-running");
        }

        button.classList.add("pipe-selected");

        const current = Number(button.dataset.rot) || 0;
        const next = (current + 90) % 360;

        button.dataset.rot = String(next);

        const rotor = button.querySelector(".pipe-rotor");
        if (rotor) {
            rotor.style.setProperty("--pipe-rot", next + "deg");
        }

        document.querySelectorAll("#pipePuzzle .pipe-cell").forEach(cell => {
            cell.disabled = true;
        });

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "💧 Проверяем поток…";
        }

        const timer = setTimeout(() => {
            if (index === this.correctCell) {
                this.correctMove(button);
            } else {
                this.wrongMove(button);
            }
        }, 330);

        this.timers.push(timer);
    },

    fillPath(path, step = 115, onDone = null) {
        path.forEach((cellIndex, order) => {
            const timer = setTimeout(() => {
                const cell = document.querySelector(
                    `#pipePuzzle .pipe-cell[data-cell="${cellIndex}"]`
                );

                if (cell) {
                    cell.classList.add("pipe-filled");
                }

                if (order === path.length - 1 && typeof onDone === "function") {
                    onDone();
                }
            }, order * step);

            this.timers.push(timer);
        });
    },

    correctMove(button) {
        if (levelSolved || levelFailed) return;

        this.solved = true;

        const puzzle = document.getElementById("pipePuzzle");
        if (puzzle) {
            puzzle.classList.add("pipe-solved");
            puzzle.classList.remove("pipe-wrong-state");
        }

        button.classList.remove("pipe-selected");
        button.classList.add("pipe-correct");

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "💧 Вода пошла!";
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message good";
            gameMessage.textContent = "Путь соединён. Вода идёт к выходу.";
        }

        this.fillPath(this.solutionPath, 120, () => {
            const receiver = document.querySelector(
                "#pipePuzzle .pipe-receiver"
            );

            if (receiver) {
                receiver.classList.add("pipe-receiver-full");
            }

            const timer = setTimeout(() => {
                if (!levelSolved && !levelFailed) {
                    solveLevel(50);
                }
            }, 420);

            this.timers.push(timer);
        });
    },

    wrongMove(button) {
        if (levelSolved || levelFailed) return;

        const puzzle = document.getElementById("pipePuzzle");
        if (puzzle) {
            puzzle.classList.add("pipe-wrong-state");
        }

        button.classList.add("pipe-wrong");

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "💧 Поток упёрся в разрыв";
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message bad";
            gameMessage.textContent = "Не эта труба. −⭐";
        }

        this.fillPath(this.preBreakPath, 90, () => {
            if (!levelSolved && !levelFailed) {
                registerWrongMove();
            }

            if (levelSolved || levelFailed) return;

            const timer = setTimeout(() => {
                this.resetAfterWrong();
            }, 650);

            this.timers.push(timer);
        });
    },

    resetAfterWrong() {
        if (levelSolved || levelFailed) return;

        const puzzle = document.getElementById("pipePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove("pipe-wrong-state", "pipe-running");

        puzzle.querySelectorAll(".pipe-cell").forEach(button => {
            const base = Number(button.dataset.baseRot) || 0;
            const rotor = button.querySelector(".pipe-rotor");

            button.classList.remove(
                "pipe-selected",
                "pipe-wrong",
                "pipe-filled",
                "pipe-correct",
                "pipe-receiver-full"
            );

            button.dataset.rot = String(base);

            if (rotor) {
                rotor.style.setProperty("--pipe-rot", base + "deg");
            }

            button.disabled =
                button.classList.contains("pipe-source") ||
                button.classList.contains("pipe-receiver");
        });

        this.selectedCell = null;
        this.locked = false;

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "⚡ Попробуй другую трубу";
        }
    },

    reset() {
        this.clearTimers();
        this.locked = false;
        this.solved = false;
        this.selectedCell = null;

        const puzzle = document.getElementById("pipePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "pipe-running",
            "pipe-wrong-state",
            "pipe-solved"
        );

        puzzle.querySelectorAll(".pipe-cell").forEach(button => {
            const base = Number(button.dataset.baseRot) || 0;
            const rotor = button.querySelector(".pipe-rotor");

            button.classList.remove(
                "pipe-selected",
                "pipe-wrong",
                "pipe-filled",
                "pipe-correct",
                "pipe-receiver-full"
            );

            button.dataset.rot = String(base);

            if (rotor) {
                rotor.style.setProperty("--pipe-rot", base + "deg");
            }

            button.disabled =
                button.classList.contains("pipe-source") ||
                button.classList.contains("pipe-receiver");
        });
    },

    stop() {
        this.clearTimers();
        this.locked = true;

        document.querySelectorAll("#pipePuzzle .pipe-cell").forEach(button => {
            button.disabled = true;
        });
    },

    clearTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
};
