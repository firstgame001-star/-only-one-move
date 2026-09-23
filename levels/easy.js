// =====================================
// ONLY ONE MOVE — EASY LEVELS
// LEVELS 1–15
// =====================================

const easyLevels = {

    1: {
        id: 1,
        type: "matchsticks",

        title: "Передвинь одну спичку",

        subtitle:
            "Сделай равенство правильным. У тебя только один ход.",

        instruction:
            "Зажми и перетащи одну спичку",

        thinkTime: 20,

        reward: 30,

        hintPrice: 50,

        hint:
            "Знак «+» необязательно должен остаться плюсом."
    },


    2: {
        id: 2,
        type: "move-object",

        title: "Всего один ход",

        subtitle:
            "Передвинь один объект, чтобы выполнить условие.",

        instruction:
            "Можно передвинуть только один объект",

        thinkTime: 20,

        reward: 30,

        hintPrice: 50,

        hint:
            "Не всё обязательно должно оставаться там, где находится сейчас."
    },


    3: {
        id: 3,
        type: "find-error",

        title: "Что здесь не так?",

        subtitle:
            "Найди ошибку. У тебя только одна попытка за ход.",

        instruction:
            "Нажми на то, что кажется неправильным",

        thinkTime: 20,

        reward: 35,

        hintPrice: 50,

        hint:
            "Смотри не только на центр экрана."
    },


    4: {
        id: 4,
        type: "matchsticks",

        title: "Снова спички",

        subtitle:
            "Передвинь одну спичку и исправь равенство.",

        instruction:
            "Разрешён только один ход",

        thinkTime: 20,

        reward: 40,

        hintPrice: 75,

        hint:
            "Иногда нужно изменить не число, а знак."
    },


    5: {
        id: 5,
        type: "pipes",

        title: "Соедини путь",

        subtitle:
            "Поверни только одну деталь, чтобы соединить трубы.",

        instruction:
            "Можно повернуть только одну трубу",

        thinkTime: 20,

        reward: 50,

        hintPrice: 75,

        hint:
            "Найди единственный разрыв в пути."
    }

};


// =====================================
// GET LEVEL
// =====================================

function getLevelData(levelNumber) {

    return easyLevels[levelNumber] || null;

}


// =====================================
// LEVEL EXISTS?
// =====================================

function levelExists(levelNumber) {

    return Boolean(
        easyLevels[levelNumber]
    );

}
