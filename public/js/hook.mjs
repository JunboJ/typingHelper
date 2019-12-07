import { getCursorXY } from './typeHelper.mjs';

$(document).ready(function () {
    // const elements = $('.writingHelper');
    // document.getElementsByClassName('writingHelper');
    // let elementsArr = Array.from(elements);
    const writingHelper = (element) => {
        getCursorXY(element);
    }

    $('.writingHelper').each(function (index, object) {
        // elementsArr.forEach(element => {
        const element = $(this);
        console.log(element[0]);
        
        element.parent().css({ 'display': 'flex', 'flex-flow': 'column', 'width': 'inherit' });
        // element.parentElement.style.display = 'flex';
        // element.parentElement.style.flexFlow = 'column';
        // element.parentElement.style.width = 'inherit';
        
        const getHelperDiv = () => {
            return $('.helperDiv')[0] || null;
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
                console.log('key 27');
                const div = getHelperDiv();
                if (div) div.remove();
            }
        }

        element.on('click', eventHandler);
        element.on('input', eventHandler);
        element.on('keyup', arrowKeyEventHandler);
    });
});