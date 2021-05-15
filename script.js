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
});

//
//
// ALGORYTM ALGORYTM ALGORYTM
//
//
