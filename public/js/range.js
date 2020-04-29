const p = document.getElementById('p');
const selectButton = document.getElementById('select-button');
const deselectButton = document.getElementById('deselect-button');

selectButton.addEventListener('click', e => {
    // Clear any current selection
    const selection = window.getSelection();
    selection.removeAllRanges();

    // Select paragraph
    const range = document.createRange();
    range.selectNodeContents(p);
    range.collapse(false);
    selection.addRange(range);
});

deselectButton.addEventListener('click', e => {
    const selection = window.getSelection();
    selection.removeAllRanges();
});