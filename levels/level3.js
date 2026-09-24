// =====================================
// ONLY ONE MOVE — LEVEL 3
// LASER LABYRINTH — RESPONSIVE HITBOXES
// =====================================

window.ONE_MOVE_LEVELS = window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[3] = {
    id: 3,
    type: "laser",

    locked: false,
    solved: false,
    selectedMirror: null,
    resetTimer: null,

    // сохраняем прежнее правильное зеркало
    correctMirror: 13,

    mirrors: [
        {id:1,  x:18, y:15, rot:-45},
        {id:2,  x:38, y:14, rot:45},
        {id:3,  x:63, y:15, rot:-45},
        {id:4,  x:85, y:20, rot:45},
        {id:5,  x:24, y:35, rot:-45},
        {id:6,  x:44, y:32, rot:45},
        {id:7,  x:70, y:36, rot:45},
        {id:8,  x:86, y:45, rot:-45},
        {id:9,  x:16, y:52, rot:45},
        {id:10, x:38, y:53, rot:-45},
        {id:11, x:63, y:53, rot:45},
        {id:12, x:83, y:66, rot:-45},
        {id:13, x:39, y:79, rot:-45},
        {id:14, x:84, y:83, rot:45},
        {id:15, x:22, y:93, rot:-45},
        {id:16, x:70, y:92, rot:45}
    ],

    blocks: [
        {x:25, y:24, w:13, h:4, rot:12},
        {x:48, y:43, w:13, h:4, rot:-18},
        {x:82, y:33, w:4, h:14, rot:-12},
        {x:18, y:67, w:4, h:15, rot:9},
        {x:75, y:65, w:13, h:4, rot:16},
        {x:51, y:84, w:4, h:14, rot:-8}
    ],

    render() {
        return `
        <div id="laserPuzzle" class="puzzle-container">
            <div class="laser-board" id="laserBoard">
                <div class="laser-grid"></div>

                <div class="laser-source">
                    <div class="laser-source-core"></div>
                </div>

                <div class="laser-target">
                    <div class="laser-target-ring ring-1"></div>
                    <div class="laser-target-ring ring-2"></div>
                    <div class="laser-target-core"></div>
                </div>

                ${this.blocks.map((b,i)=>`
                    <div
                        class="laser-block"
                        data-block="${i+1}"
                        style="
                            left:${b.x}%;
                            top:${b.y}%;
                            width:${b.w}%;
                            height:${b.h}%;
                            --block-rot:${b.rot}deg;
                        "
                    ></div>
                `).join("")}

                <svg class="laser-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polyline class="laser-path-glow" id="laserPathGlow" points="8,52 28,50 43,39 63,48 76,58 78,66"></polyline>
                    <polyline class="laser-path-main" id="laserPathMain" points="8,52 28,50 43,39 63,48 76,58 78,66"></polyline>
                    <polyline class="laser-path-final" id="laserPathFinal" points=""></polyline>
                </svg>

                ${this.mirrors.map(m=>`
                    <button
                        type="button"
                        class="laser-mirror"
                        data-mirror="${m.id}"
                        aria-label="Зеркало ${m.id}"
                        style="left:${m.x}%; top:${m.y}%; --mirror-rot:${m.rot}deg;"
                    >
                        <span class="mirror-glass"></span>
                        <span class="mirror-led"></span>
                    </button>
                `).join("")}
            </div>
        </div>`;
    },

    start() {
        this.clearResetTimer();
        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;

        const puzzle = document.getElementById("laserPuzzle");
        if (!puzzle) return;

        puzzle.classList.remove("laser-solved","laser-wrong");

        this.setFinalPath([]);

        puzzle.querySelectorAll(".laser-mirror").forEach(button => {
            const id = Number(button.dataset.mirror);
            const data = this.mirrors.find(m => m.id === id);
            button.disabled = false;
            button.classList.remove("mirror-turning","mirror-wrong","mirror-correct");
            if (data) button.style.setProperty("--mirror-rot", data.rot + "deg");

            button.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.rotateMirror(button,id);
            };
        });
    },

    rotateMirror(button, mirrorNumber) {
        if (this.locked || this.solved || levelSolved || levelFailed) return;

        this.locked = true;
        this.selectedMirror = mirrorNumber;

        const data = this.mirrors.find(m => m.id === mirrorNumber);
        const startRot = data ? data.rot : 0;

        button.classList.add("mirror-turning");
        button.style.setProperty("--mirror-rot", (startRot + 90) + "deg");

        document.querySelectorAll("#laserPuzzle .laser-mirror").forEach(item => {
            item.disabled = true;
        });

        if (mirrorNumber === this.correctMirror) {
            setTimeout(() => this.correctMove(button), 300);
            return;
        }

        setTimeout(() => this.wrongMove(button,mirrorNumber), 300);
    },

    wrongMove(button, mirrorNumber) {
        const puzzle = document.getElementById("laserPuzzle");
        if (!puzzle) return;

        puzzle.classList.add("laser-wrong");
        button.classList.add("mirror-wrong");

        const target = this.mirrors.find(m => m.id === mirrorNumber);
        const tx = target ? target.x : 50;
        const ty = target ? target.y : 50;

        // ложный луч всегда заканчивается прямо на выбранном зеркале
        this.setFinalPath([
            [78,66],
            [tx,ty],
            [Math.min(96,tx+8),Math.max(4,ty-10)]
        ]);

        gameMessage.className = "message bad";
        gameMessage.textContent = "Луч ушёл по ложному маршруту. −⭐";

        setTimeout(() => {
            registerWrongMove();

            if (!levelSolved && !levelFailed) {
                this.resetAfterWrong();
            }
        },700);
    },

    resetAfterWrong() {
        const puzzle = document.getElementById("laserPuzzle");
        if (!puzzle) return;

        puzzle.classList.remove("laser-wrong");
        this.setFinalPath([]);

        puzzle.querySelectorAll(".laser-mirror").forEach(button => {
            const id = Number(button.dataset.mirror);
            const data = this.mirrors.find(m => m.id === id);
            button.disabled = false;
            button.classList.remove("mirror-turning","mirror-wrong","mirror-correct");
            if (data) button.style.setProperty("--mirror-rot", data.rot + "deg");
        });

        this.locked = false;
        this.selectedMirror = null;
    },

    correctMove(button) {
        const puzzle = document.getElementById("laserPuzzle");
        if (!puzzle) return;

        this.solved = true;
        puzzle.classList.add("laser-solved");

        button.classList.remove("mirror-turning");
        button.classList.add("mirror-correct");

        // от правильного зеркала №13 к цели
        this.setFinalPath([
            [78,66],
            [39,79],
            [61,84],
            [77,88],
            [88,88]
        ]);

        puzzle.querySelectorAll(".laser-mirror").forEach(item => {
            item.disabled = true;
        });

        movesText.textContent = "✓ Лазер направлен";
        gameMessage.className = "message good";
        gameMessage.textContent = "Есть! Луч попал в цель 🔴";

        setTimeout(() => {
            if (!levelSolved && !levelFailed) solveLevel(35);
        },1200);
    },

    setFinalPath(points) {
        const poly = document.getElementById("laserPathFinal");
        if (!poly) return;
        poly.setAttribute("points", points.map(p => p.join(",")).join(" "));
    },

    reset() {
        this.clearResetTimer();
        this.locked = false;
        this.solved = false;
        this.selectedMirror = null;

        const puzzle = document.getElementById("laserPuzzle");
        if (!puzzle) return;

        puzzle.classList.remove("laser-solved","laser-wrong");
        this.setFinalPath([]);

        puzzle.querySelectorAll(".laser-mirror").forEach(button => {
            const id = Number(button.dataset.mirror);
            const data = this.mirrors.find(m => m.id === id);
            button.disabled = false;
            button.classList.remove("mirror-turning","mirror-wrong","mirror-correct");
            if (data) button.style.setProperty("--mirror-rot", data.rot + "deg");
        });
    },

    stop() {
        this.clearResetTimer();
        this.locked = true;
        document.querySelectorAll("#laserPuzzle .laser-mirror").forEach(button => {
            button.disabled = true;
        });
    },

    clearResetTimer() {
        if (this.resetTimer) {
            clearTimeout(this.resetTimer);
            this.resetTimer = null;
        }
    }
};
