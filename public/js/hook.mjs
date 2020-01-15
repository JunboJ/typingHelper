import { writingHelper } from './typeHelper.mjs';
let language = null;
$(document).ready(function () {
    // const elements = $('.writingHelper');
    // document.getElementsByClassName('writingHelper');
    // let elementsArr = Array.from(elements);

    language = $('.tempLangSwitch-1:checked + .langCode').val();
    console.log(language);
    $('.writingHelper').each(function (index, object) {
        // elementsArr.forEach(element => {
        const element = $(this);

        element.parent().css({ 'display': 'flex', 'flex-flow': 'column', 'width': 'inherit', 'position': 'relative', 'margin-left': '20px' });

        const getHelperDiv = () => {
            return $('.helperDiv')[0] || null;
        };

        const eventHandler = event => {
            if (language != 'en') {
                writingHelper(element, language);
            }
        };

        const keyDownEventHandler = event => {
            if (event.which == 32) {
                const div = getHelperDiv();
                if (div) {
                    event.preventDefault();
                }
            }
        }

        const arrowKeyEventHandler = event => {
            const div = getHelperDiv();
            const run = () => {
                console.log(event.which);
                if (language != 'en') {
                    writingHelper(element, language);
                }
            };
            if (div) {
                // if (
                //     event.which == 37 ||
                //     event.which == 39
                // ) {
                //     run();
                // }
            } else {
                if (
                    event.which == 37 ||
                    event.which == 38 ||
                    event.which == 39 ||
                    event.which == 40
                ) {
                    run();
                }
            }
            if (event.which == 27) {
                if (div) div.remove();
            }
        };

        element.on('click', eventHandler);
        element.on('keydown', keyDownEventHandler);
        element.on('input', eventHandler);
        element.on('keyup', arrowKeyEventHandler);
    });

    $('.tempLangSwitch-1').on('change', event => {
        language = $('.tempLangSwitch-1:checked + .langCode').val();
        console.log(language);
    });
});
