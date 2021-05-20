const matrixEl = document.querySelector("#matrix");
const matrixElCopy = matrixEl.cloneNode(true);
const resetButton = document.querySelector("#reset");
const findCycleButton = document.querySelector("#findCycle");
const addDimensionButton = document.querySelector("#addDimension");
const removeDimensionButton = document.querySelector("#removeDimension");
const weightEl = document.querySelector("#weight");
const CycleEl = document.querySelector("#cycle");
let matrix = [];

function reset() {
    matrixEl.innerHTML = "";
    for (let i = 0; i < matrixElCopy.children.length; i++) {
        matrixEl.appendChild(matrixElCopy.children[i].cloneNode(true));
    }

    matrix = [];
    weightEl.innerHTML = "Waga:";
    CycleEl.innerHTML = "Cykl:";
}

function AddDimension() {
    const matrixChildren = matrixEl.children;

    Array.from(matrixChildren).forEach((el) => {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        el.appendChild(input);
    });

    const row = matrixChildren[0].cloneNode(true);
    matrixEl.appendChild(row);
}

function removeDimension() {
    const matrixChildren = matrixEl.children;
    if (matrixChildren.length < 2) return;

    matrixEl.removeChild(matrixEl.lastElementChild);

    Array.from(matrixChildren).forEach((el) => {
        el.removeChild(el.lastElementChild);
    });
}

function convertMatrix() {
    const matrixChildren = matrixEl.children;
    matrix = [];

    for (let i = 0; i < matrixChildren.length; i++) {
        let matrixRow = [];
        const tmp = matrixChildren[i].children;
        for (let j = 0; j < tmp.length; j++) {
            const num = Number(tmp[j].value);
            if (isNaN(num)) {
                alert("Nieprawidłowy znak");
                return;
            }
            matrixRow.push(num);
        }
        matrix.push(matrixRow);
    }
}

resetButton.addEventListener("click", () => {
    reset();
});

addDimensionButton.addEventListener("click", () => {
    AddDimension();
});

removeDimensionButton.addEventListener("click", () => {
    removeDimension();
});

findCycleButton.addEventListener("click", () => {
    convertMatrix();
    FindCycle();
});

//
//
// ALGORYTM ALGORYTM ALGORYTM

function FindCycle() {
    // CZĘŚĆ I ALGORYTMU

    var start = 0;
    MacierzAlgorytmiczna = new Array(matrix.length);

    // Generuję (będzie) dwu-wymiarową tablicę gdzie będą wszystkie elementy cyklu
    var ElementyDrogi = new Array(matrix.length);
    for (i = 0; i < ElementyDrogi.length; i++) {
        ElementyDrogi[i] = new Array(matrix.length);
        for (z = 0; z < ElementyDrogi[i].length; z++) {
            ElementyDrogi[i][z] = new Array();
        }
    }

    // początek pętli;
    while (start < matrix.length) {
        Dlugosci = [];
        Poprzednicy = [];
        Macierz = [];
        S = [];

        if (Dlugosci.length > 0) Dlugosci = Dlugosci.fill(0);
        else var Dlugosci = new Array(matrix.length);
        if (Poprzednicy.length > 0) Poprzednicy = Poprzednicy.fill(0);
        else var Poprzednicy = new Array(matrix.length);

        if (Macierz.length > 0) {
            for (i = 0; i < matrix.length; i++) {
                Macierz[i] = new Array(matrix[i].length);
                for (j = 0; j < matrix[i].length; j++) {
                    Macierz[i][j] = matrix[i][j];
                }
            }
        } else {
            Macierz = new Array(matrix.length);
            for (i = 0; i < matrix.length; i++) {
                Macierz[i] = new Array(matrix[i].length);
                for (j = 0; j < matrix[i].length; j++) {
                    Macierz[i][j] = matrix[i][j];
                }
            }
        }

        var Oryginalna_Dl = Macierz.length;
        var Minimalny = 0;
        var w = 0;

        for (i = 0; i < Macierz.length; i++) {
            Dlugosci[i] = Number.MAX_VALUE;
            Poprzednicy[i] = -1;
        }

        Dlugosci[start] = 0;

        if (S.length > 0) S = S.fill(0);
        else var S = new Array(Macierz.length);

        Licznik = Macierz.length;
        while (Licznik > 1) {
            Minimalny = Number.MAX_VALUE;
            w = 0;

            for (i = 0; i < Oryginalna_Dl; i++) {
                if (Minimalny > Dlugosci[i]) {
                    if (S[i] != 1) {
                        Minimalny = Dlugosci[i];
                        w = i;
                    }
                }
            }
            for (i = 0; i < Macierz[w].length; i++) {
                if (Macierz[w][i] != 0) {
                    if (
                        Dlugosci[i] > Number(Minimalny + Number(Macierz[w][i]))
                    ) {
                        if (w == start) {
                            ElementyDrogi[start][i].push(w);
                            ElementyDrogi[start][i].push(i);
                        } else {
                            if (ElementyDrogi[start][i].length > 0) {
                                ElementyDrogi[start][i] = [];
                                for (
                                    z = 0;
                                    z < ElementyDrogi[start][w].length;
                                    z++
                                ) {
                                    ElementyDrogi[start][i].push(
                                        ElementyDrogi[start][w][z]
                                    );
                                }
                                ElementyDrogi[start][i].push(i);
                            } else {
                                for (
                                    z = 0;
                                    z < ElementyDrogi[start][w].length;
                                    z++
                                ) {
                                    ElementyDrogi[start][i].push(
                                        ElementyDrogi[start][w][z]
                                    );
                                }
                                ElementyDrogi[start][i].push(i);
                            }
                        }
                        Dlugosci[i] = Number(Minimalny) + Number(Macierz[w][i]);
                        Poprzednicy[i] = w;
                    }
                }
            }
            S[w] = 1;
            for (i = 0; i < Macierz.length; i++) {
                for (j = 0; j < Macierz[i].length; j++) {
                    if (j == w) Macierz[i][j] = 0;
                }
            }
            Licznik--;
        }

        // uzupełniam macierz algorytmiczną
        MacierzAlgorytmiczna[start] = new Array(Dlugosci.length);

        for (j = 0; j < Dlugosci.length; j++) {
            MacierzAlgorytmiczna[start][j] = Dlugosci[j];
        }
        start++;
    }
    // KONIEC CZĘŚCI I ALGORYTMU

    // II CZĘŚĆ
    start = 0;
    var mini = Number.MAX_VALUE;
    pamY = 0;
    pamX = 0;

    while (start < matrix.length) {
        var Min = Number.MAX_VALUE;
        Length = 0;

        // szukam mina
        for (j = 0; j < MacierzAlgorytmiczna[start].length; j++) {
            if (MacierzAlgorytmiczna[start][j] != 0) {
                Length =
                    MacierzAlgorytmiczna[start][j] +
                    MacierzAlgorytmiczna[j][start];
                if (Length < mini) {
                    mini = Length;
                    pamY = start;
                    pamX = j;
                }
            }
        }
        start++;
    }

    if (
        ElementyDrogi[pamY][pamX].length == 0 &&
        ElementyDrogi[pamX][pamY].length == 0
    ) {
        alert("Brak cyklu");
        return;
    }

    document.getElementById("weight").innerHTML = "Waga: " + mini;
    document.getElementById("cycle").innerHTML = "Cykl: ";
    for (i = 0; i < ElementyDrogi[pamY][pamX].length; i++) {
        document.getElementById("cycle").innerHTML +=
            ElementyDrogi[pamY][pamX][i] + "-";
    }
    for (
        i = 1;
        i < ElementyDrogi[pamX][pamY].length;
        i++ // i = 1 jest zrobione celowo, by było poprawnie
    ) {
        if (i + 1 == ElementyDrogi[pamX][pamY].length)
            document.getElementById("cycle").innerHTML +=
                ElementyDrogi[pamX][pamY][i];
        else
            document.getElementById("cycle").innerHTML +=
                ElementyDrogi[pamX][pamY][i] + "-";
    }
}
