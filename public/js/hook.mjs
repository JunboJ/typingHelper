import { getCursorXY } from './typeHelper.mjs';

const elements = document.getElementsByClassName('writingHelper');
let elementsArr = Array.from(elements);

elementsArr.forEach(element => {
    console.log(element);
    element.parentElement.style.display = 'flex';
    element.parentElement.style.flexFlow = 'column';
    element.parentElement.style.width = 'inherit';

    const getHelperDiv = () => {
        return document.getElementsByClassName('helperDiv')[0] ? document.getElementsByClassName('helperDiv')[0] : null;
    }
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
        if (event.which == 27) {
            const div = getHelperDiv();
            if (div) document.body.removeChild(div);
        }
    }
    element.addEventListener('mouseup', eventHandler);
    element.addEventListener('input', eventHandler);
    element.addEventListener('keyup', arrowKeyEventHandler);
});

const writingHelper = (element) => {
    getCursorXY(element);
}