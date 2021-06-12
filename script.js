const matrixEl = document.querySelector("#matrix");
const matrixElCopy = matrixEl.cloneNode(true);
const resetButton = document.querySelector("#reset");
const findCycleButton = document.querySelector("#findCycle");
const findCycleButton2 = document.querySelector("#findCycle2");
const addDimensionButton = document.querySelector("#addDimension");
const removeDimensionButton = document.querySelector("#removeDimension");
const weightEl = document.querySelector("#weight");
const CycleEl = document.querySelector("#cycle");
let matrix = [];

// METODY POBIERAJĄCE I PRZYGOTOWUJĄCE GRAF Z MACIERZY
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

    let row = document.createElement("div");
    row.setAttribute("class", "matrixRow");

    Array.from(matrixChildren).forEach((el) => {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        el.appendChild(input);

        const inp = document.createElement("input");
        inp.setAttribute("type", "text");
        row.appendChild(inp);
    });

    const inp = document.createElement("input");
    inp.setAttribute("type", "text");
    row.appendChild(inp);

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

// DLA ALGORYTMU 1
findCycleButton.addEventListener("click", () => {
    convertMatrix();
    FindCycle1();
});

// Dla ALGORYTMU 2
findCycleButton2.addEventListener("click", () => {
    convertMatrix();
    FindCycle2();
});

//
//  ALGORYTM 1 - WYSZUKUJE PO ILOŚCI WIERZCHOŁKÓW
//

function FindCycle1() {
    pre = Array.from({ length: matrix.length }, (i) => (i = -1));
    post = Array.from({ length: matrix.length }, (i) => (i = -1));

    DFS(matrix, pre, post);
    console.log(pre);
    console.log(post);
    // KRAWĘDZIE POWROTNE
    backEdges = FindBackEdges(pre, post, matrix);
    console.log(backEdges);

    // ŚCIEŻKI DO PODANYCH WIERZCHOŁKÓW Z KRAWĘDZI POWROTNYCH
    paths = [];

    for (let i = 0; i < backEdges.length; i++) {
        start = backEdges[i][1];
        end = backEdges[i][0];
        // URUCHOMIENIE ALGORYTMU ZNAJDUJĄCEGO NAJKRÓTSZĄ ŚCIEŻKĘ DLA KAŻDEJ KRAWĘDZI POWROTNEJ
        path = FindShortestPath(start, end, matrix);

        v = end;
        // ZMIENNA PRZETRZYMUJĄCA UPORZĄDKOWANĄ DROGĘ
        transformedPath = [];
        // ŚCIEŻKĘ TRZEBA ODCZYTYWAĆ WSPAK
        while (v > -1) {
            transformedPath.unshift(v);
            v = path[v];
        }
        paths.push(transformedPath);
    }
    console.log(paths);
    shortestCycle = null;
    if (paths.length > 0) {
        // ZNALEZIENIE NAJKRÓTSZEGO CYKLU PORÓWNUJĄC DŁUGOŚCI TABLIC ŚCIEŻEK
        shortestCycle = paths.reduce((prev, next) =>
            prev.length > next.length ? next : prev
        );
    }
    console.log(shortestCycle);

    // WYŚWIETLENIE WYNIKU
    nodesCount = 0;
    cycle = "brak";

    if (shortestCycle != null) {
        nodesCount = shortestCycle.length;
        cycle = shortestCycle.join("-");
    }
    weightEl.innerHTML = `Ilość wierzchołków: ${nodesCount}`;
    CycleEl.innerHTML = `Cykl: ${cycle}${
        shortestCycle != null ? `-${shortestCycle[0]}` : ""
    }`;
}

function DFS(matrix, pre, post) {
    // INICJALIZACJA TABLICY ODWIEDZONE
    visited = Array.from({ length: matrix.length }, (i) => (i = false));
    licznik = 1;

    for (let i = 0; i < matrix.length; i++) {
        if (!visited[i]) Explore(i, pre, post);
    }

    function Explore(v, pre, post) {
        visited[v] = true;

        pre[v] = licznik;
        licznik += 1;

        for (let i = 0; i < matrix[v].length; i++) {
            if (!visited[i] && matrix[v][i] != 0) Explore(i, pre, post);
        }
        post[v] = licznik;
        licznik += 1;
    }
}

// ALGORYTM ZNAJDUJE KRAWĘDZIE POWROTNE (OPARTY O ALGORYTM BFS)
function FindBackEdges(pre, post, matrix) {
    // INICJALIZACJA TABLICY ODWIEDZONE
    visited = Array.from({ length: matrix.length }, (i) => (i = false));
    // TABLICA KRAWĘDZI POWROTNYCH
    backEdges = [];
    queue = [];
    queue.push(0);
    visited[0] = true;

    while (queue.length != 0) {
        v = queue.shift();
        for (let i = 0; i < matrix[v].length; i++) {
            if (!visited[i] && matrix[v][i] != 0) {
                queue.push(i);
                visited[i] = true;
            }
            // SPRAWDZENIE CZY JEST KRAWĘDZIĄ POWROTNĄ
            if (
                matrix[v][i] != 0 &&
                pre[i] < pre[v] &&
                pre[v] < post[v] &&
                post[v] < post[i]
            ) {
                tmp = [v, i];
                backEdges.push(tmp);
            }
        }
    }
    return backEdges;
}

// ALGORYTM ZNAJDUJE NAJKRÓTSZĄ ŚCIEŻKĘ POMIĘDZY PODANYMI WIERZCHOŁKAMI - OPARTY O BFS
function FindShortestPath(start, end, matrix) {
    // INICJALIZACJA TABLICY ODWIEDZONE
    visited = Array.from({ length: matrix.length }, (i) => (i = false));
    // INICJALIZACJA ŚCIEŻKI POWROTNEJ - ELEMENT POD DANYM INDEKSEM WSKAZUJE NA WIERZCHOŁEK Z KTÓREGO DOJDZIEMY NA PODANY INDEKS(WIERZCHOŁEK)
    path = Array.from({ length: matrix.length }, (i) => (i = -1));
    queue = [];
    queue.push(start);
    visited[start] = true;

    while (queue.length != 0) {
        v = queue.shift();
        if (v != end) {
            for (let i = 0; i < matrix[v].length; i++) {
                if (!visited[i] && matrix[v][i] != 0) {
                    path[i] = v;
                    queue.push(i);
                    visited[i] = true;
                }
            }
        } else {
            break;
        }
    }
    return path;
}

//
//  ALGORYTM 2 - WYSZUKUJE PO SUMIE WAG
//

function FindCycle2() {
    // CZĘŚĆ I ALGORYTMU

    if (matrix.length == 1) {
        alert("Dodaj kolejne wierzchołki");
        return;
    }

    // CZĘŚĆ I ALGORYTMU
    var start = 0;
    MacierzAlgorytmiczna = new Array(matrix.length);

    // Generuję (będzie) trój-wymiarową tablicę gdzie będą wszystkie elementy cyklu
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

        // szukam min
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
    document.getElementById("weight").innerHTML =
        "Waga: " + `${mini == Number.MAX_VALUE ? 0 : mini}`;
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
