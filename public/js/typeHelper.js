import { get_fr } from "./lang/frLib.js";
import { get_zh } from "./lang/zhLib.js";
import { get_de } from "./lang/deLib.js";
import { get_es } from "./lang/esLib.js";
import { get_it } from "./lang/itLib.js";
import { get_el } from "./lang/elLib.js";
import { get_ja } from "./lang/jaLib.js";
// import { kanjiRaw } from "./lang/AutoKanjiTrie.js";

// console.log(kanjiRaw);

let language = "fr";
let mode = "";
let autoSelect = false;
let helperDiv = $(".helperDiv")[0] ? $(".helperDiv")[0] : null;
let pageNum = 0;
let highlightOption = 49;
let pages = [];
let inputHtml = null;
let inputParent = null;
let helperContent = null;
let btnSet = null;
let pageCtrl = null;
let firstRowWrapper = null;
let options = null;

// get options from library
const getOptions = (str, callback) => {
	const reset = () => {
		autoSelect = false;
		console.log("reset");
	};
	if (str.length != 0) {
		switch (language) {
			case "de":
				reset();
				callback(get_de(str) || null);
				break;
			case "es":
				reset();
				callback(get_es(str) || null);
				break;
			case "fr":
				reset();
				callback(get_fr(str) || null);
				break;
			case "it":
				reset();
				callback(get_it(str) || null);
				break;
			case "el":
				autoSelect = true;
				callback(get_el(str) || null);
				break;
			case "zh":
				reset();
				if (get_zh(str)) {
					const result = get_zh(str) || null;
					callback(result);
				}
				break;
			case "ja":
				autoSelect = false;
				callback(get_ja(str) || null);
				break;
			default:
				return null;
		}
	}
	return null;
};

// closeBtn event handler
const closeBtnMouseDownHandler = event => {
	event.stopPropagation();
	event.elements.input.off("blur");
};

const closeBtnClickedHandler = event => {
	if (helperDiv) helperDiv.remove();
	event.elements.input.off(".basicKeyEvents");
};

const keyValidityCheck = keycode => {
	// console.log(keycode);
	const inputKeys = [192, 219, 221, 220, 186, 222, 188, 190, 191];
	if (
		autoSelect &&
		!(keycode >= 48 && keycode <= 57) &&
		!(keycode >= 65 && keycode <= 90)
	) {
		const valid = inputKeys.includes(keycode);
		return valid;
	}
	if (autoSelect && (keycode >= 65 && keycode <= 90)) {
		return true;
	}
	return false;
};

// add key press event handler
const keyupEventHandler = event => {
	let keycode = event.which || event.keyCode;
	if (event.shiftKey === false) {
		if (document.getElementById(keycode)) {
			event.preventDefault();
			// console.log(`#${keycode}`);
			$(`#${keycode}`).mouseup();
			$("body").off(".basicKeyEvents");
			event.input.off(".basicKeyEvents");
			event.helperDiv.remove();
			if (language == "zh") {
				writingHelper(event.input, language);
			}
		}
	}
	if (keycode == 32 || keycode == 13) {
		console.log("highlight option: ", highlightOption);
		if (language == "el" || language == "zh" || language == "ja") {
			// event.preventDefault();
			$("#" + highlightOption).mouseup();
			writingHelper(event.input, language);
		}
		if (
			(language == "de" ||
				language == "es" ||
				language == "fr" ||
				language == "it") &&
			highlightOption == 49
		) {
		}
		if (highlightOption != 49) {
			event.preventDefault();
			$("#" + highlightOption).mouseup();
		}
	}
};

const keydownEventHandler = event => {
	let keycode = event.which || event.keyCode;
	// number key pressed
	if (event.shiftKey === false && keycode >= 48 && keycode <= 57) {
		if (document.getElementById(keycode)) {
			event.preventDefault();
			$("#" + keycode).css({ "background-color": "rgb(78, 161, 216)" });
		}
		return;
	}

	if (keycode == 189) {
		event.preventDefault();
		$("#prevPageCtrl").mouseup();
	}

	if (keycode == 187) {
		event.preventDefault();
		$("#nextPageCtrl").mouseup();
	}

	// space key and enter key pressed
	if (keycode == 32 || keycode == 13) {
		console.log(language);
		if (
			(language == "de" ||
				language == "es" ||
				language == "fr" ||
				language == "it") &&
			highlightOption == 49
		) {
			console.log("add a space!!!");
			return;
		} else {
			event.preventDefault();
			$("#" + highlightOption).css({ "background-color": "rgb(78, 161, 216)" });
		}
	}

	if (keycode == 38) {
		event.preventDefault();
		if (highlightOption - 49 > 0) {
			// event.preventDefault();
			highlightOption = highlightOption - 1;
			setHighlight(highlightOption);
		} else {
			// if (pageNum > 0) {
			// event.preventDefault();
			$("#prevPageCtrl").mouseup();
			// }
		}
		console.log("highlight option: ", highlightOption);
		return;
	}

	if (keycode == 40) {
		event.preventDefault();
		console.log(pages[pageNum][1], pages[pageNum][0], highlightOption);

		if ((highlightOption - 49) < (pages[pageNum][1] - pages[pageNum][0])) {
			// event.preventDefault();
			highlightOption = highlightOption + 1;
			setHighlight(highlightOption);
			console.log('nextable');
		} else {
			// event.preventDefault();
			$("#nextPageCtrl").mouseup();
			console.log('end');
		}
		console.log("highlight option: ", highlightOption);
		// console.log(event.pages + '/' + pageNum + '/' + event.pages[pageNum][1] + '/' + highlightOption);
		return;
	}

	// other key check
	const valid = keyValidityCheck(keycode);
	if (valid) $("#49").mouseup();
};

// cog onclick handler
const settingBtnClickedHandler = event => {
	event.stopPropagation();
	event.elements.input.off("blur");
	let display = $(".settingMenuWrapper").css("display");
	const position = $(".helperDiv")[0].classList.contains("helperDiv-bottom");

	if (display == "none") {
		const menuHeight = $(".settingMenuWrapper").outerHeight();
		let helperY = $(".helperDiv").css("top").slice(0, -2);
		helperY = parseInt(helperY);
		$(".settingMenuWrapper").css({ display: "flex" });
		const currentY = position ? helperY : helperY - menuHeight;
		$(".helperDiv").css({ top: currentY });
	}
	if (display == "flex") {
		const menuHeight = $(".settingMenuWrapper").outerHeight();
		let helperY = $(".helperDiv").css("top").slice(0, -2);
		helperY = parseInt(helperY);
		const currentY = position ? helperY : helperY + menuHeight;
		$(".helperDiv").css({ top: currentY });
		$(".settingMenuWrapper").css({ display: "none" });
	}
};

// remove helperDiv function
const removeHelper = (input) => {
	helperDiv.remove();
	input.off(".basicKeyEvents");
};

// setting drop down list active function
const createDropdown = () => {
	const menu = document.createElement("div");
	const mc = document.createElement("span");
	const mctext = document.createTextNode("More coming");
	mc.appendChild(mctext);
	menu.appendChild(mc);
	menu.className = "dropdown-menu";
	return menu;
};

// helper content creating function
const createOptions = (
	// helperDiv,
	// helperContent,
	// options,
	input,
	cursorStart,
	cursorEnd,
	// pages,
	mode = "new"
) => {
	$(helperContent).empty();
	highlightOption = 49;
	if (mode == "new") pageNum = 0;
	if (mode == "pageChange") {
	}
	inputHtml = input[0];
	const inputString = getInputValue(inputHtml);
	let className = "helperOptions";
	// map options to buttons
	if (options.result !== null) {
		mapOptionToBtn(
			// helperDiv,
			cursorStart,
			cursorEnd,
			// pages,
			className,
			inputString,
			// options,
			// helperContent,
			input
		);
	}
};

const mapOptionToBtn = (
	// helperDiv,
	cursorStart,
	cursorEnd,
	// pages,
	className,
	inputString,
	// options,
	// helperContent,
	input
) => {
	const start = pages[pageNum][0];
	const end = pages[pageNum][1] + 1;
	console.log(pageNum + "/" + start + "/" + end);

	if (helperContent) {
		options.result.slice(start, end).map((char, index) => {
			let key = index + 49;
			// console.log(index);

			// create options as buttons
			let helperOptions = document.createElement("button");
			helperOptions.className = className;
			helperOptions.id = key;
			helperOptions.style.fontSize = "1rem";

			let text = document.createTextNode(char);
			helperOptions.appendChild(text);
			helperContent.appendChild(helperOptions);

			// create tip spans
			let tip = document.createElement("small");
			tip.className = "tips_windows";
			tip.innerHTML = index + 1;

			helperOptions.prepend(tip);

			$(helperOptions).on("mousedown", () => {
				event.muAssets = {
					input: input
				};
				mouseDownHandler(event);
			});
			$(helperOptions).on("mouseup", event => {
				event.muAssets = {
					helperDiv: helperDiv,
					cursorStart: cursorStart,
					cursorEnd: cursorEnd,
					input: input,
					options: options,
					inputString: inputString,
					char: char
				};
				// console.log('event.muAssets: ', event.muAssets);

				mouseUpHandler(event);
			});

			// default option highlight
			setHighlight();
		});
	}
};

// selection highlight
const setHighlight = (option = 49) => {
	$(".helperOptions").css({ "background-color": "white" });
	$("#" + option).css({ "background-color": "rgb(78, 161, 216)" });
};

// pagination event handlers
const prevPageEventHandler = (event, callback) => {
	// const pages = event.pages;
	const input = event.input;
	event.stopPropagation();
	input.off("blur");
	if (pages.length > 1) {
		if (pageNum - 1 >= 0) {
			pageNum = pageNum - 1;
			callback();
		}
	}
};

const nextPageEventHandler = (event, callback) => {
	// const pages = event.pages;
	const input = event.input;
	event.stopPropagation();
	input.off("blur");
	if (pages.length > 1) {
		if (pageNum + 1 <= pages.length - 1) {
			pageNum = pageNum + 1;
			callback();
		}
	}
};

// add click event listener
const mouseDownHandler = event => {
	event.muAssets.input.off("blur");
	event.stopPropagation();
};

const mouseUpHandler = event => {
	event.muAssets.input.off("blur");
	event.stopPropagation();
	inputHtml = event.muAssets.input[0];
	let wordStart, wordEnd, newString;
	if (event.muAssets.cursorStart == event.muAssets.cursorEnd) {
		// only japanese and Chinese have strL
		let strLength = event.muAssets.options.strL || 0;
		wordStart = event.muAssets.cursorStart - strLength;
		wordEnd = wordStart + event.muAssets.options.partEnd;
		newString =
			event.muAssets.inputString.slice(0, wordStart) +
			event.muAssets.char +
			event.muAssets.inputString.slice(wordEnd);
	} else {
		let selectedString = event.muAssets.inputString.slice(
			event.muAssets.cursorStart,
			event.muAssets.cursorEnd
		);
		let modifiedSelectedString = selectedString.replace(
			event.muAssets.options.resultString,
			event.muAssets.char
		);
		newString =
			event.muAssets.inputString.slice(0, event.muAssets.cursorStart) +
			modifiedSelectedString +
			event.muAssets.inputString.slice(event.muAssets.cursorEnd);
	}
	setInputValue(inputHtml, newString);
	removeHelper(event.muAssets.helperDiv, event.muAssets.input);
	setFocus(event.muAssets.input);
};

// const generateFinalResult = (cursorStart, cursorEnd, strLength, )

const getCaretPosition = editableDiv => {
	var caretStartPos = 0,
		caretEndPos = 0,
		sel,
		range;
	if (window.getSelection) {
		sel = window.getSelection();
		console.log("getSelection: ", sel);

		if (sel.rangeCount) {
			range = sel.getRangeAt(0);
			// console.log('getRangeAt: ', range);
			if (range.commonAncestorContainer.parentNode == editableDiv) {
				caretStartPos = range.endOffset;
				if (range.startOffset) caretStartPos = range.startOffset;
				caretEndPos = range.endOffset;
			}
		}
	}
	return { cursorStart: caretStartPos, cursorEnd: caretEndPos };
};

const getInputSL = inputHtml => {
	let cursorStart, cursorEnd;
	if (inputHtml.tagName == "DIV") {
		({ cursorStart, cursorEnd } = getCaretPosition(inputHtml));
		console.log("getpos: ", cursorStart);
	} else {
		({ cursorStart, cursorEnd } = {
			cursorStart: inputHtml.selectionStart,
			cursorEnd: inputHtml.selectionEnd
		});
	}
	// get the character under caret
	if (cursorStart == cursorEnd)
		cursorStart = cursorEnd == 0 ? 0 : cursorStart - 1;
	const inputString = getInputValue(inputHtml);
	const currentCharacter = inputString.slice(cursorStart, cursorEnd);
	// console.log(currentCharacter);

	return {
		currentCharacter: currentCharacter,
		cursorStart: cursorStart,
		cursorEnd: cursorEnd
	};
};

const getInputML = inputHtml => {
	let cursorStart, cursorEnd;
	if (inputHtml.tagName == "DIV") {
		({ cursorStart, cursorEnd } = getCaretPosition(inputHtml));
	} else {
		({ cursorStart, cursorEnd } = {
			cursorStart: inputHtml.selectionStart,
			cursorEnd: inputHtml.selectionEnd
		});
	}
	let start, end;
	if (cursorStart == cursorEnd) {
		start = 0;
		end = cursorEnd;
	} else {
		start = cursorStart;
		end = cursorEnd;
	}
	let input_val = getInputValue(inputHtml);
	const inputString = input_val.slice(start, end);

	// const patt = new RegExp('([a-zA-Z]*)', 'g');
	const patt = /([a-zA-Z.,!?$;:\\()\'\"<>]+)/gi;
	let temp;
	let charArray = [];
	do {
		temp = patt.exec(inputString);
		if (temp) {
			const infoObj = {
				string: temp[0],
				index: patt.lastIndex
			};
			charArray.push(infoObj);
		}
	} while (temp);

	let currentCharacter;
	if (charArray.length > 0) {
		if (charArray[charArray.length - 1].index !== inputString.length) {
			currentCharacter = null;
		} else {
			currentCharacter = charArray[charArray.length - 1].string;
		}
	} else {
		currentCharacter = null;
	}

	return {
		currentCharacter: currentCharacter,
		cursorStart: cursorStart,
		cursorEnd: cursorEnd
	};
};

// get input value
const getInputValue = element => {
	if (element.tagName === "DIV") {
		let input_val = element.innerText;
		return input_val;
	} else {
		if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
			let input_val = element.value;
			return input_val;
		} else {
			console.log("the element is invalid");
			return false;
		}
	}
};

// set input value
const setInputValue = (element, val) => {
	if (element.tagName === "DIV") {
		element.innerText = val;
	} else {
		if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
			element.value = val;
		} else {
			console.log("the element is invalid");
			return false;
		}
	}
};

// focus on element function
const setFocus = el => {
	let element = el[0];
	if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
		element.focus();
	} else {
		let stringNode = element.childNodes[0];
		let stringLength = stringNode.length;
		// console.log('set focus element: ', element);
		let range = document.createRange();
		let selection = window.getSelection();
		range.setStart(stringNode, stringLength);
		range.collapse(true);
		console.log("range: ", stringNode);
		selection.removeAllRanges();
		selection.addRange(range);
		element.focus();
	}
};

const optionStyling = (a, b) => {
	if (a <= b) {
		// topPosition = (cloneFieldHeight);
		$(".helperDiv").addClass("helperDiv-bottom");
		$(".helperOptions").addClass("helperOptions-bottom");
		$(".helperDiv").removeClass("helperDiv-top");
		$(".helperOptions").removeClass("helperOptions-top");
	} else {
		$(".helperDiv").removeClass("helperDiv-bottom");
		$(".helperOptions").removeClass("helperOptions-bottom");
		$(".helperDiv").addClass("helperDiv-top");
		$(".helperOptions").addClass("helperOptions-top");
	}
};

const generateElements = () => {
	helperDiv = document.createElement("div");
	helperDiv.className = "helperDiv";
	helperContent = document.createElement("div");
	helperContent.className = "helperContent";
	// button set container
	btnSet = document.createElement("div");
	btnSet.className = "btnSet";
	// page controller container
	pageCtrl = document.createElement("div");
	pageCtrl.className = "pageCtrl";
	// first row wrapper
	firstRowWrapper = document.createElement("div");
	$(firstRowWrapper).css({
		margin: "0",
		padding: "0",
		border: "none",
		display: "inline-flex",
		"justify-content": "space-between"
	});
}

// pagination
const generatePageList = (resLength) => {
	// let pages = [];
	let index = 0;
	let pageStart = 0;
	for (let i = 0; i < resLength; i++) {
		let a = 0;
		if (i != 0) a = 1;
		if (i % 6 == 0) {
			if (pageStart + 6 + a <= resLength - 1) {
				pages[index] = [pageStart + a, pageStart + 6 + a];
				pageStart = pageStart + 6 + a;
				index++;
			} else {
				if (pageStart == resLength - 1) {
					return;
				} else {
					pages[index] = [pageStart + a, resLength - 1];
				}
			}
		}
	}
	return;
}

// default export function
export const writingHelper = (input, lang) => {
	inputHtml = input[0];
	inputParent = input.parent();
	let input_val = getInputValue(inputHtml);
	let getCurrentCharacter = null;

	language = lang;
	console.log("language: ", language);

	helperDiv = $(".helperDiv")[0] ? $(".helperDiv")[0] : null;

	//////////////////////////////

	if (language === "zh" || language === "ja") {
		getCurrentCharacter = () => getInputML(inputHtml);
	} else {
		getCurrentCharacter = () => getInputSL(inputHtml);
	}

	if (input_val) {
		var { currentCharacter, cursorStart, cursorEnd } = getCurrentCharacter();
		// console.log('cursorStart: ', cursorStart);
	} else {
		var currentCharacter = null;
	}

	// get options from library
	if (currentCharacter !== null) {
		getOptions(currentCharacter, opt => {
			console.log("returned options: ", options);
			options = opt;
			// display writing helper
			if (options !== null && options.result !== null) {
				generatePageList(options.result.length);
				console.log("pages: ", pages);

				// create the clone and configure the style
				const parent = inputHtml.parentElement;
				const cloneField = document.createElement("div");
				///////////////////////////////////
				const copyStyle = getComputedStyle(inputHtml);
				for (const prop of copyStyle) {
					cloneField.style[prop] = copyStyle[prop];
				}
				if (inputHtml.tagName === "TEXTAREA") cloneField.style.height = "auto";
				if (inputHtml.tagName === "INPUT") cloneField.style.width = "auto";
				// create span for locating caret on screen
				const span = document.createElement("span");

				// replace spaces in the textcontent
				const swap = ".";
				let input_val = getInputValue(inputHtml);
				const inputValue =
					inputHtml.tagName === "INPUT"
						? input_val.replace(/ /g, swap)
						: input_val;
				const textContent = inputValue.substr(0, cursorEnd).slice(0, -1);

				// assign content
				cloneField.textContent = textContent;
				span.textContent = inputValue.substr(cursorEnd) + "." || ".";

				cloneField.appendChild(span);
				parent.appendChild(cloneField);

				// get position of wrapper of the rest of cloned content
				const {
					offsetLeft: spanX,
					offsetTop: spanY,
					offsetWidth: spanWidth,
					offsetHeight: spanHeight
				} = span;
				const spany = $(span).offset().top;

				// get position of clone div
				const {
					offsetLeft: cloneFieldX,
					offsetTop: cloneFieldY,
					offsetWidth: cloneFieldWidth,
					offsetHeight: cloneFieldHeight
				} = cloneField;

				// get position of input fields
				const {
					offsetLeft: inputX,
					offsetTop: inputY,
					offsetWidth: inputWidth,
					offsetHeight: inputHeight
				} = inputHtml;

				// get position of the parent element of input fields
				const {
					offsetLeft: ipX,
					offsetTop: ipY,
					offsetWidth: ipWidth,
					offsetHeight: ipHeight
				} = inputParent[0];
				const ipy = $(inputParent[0]).offset().top;

				// remove clone
				cloneField.remove();

				// create IME interface
				helperContent = $(".helperContent")[0] || null;
				if (helperDiv === null) {
					// console.log('new helper Div');
					generateElements();
					inputParent.append(helperDiv);
					// option container
					if (pages.length <= 1) {
						pageCtrl.style.display = "none";
					} else {
						pageCtrl.style.display = "inline-flex";
					}

					firstRowWrapper.append(helperContent);
					firstRowWrapper.append(pageCtrl);
					firstRowWrapper.append(btnSet);
					helperDiv.append(firstRowWrapper);

					// page up button
					const prevPage = document.createElement("button");
					prevPage.className = "pageCtrl";
					prevPage.id = "prevPageCtrl";
					prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';
					pageCtrl.append(prevPage);
					$(prevPage).on("mousedown", event => {
						event.stopPropagation();
						input.off("blur");
					});
					$(prevPage).on("mouseup", event => {
						event.input = input;
						// event.pages = pages;
						console.log("prev");
						prevPageEventHandler(event, () => {
							setFocus(input);
							createOptions(
								helperDiv,
								// helperContent,
								// options,
								input,
								cursorStart,
								cursorEnd,
								// pages,
								"pageChange"
							);
							optionStyling();
						});
					});

					// page down button
					const nextPage = document.createElement("button");
					nextPage.className = "pageCtrl";
					nextPage.id = "nextPageCtrl";
					nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';
					pageCtrl.append(nextPage);
					$(nextPage).on("mousedown", event => {
						event.stopPropagation();
						input.off("blur");
					});
					$(nextPage).on("mouseup", event => {
						event.input = input;
						// event.pages = pages;
						console.log("next");
						nextPageEventHandler(event, () => {
							setFocus(input);
							createOptions(
								helperDiv,
								// helperContent,
								// options,
								input,
								cursorStart,
								cursorEnd,
								// pages,
								"pageChange"
							);
							optionStyling();
						});
					});

					// setting button * didn't add it to ime.js
					const settingBtn = document.createElement("button");
					settingBtn.className = "settingBtn";
					settingBtn.innerHTML = '<i class="fas fa-cog"></i>';
					btnSet.appendChild(settingBtn);
					$(settingBtn).on("mousedown", event => {
						event.elements = { input: input };
						settingBtnClickedHandler(event);
						setFocus(input);
					});
					$(settingBtn).on("mouseup", event => {
						setFocus(input);
					});

					// closeBtn
					const closeBtn = document.createElement("button");
					closeBtn.className = "helperCloseBtn";
					closeBtn.innerHTML = '<i class="fas fa-times"></i>';
					btnSet.appendChild(closeBtn);
					closeBtn.addEventListener("mousedown", event => {
						event.elements = { input: input };
						closeBtnMouseDownHandler(event);
					});
					closeBtn.addEventListener("mouseup", event => {
						event.elements = {
							input: input,
							// helperDiv: helperDiv
						};
						closeBtnClickedHandler(event);
					});

					// setting menu container
					const settingMenuWrapper = document.createElement("div");
					settingMenuWrapper.className = "settingMenuWrapper";
					const menuContent = createDropdown();
					settingMenuWrapper.appendChild(menuContent);
					helperDiv.append(settingMenuWrapper);

					// add key press event listener
					const basicKeyEventListener = () => {
						console.log('event handler has pages: ', pages);

						input.on("keyup.basicKeyEvents", event => {
							// event.pages = pages;
							event.helperDiv = helperDiv;
							event.input = input;
							keyupEventHandler(event);
						});
						input.on("keydown.basicKeyEvents", event => {
							// event.pages = pages;
							keydownEventHandler(event);
						});
						if (mode !== "test") {
							input.one("blur", event => {
								event.elements = {
									input: input,
									// helperDiv: helperDiv
								};
								closeBtnClickedHandler(event);
							});
						}
					};
					basicKeyEventListener();
					createOptions(
						helperDiv,
						// helperContent,
						options,
						input,
						cursorStart,
						cursorEnd,
						// pages
					);
				} else {
					if (pages.length <= 1) {
						pageCtrl.style.display = "none";
					} else {
						pageCtrl.style.display = "inline-flex";
					}
					createOptions(
						helperDiv,
						// helperContent,
						options,
						input,
						cursorStart,
						cursorEnd,
						// pages
					);
				}

				const {
					offsetWidth: helperWidth,
					offsetHeight: helperHeight
				} = helperDiv;

				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;

				// styling and positioning
				let leftPosition = spanX + 16;
				let spanW = ipX + spanX + helperWidth;
				let topPosition = cloneFieldHeight - helperHeight - spanHeight - 10;
				let topToWindow = Math.abs(spany);
				if (span.textContent !== ".") {
					topToWindow = Math.abs(spany);
				}
				optionStyling(topToWindow, helperHeight);

				if (inputHtml.tagName === "INPUT") {
					// input field with full length string
					if (
						spanW - helperWidth >= inputWidth &&
						inputWidth + helperWidth < windowWidth
					) {
						leftPosition = inputWidth;
					}
					// full width input field
					if (spanW >= windowWidth && inputWidth + helperWidth > windowWidth) {
						leftPosition = windowWidth - helperWidth - ipX;
					}
				}

				if (inputHtml.tagName === "TEXTAREA") {
					// full width text area
					if (spanW >= windowWidth) {
						leftPosition = windowWidth - helperWidth - ipX;
					}
				}

				if (inputHtml.tagName === "div") {
					// full width text area
					if (spanW >= windowWidth) {
						leftPosition = windowWidth - helperWidth - ipX;
					}
				}

				helperDiv.style.left = `${leftPosition}px`;
				helperDiv.style.top = `${topPosition + 8}px`;
			} else {
				if (helperDiv !== null) {
					removeHelper(helperDiv, input);
				}
			}
		});
	} else {
		if (helperDiv !== null) {
			removeHelper(helperDiv, input);
		}
	}
};
