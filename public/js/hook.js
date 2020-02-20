import { writingHelper, resetCaretStart } from "./ime.js";

let language = null;
let buttonPosLeft;
let buttonPosTop;
let buttonWidth;
let buttonHeight;
let langList;
const listWrapper = document.createElement("div");

const addLanguageCheckingList = textInput => {
    const languages = {
        de: "German",
        el: "Greek",
        en: "English",
        es: "Spanish",
        fr: "French",
        id: "Indonesian",
        it: "Italian",
        ja: "Japanese",
        zh: "Chinese",
        pinyin: "Chinese(Pinyin)"
    };
    // const listWrapper = document.createElement("div");
    listWrapper.className = "listWrapper";
    Object.keys(languages).map(code => {
        const x = document.createElement("IMG");
        x.className = "flagIcon";
        x.setAttribute("src", "public/images/icons/" + code + '.png');
        x.setAttribute("alt", code);

        const languageFullName = document.createElement("span");
        languageFullName.className = 'languageFullName';
        var t = document.createTextNode(languages[code]);
        languageFullName.appendChild(t);

        const langLabel = document.createElement("label");
        langLabel.className = "listItems";
        langLabel.classList.add("check-container");
        $(langLabel).css({ height: "auto", margin: "0.5rem" });

        const langSwitch = document.createElement("input");
        langSwitch.className = "langSwitch";
        langSwitch.name = "lang";
        langSwitch.type = "radio";
        if (code === "en") langSwitch.checked = true;
        $(langSwitch).on("click", () => {
            setTimeout(() => {
                $(listWrapper).toggleClass("listWrapper_off");
                $(listWrapper).toggleClass("listWrapper_on");
            }, 50);
        });

        const langCode = document.createElement("input");
        langCode.className = "langCode";
        langCode.type = "hidden";
        langCode.value = code;

        const mark = document.createElement("span");
        mark.className = "checkmark";

        langLabel.appendChild(x);
        langLabel.appendChild(languageFullName);
        langLabel.appendChild(langSwitch);
        langLabel.appendChild(langCode);
        langLabel.appendChild(mark);

        listWrapper.appendChild(langLabel);
    });
    return listWrapper;
};

const reposition = langList => {
    buttonPosLeft = $("#changeLanguage_btn").offset().left;
    buttonPosTop = $("#changeLanguage_btn").offset().top;
    buttonWidth = $("#changeLanguage_btn").width();
    buttonHeight = $(langList).height();

    const buttonTop = Math.floor(buttonPosTop - buttonHeight - 15);
    $(langList).css({
        left: buttonPosLeft - 11,
        top: buttonTop
    });
};

$(window).resize(function () {
    reposition(langList);
});

$(document).ready(function () {
    langList = addLanguageCheckingList();
    $(langList).addClass("listWrapper_off");
    document.body.appendChild(langList);

    $("#changeLanguage_btn").on("click", event => {
        // const classCheck = $(langList).hasClass('listWrapper_off');
        $(langList).toggleClass("listWrapper_off");
        $(langList).toggleClass("listWrapper_on");
        $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_off");
        $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_on");
        reposition(langList);
    });
    language = $(".langSwitch:checked + .langCode").val();
    console.log(language);
    $(".writingHelper").each(function (index, object) {
        // elementsArr.forEach(element => {
        const element = $(this);

        element.parent().css({
            display: "flex",
            "flex-flow": "column",
            width: "100%",
            position: "relative"
        });

        const getHelperDiv = () => {
            return $(".helperDiv")[0] || null;
        };

        const eventHandler = (event, isTyping = false) => {
            console.log("input event", isTyping);
            // event.preventDefault();
            if (language != "en") {
                writingHelper(element, language, isTyping);
                return;
            }
        };

        const run = () => {
            // console.log(event.which);
            if (language != "en") {
                writingHelper(element, language);
            }
        };

        const arrowKeyEventHandler = event => {
            const div = getHelperDiv();
            if (div) {
                if (event.which == 37 || event.which == 39) {
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
                if (div) {
                    div.remove();
                    resetCaretStart();
                }
            }
        };

        element.on("click", eventHandler);
        element.on("keydown", event => {
            const helperdiv = getHelperDiv();
            if (event.which == 8 || event.which == 46) {
                if (helperdiv) {
                    console.log("helperdiv on backspace");
                    setTimeout(() => {
                        eventHandler(event, true);
                    }, 50);
                } else {
                    setTimeout(() => {
                        eventHandler(event);
                    }, 50);
                }
            }
            if (event.which == 27) {
                if (helperdiv) {
                    helperdiv.remove();
                    resetCaretStart();
                }
            }
        });
        element.on("keyup", event => {
            if (
                event.which == 37 ||
                event.which == 38 ||
                event.which == 39 ||
                event.which == 40
            ) {
                arrowKeyEventHandler(event);
            }
        });
        element.on("input", () => {
            eventHandler(event, true);
        });
    });

    $(".langSwitch").on("change", event => {
        language = $(".langSwitch:checked + .langCode").val();
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
