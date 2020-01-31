import { writingHelper } from './typeHelper.mjs';
let language = null;

const addLanguageCheckingList = textInput => {
    const languages = { 'de': 'German', 'el': 'Greek', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese', 'zh': 'Chinese' }
    const listWrapper = document.createElement('div');
    listWrapper.className = 'listWrapper';
    Object.keys(languages).map(code => {
        const langLabel = document.createElement('label');
        langLabel.className = 'listItems';
        langLabel.classList.add('check-container');
        $(langLabel).css({ 'height': '1rem', 'margin': '0.5rem', });
        langLabel.innerText = languages[code];

        const langSwitch = document.createElement('input');
        langSwitch.className = 'langSwitch';
        langSwitch.name = 'lang';
        langSwitch.type = 'radio';
        if (code === 'en') langSwitch.checked = true;
        $(langSwitch).on('click', () => {
            setTimeout(() => {
                $(listWrapper).toggleClass('listWrapper_off');
                $(listWrapper).toggleClass('listWrapper_on');
            }, 50);
        });

        const langCode = document.createElement('input');
        langCode.className = 'langCode';
        langCode.type = 'hidden';
        langCode.value = code;

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
    const buttonPosLeft = $('#changeLanguage_btn').offset().left;
    const buttonPosTop = $('#changeLanguage_btn').offset().top;
    const buttonWidth = $('#changeLanguage_btn').width();
    const buttonHeight = $('#changeLanguage_btn').height();
    const langList = addLanguageCheckingList();
    $(langList).addClass('listWrapper_off');
    const langListWidth = $(langList).width();
    const langListHeight = $(langList).height();
    console.log(langListHeight);
    // const buttonLeft = Math.floor(buttonWidth - langListWidth);
    const buttonTop = Math.floor(buttonPosTop - 300 - 5);

    $(langList).css({
        'left': buttonPosLeft - 11,
        'top': buttonTop
    });
    $(langList).addClass('listWrapper_off');
    document.body.appendChild(langList);
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

        element.parent().css({ 'display': 'flex', 'flex-flow': 'column', 'width': '100%', 'position': 'relative' });

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

        element.on('click', eventHandler);
        element.on('keyup', (event) => {
            if (
                event.which == 37 ||
                event.which == 38 ||
                event.which == 39 ||
                event.which == 40
            ) {
                arrowKeyEventHandler(event);
            }
        });
        element.on('input', eventHandler);
    });

    $('.langSwitch').on('change', event => {
        language = $('.langSwitch:checked + .langCode').val();
        // const inputElList = document.querySelectorAll('.writingHelper');
        // for (const inputEl of inputElList) {
        //     if (language == 'ja') {
        //         wanakana.bind(inputEl);
        //         console.log('bind');
        //     } else {
        //         try {
        //             wanakana.unbind(inputEl);
        //             console.log('unbind');
        //         } catch (error) {
        //             return;
        //         }
        //     }
        // }
        
    });
});
