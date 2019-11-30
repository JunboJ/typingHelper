import { getCursorXY } from './typeHelper.mjs';

const elements = document.getElementsByClassName('writingHelper');
let elementsArr = Array.from(elements);

elementsArr.forEach(element => {
    console.log(element);
    element.parentElement.style.display = 'flex';
    element.parentElement.style.flexFlow = 'column';
    element.parentElement.style.width = 'inherit';
    const eventHandler = event => {
        writingHelper(element);
    }
    const arrowKeyEventHandler = event => {
        // console.log(event.which);
        if (
            event.which == 37 ||
            event.which == 38 ||
            event.which == 39 ||
            event.which == 40
        ) {
            writingHelper(element);
        }
    }
    element.addEventListener('mouseup', eventHandler);
    element.addEventListener('input', eventHandler);
    element.addEventListener('keyup', arrowKeyEventHandler);
});

const writingHelper = (element, ) => {
    getCursorXY(element);
}