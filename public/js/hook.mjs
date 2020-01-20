import { writingHelper } from './typeHelper.mjs';
let language = null;

const addLanguageCheckingList = () => {
    const languages = ['de', 'el', 'en', 'es', 'fr', 'id', 'it', 'ja', 'zh']
    const listWrapper = document.createElement('div');
    listWrapper.className = 'listWrapper';
    languages.forEach(lang => {
        const langLabel = document.createElement('label');
        langLabel.className = 'listItems';
        langLabel.classList.add('check-container');

        const langSwitch = document.createElement('input');
        langSwitch.className = 'langSwitch';
        langSwitch.name = 'lang';
        langSwitch.type = 'radio';
        if (lang == 'en') langSwitch.checked;

        const langCode = document.createElement('input');
        langCode.className = 'langCode';
        langCode.type = 'hidden';
        langCode.value = lang;

        const mark = document.createElement('span');
        mark.className = 'checkmark';

        langLabel.appendChild(langSwitch);
        langLabel.appendChild(langCode);
        langLabel.appendChild(mark);

        listWrapper.appendChild(langLabel);
    });
    return listWrapper;
};

$(document).ready(function () {
    // const elements = $('.writingHelper');
    // document.getElementsByClassName('writingHelper');
    // let elementsArr = Array.from(elements);
    const buttonPosLeft = $('#changeLanguage_btn').offset().left;
    const buttonPosTop = $('#changeLanguage_btn').offset().top;
    const langList = addLanguageCheckingList();
    $(langList).css({
        'left': buttonPosLeft, 
        'top': buttonPosTop
    });
    $('#changeLanguage_btn').on('click', event => {
        // const classCheck = $(langList).hasClass('listWrapper_off');
        $(langList).toggleClass('listWrapper_off');
        $(langList).toggleClass('listWrapper_on');
    });
    language = $('.langSwitch:checked + .langCode').val();
    console.log(language);
    $('.writingHelper').each(function (index, object) {
        // elementsArr.forEach(element => {
        const element = $(this);

        element.parent().css({ 'display': 'flex', 'flex-flow': 'column', 'width': 'inherit', 'position': 'relative', 'margin-left': '20px' });

        const getHelperDiv = () => {
            return $('.helperDiv')[0] || null;
        };

        const eventHandler = event => {
            console.log('input event');
            if (language != 'en') {
                writingHelper(element, language);
                return;
            }
        };

        const keyDownEventHandler = event => {
            // if (event.which == 32) {
            //     const div = getHelperDiv();
            //     if (div) {
            //         event.preventDefault();
            //     }
            // }
        }

        const run = () => {
            // console.log(event.which);
            if (language != 'en') {
                writingHelper(element, language);
            }
        };

        const arrowKeyEventHandler = event => {
            const div = getHelperDiv();
            if (div) {
                if (
                    event.which == 37 ||
                    event.which == 39
                ) {
                    run();
                }
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

        const spaceKeyUpEventHandler = event => {
            if (language == 'zh') {
                run();
            }
        };

        element.on('click', eventHandler);
        element.on('keydown', keyDownEventHandler);
        element.on('keyup', (event) => {
            if (
                event.which == 37 ||
                event.which == 38 ||
                event.which == 39 ||
                event.which == 40
            ) {
                arrowKeyEventHandler(event);
            }
            if (event.which == 32) {
                spaceKeyUpEventHandler(event);
            }
        });
        element.on('input', eventHandler);
    });

    $('.tempLangSwitch-1').on('change', event => {
        language = $('.tempLangSwitch-1:checked + .langCode').val();
        console.log(language);
    });
});
