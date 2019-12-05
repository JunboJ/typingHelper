import { getHelperLibrary } from './helperLibrary.mjs';

export const getCursorXY = (input) => {
  const caretPosition = {
    cursorStart: input.selectionStart,
    cursorEnd: input.selectionEnd
  }
  // initiate the selectionpoint
  let cursorStart = caretPosition.cursorStart;
  let cursorEnd = caretPosition.cursorEnd;
  let selectionPoint = cursorStart == cursorEnd ? cursorStart : Math.ceil((cursorStart + cursorEnd) / 2);

  // get the character under caret
  if (cursorStart == cursorEnd) cursorStart = cursorEnd == 0 ? 0 : (cursorStart - 1);
  // console.log('cursorStart:' + cursorStart + ' cursorEnd:' + cursorEnd);
  const inputString = input.value;
  const currentCharacter = inputString.slice(cursorStart, cursorEnd);

  // get options from library
  const options = currentCharacter.length == 1 ? getHelperLibrary(currentCharacter) : null;


  let helperDiv = document.getElementsByClassName('helperDiv')[0] ? document.getElementsByClassName('helperDiv')[0] : null;

  // helper content creating function

  const createOptions = helperDiv => {
    const prevHelperContent = document.getElementsByClassName('helperContent')[0] ? document.getElementsByClassName('helperContent')[0] : null;
    if (prevHelperContent !== null) {
      helperDiv.removeChild(prevHelperContent);
    }
    const helperContent = document.createElement('div');
    helperContent.className = 'helperContent';

    let className = 'helperOptions';
    if (options.length == 1) className = 'helperOption';

    // map options to buttons
    options.map((char, index) => {
      let key = (index + 49);
      // create options as buttons
      let helperOptions = document.createElement('button');
      helperOptions.className = className;
      helperOptions.id = key;
      helperOptions.style.fontSize = '1rem';
      // helperOptions.style.fontWeight = 'bold';
      let text = document.createTextNode(char);
      helperOptions.appendChild(text);
      helperContent.appendChild(helperOptions);
      // create tip spans
      let tip = document.createElement('small');
      tip.className = 'tips_windows';
      tip.innerHTML = (index + 1);
      
      helperOptions.prepend(tip);
      // add click event listener
      const clickEventHandler = event => {
        input.focus();
        let newString = inputString.slice(0, cursorStart) + char + inputString.slice(cursorEnd);
        input.value = newString;
        document.body.removeChild(helperDiv);
        helperDiv = null;
        document.body.removeEventListener('keyup', keyupEventHandler);
        document.body.removeEventListener('keydown', keydownEventHandler);
      };
      helperOptions.addEventListener('click', clickEventHandler);
    });

    // closeBtn event listener
    const closeBtnClickedHandler = event => {
      document.body.removeChild(helperDiv);
    };

    const escBtnPressedHandler = event => {
      console.log(event.which);
    };

    const closeBtn = document.createElement('button');
    closeBtn.className = 'helperCloseBtn';
    closeBtn.innerHTML = '&times;';
    helperContent.appendChild(closeBtn);
    closeBtn.addEventListener('click', closeBtnClickedHandler);
    // input.addEventListener('keypress', escBtnPressedHandler);
    helperDiv.appendChild(helperContent);

    // add key press event listener to document
    const keyupEventHandler = event => {
      // console.log(event.cancelable);
      if (document.getElementById(event.which)) {
        event.preventDefault();
        document.getElementById(event.which).click();
      }
    };

    const keydownEventHandler = event => {
      if (document.getElementById(event.which)) {
        event.preventDefault();
        document.getElementById(event.which).style.backgroundColor = 'rgb(78, 161, 216)';
      }
    }

    document.body.addEventListener('keyup', keyupEventHandler);
    document.body.addEventListener('keydown', keydownEventHandler);
  };

  // display writing helper

  if (options !== null) {
    // create the clone and configure the style
    const parent = input.parentElement;
    const cloneField = document.createElement('div');
    const copyStyle = getComputedStyle(input);
    for (const prop of copyStyle) { cloneField.style[prop] = copyStyle[prop]; }
    if (input.tagName === 'TEXTAREA') cloneField.style.height = 'auto';
    if (input.tagName === 'INPUT') cloneField.style.width = 'auto';
    // create span for locating caret on screen
    const span = document.createElement('span');

    // replace spaces in the textcontent
    const swap = '.';
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value;
    const textContent = inputValue.substr(0, selectionPoint);

    // assign content
    span.textContent = inputValue.substr(selectionPoint) || '.';
    cloneField.textContent = textContent;

    cloneField.appendChild(span);
    parent.appendChild(cloneField);

    // get position of wrapper of the rest of cloned content
    const {
      offsetLeft: spanX,
      offsetTop: spanY,
      offsetWidth: spanWidth,
      offsetHeight: spanHeight
    } = span;

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
    } = input;

    parent.removeChild(cloneField);

    // create helper box
    if (helperDiv === null) {
      console.log('new helper!');
      helperDiv = document.createElement('div');
      helperDiv.className = 'helperDiv';
      document.body.appendChild(helperDiv);

    }
    createOptions(helperDiv);

    const {
      offsetWidth: helperWidth,
      offsetHeight: helperHeight
    } = helperDiv;

    const leftPosition = (inputX + spanX - 5);
    const topPosition = (inputY - helperHeight + cloneFieldHeight - spanHeight - 10);

    helperDiv.style.left = `${leftPosition}px`;
    helperDiv.style.top = `${topPosition}px`;
    // console.log('inputX: ' + inputX + '  spanX: ' + spanX + '  cloneFieldHeight: ' + cloneFieldHeight);

  } else {
    if (helperDiv !== null) {
      document.body.removeChild(helperDiv);
      helperDiv = null;
    }
  };
};