// =====================================
// ONLY ONE MOVE — LEVEL 7
// TOWER ASCENT — 3 SEQUENTIAL RINGS
// =====================================

window.ONE_MOVE_LEVELS = window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[7] = {
    id: 7,
    type: "tower-ascent",

    step: 1,
    locked: false,
    solved: false,
    timers: [],

    // Correct sector for each floor. The player keeps completed floors
    // even after a mistake on a later floor.
    correctByStep: {
        1: 3,
        2: 1,
        3: 4
    },

    sectorSymbols: {
        1: ["◆","△","✦","○"],
        2: ["✦","◇","△","☽"],
        3: ["○","✦","◇","△"]
    },

    render() {
        return `
            <div id="towerPuzzle" class="tower-puzzle">
                <div class="tower-scene">
                    <div class="tower-moon"></div>
                    <div class="tower-cliff cliff-left"></div>
                    <div class="tower-cliff cliff-right"></div>

                    <div class="tower-top-gate">
                        <div class="tower-gate-glow"></div>
                        <div class="tower-gate-door">✦</div>
                        <div class="tower-gate-label">ВЫХОД</div>
                    </div>

                    <div class="tower-shaft">
                        ${[3,2,1].map(floor => this.renderFloor(floor)).join("")}

                        <div class="tower-lift" id="towerLift">
                            <div class="tower-lift-core">▲</div>
                            <div class="tower-lift-trail"></div>
                        </div>
                    </div>

                    <div class="tower-step-rail">
                        <div class="tower-step-dot active" data-step-dot="1">1</div>
                        <div class="tower-step-line" data-step-line="1"></div>
                        <div class="tower-step-dot" data-step-dot="2">2</div>
                        <div class="tower-step-line" data-step-line="2"></div>
                        <div class="tower-step-dot" data-step-dot="3">3</div>
                    </div>
                </div>

                <div class="tower-step-copy" id="towerStepCopy">
                    Ступень 1 из 3 · выбери один сегмент кольца
                </div>
            </div>
        `;
    },

    renderFloor(floor) {
        const symbols = this.sectorSymbols[floor];

        return `
            <div class="tower-floor tower-floor-${floor}" data-floor="${floor}">
                <div class="tower-floor-number">${floor}</div>

                <div class="tower-ring">
                    <div class="tower-ring-core"></div>
                    <div class="tower-ring-path path-a"></div>
                    <div class="tower-ring-path path-b"></div>

                    ${symbols.map((symbol, index) => {
                        const sector = index + 1;
                        return `
                            <button
                                type="button"
                                class="tower-sector sector-${sector}"
                                data-floor="${floor}"
                                data-sector="${sector}"
                                aria-label="Ступень ${floor}, сегмент ${sector}"
                            >
                                <span class="tower-sector-symbol">${symbol}</span>
                                <span class="tower-sector-notch"></span>
                            </button>
                        `;
                    }).join("")}

                    <div class="tower-ring-center">
                        <span>✦</span>
                    </div>
                </div>
            </div>
        `;
    },

    start() {
        this.clearTimers();

        this.step = 1;
        this.locked = false;
        this.solved = false;

        const puzzle = document.getElementById("towerPuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "tower-running",
            "tower-solved",
            "tower-wrong"
        );

        puzzle.querySelectorAll(".tower-floor").forEach(floor => {
            floor.classList.remove(
                "floor-active",
                "floor-complete",
                "floor-lifted",
                "floor-wrong"
            );
        });

        puzzle.querySelectorAll(".tower-sector").forEach(button => {
            button.disabled = true;
            button.classList.remove(
                "sector-correct",
                "sector-wrong",
                "sector-turn"
            );

            button.onclick = event => {
                event.preventDefault();

                this.chooseSector(
                    Number(button.dataset.floor),
                    Number(button.dataset.sector),
                    button
                );
            };
        });

        this.setLiftStep(0, false);
        this.activateStep(1);

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🏰 Ступень 1 из 3";
        }
    },

    activateStep(step) {
        this.step = step;
        this.locked = false;

        const puzzle = document.getElementById("towerPuzzle");
        if (!puzzle) return;

        puzzle.querySelectorAll(".tower-floor").forEach(floor => {
            const number = Number(floor.dataset.floor);
            floor.classList.toggle("floor-active", number === step);
        });

        puzzle.querySelectorAll(".tower-sector").forEach(button => {
            const floor = Number(button.dataset.floor);

            button.disabled =
                floor !== step ||
                this.solved ||
                levelSolved ||
                levelFailed;
        });

        puzzle.querySelectorAll("[data-step-dot]").forEach(dot => {
            const n = Number(dot.dataset.stepDot);
            dot.classList.toggle("active", n === step);
            dot.classList.toggle("done", n < step);
        });

        puzzle.querySelectorAll("[data-step-line]").forEach(line => {
            const n = Number(line.dataset.stepLine);
            line.classList.toggle("done", n < step);
        });

        const copy = document.getElementById("towerStepCopy");
        if (copy) {
            copy.textContent =
                `Ступень ${step} из 3 · выбери один сегмент кольца`;
        }

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent =
                `🏰 Ступень ${step} из 3`;
        }
    },

    chooseSector(floor, sector, button) {
        if (
            this.locked ||
            this.solved ||
            levelSolved ||
            levelFailed ||
            floor !== this.step
        ) {
            return;
        }

        this.locked = true;

        const puzzle = document.getElementById("towerPuzzle");
        if (puzzle) {
            puzzle.classList.add("tower-running");
        }

        button.classList.add("sector-turn");

        document.querySelectorAll(
            `#towerPuzzle .tower-sector[data-floor="${floor}"]`
        ).forEach(item => {
            item.disabled = true;
        });

        const timer = setTimeout(() => {
            if (
                sector ===
                this.correctByStep[floor]
            ) {
                this.correctStep(floor, button);
            } else {
                this.wrongStep(floor, button);
            }
        }, 360);

        this.timers.push(timer);
    },

    correctStep(floor, button) {
        if (levelSolved || levelFailed) return;

        button.classList.remove("sector-turn");
        button.classList.add("sector-correct");

        const floorEl = document.querySelector(
            `#towerPuzzle .tower-floor[data-floor="${floor}"]`
        );

        if (floorEl) {
            floorEl.classList.remove("floor-active");
            floorEl.classList.add("floor-complete");
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message good";
            gameMessage.textContent =
                `Ступень ${floor} открыта ✓`;
        }

        const riseTimer = setTimeout(() => {
            if (floorEl) {
                floorEl.classList.add("floor-lifted");
            }

            this.setLiftStep(floor, true);
        }, 280);

        this.timers.push(riseTimer);

        const nextTimer = setTimeout(() => {
            if (floor < 3) {
                this.activateStep(
                    floor + 1
                );
            } else {
                this.finishTower();
            }
        }, 920);

        this.timers.push(nextTimer);
    },

    wrongStep(floor, button) {
        if (levelSolved || levelFailed) return;

        const puzzle = document.getElementById("towerPuzzle");
        const floorEl = document.querySelector(
            `#towerPuzzle .tower-floor[data-floor="${floor}"]`
        );

        if (puzzle) {
            puzzle.classList.add("tower-wrong");
        }

        if (floorEl) {
            floorEl.classList.add("floor-wrong");
        }

        button.classList.remove("sector-turn");
        button.classList.add("sector-wrong");

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message bad";
            gameMessage.textContent =
                `Ступень ${floor}: неверный поворот. −⭐`;
        }

        // Same star mechanic as Levels 1–5.
        registerWrongMove();

        if (levelSolved || levelFailed) return;

        const timer = setTimeout(() => {
            if (puzzle) {
                puzzle.classList.remove("tower-wrong");
            }

            if (floorEl) {
                floorEl.classList.remove("floor-wrong");
            }

            document.querySelectorAll(
                `#towerPuzzle .tower-sector[data-floor="${floor}"]`
            ).forEach(item => {
                item.disabled = false;
                item.classList.remove(
                    "sector-wrong",
                    "sector-turn"
                );
            });

            // Crucial: earlier successful floors stay completed.
            this.locked = false;

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent =
                    `🏰 Ступень ${floor} из 3 · попробуй снова`;
            }
        }, 720);

        this.timers.push(timer);
    },

    setLiftStep(step, animate = true) {
        const lift = document.getElementById("towerLift");
        if (!lift) return;

        lift.style.transition =
            animate
                ? "bottom .62s cubic-bezier(.22,.85,.25,1), transform .62s ease"
                : "none";

        const positions = {
            0: "4%",
            1: "32%",
            2: "60%",
            3: "86%"
        };

        lift.style.bottom =
            positions[step] || "4%";

        lift.dataset.step = String(step);
    },

    finishTower() {
        if (this.solved || levelSolved || levelFailed) return;

        this.solved = true;

        const puzzle = document.getElementById("towerPuzzle");
        if (puzzle) {
            puzzle.classList.remove("tower-running");
            puzzle.classList.add("tower-solved");
        }

        document.querySelectorAll("#towerPuzzle .tower-sector")
            .forEach(button => {
                button.disabled = true;
            });

        document.querySelectorAll("[data-step-dot]")
            .forEach(dot => {
                dot.classList.remove("active");
                dot.classList.add("done");
            });

        document.querySelectorAll("[data-step-line]")
            .forEach(line => {
                line.classList.add("done");
            });

        const copy = document.getElementById("towerStepCopy");
        if (copy) {
            copy.textContent =
                "Все 3 ступени подняты · выход открыт";
        }

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent =
                "✓ Башня пройдена";
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message good";
            gameMessage.textContent =
                "Верхние ворота открыты!";
        }

        const timer = setTimeout(() => {
            if (!levelSolved && !levelFailed) {
                solveLevel(50);
            }
        }, 1150);

        this.timers.push(timer);
    },

    reset() {
        this.start();
    },

    stop() {
        this.clearTimers();
        this.locked = true;

        document.querySelectorAll("#towerPuzzle .tower-sector")
            .forEach(button => {
                button.disabled = true;
            });
    },

    clearTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
};
