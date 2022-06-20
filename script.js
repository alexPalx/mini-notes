const editButtons = document.querySelectorAll('.button_edit');
const deleteButtons = document.querySelectorAll('.button_delete');
const copyButtons = document.querySelectorAll('.button_copy');
const createButtons = document.querySelectorAll('.button_create');

editButtons.forEach(button => button.addEventListener('click', event => switchEditSave(event.target.parentNode.parentNode.children[0], event.target)));
deleteButtons.forEach(button => button.addEventListener('click', event => removeItem(event.target.parentNode.parentNode)));
copyButtons.forEach(button => button.addEventListener('click', event => updateClipboard(event.target.parentNode.parentNode.children[0].textContent)));
createButtons.forEach(button => button.addEventListener('click', event => addItem(event.target.parentNode.parentNode)));

function addItem(listNode) {
    const itemId = listNode.children.length - 1;
    const itemText = listNode.children[itemId].children[0].textContent;

    const template = `
    <div class="item__text" contentEditable="false">${itemText}</div>
    <div class="item__buttons">
        <button class="button button_edit">Edit</button>
        <button class="button button_delete">Del</button>
        <button class="button button_copy">Copy</button>
    </div>`;

    const newElem = document.createElement('li');
    newElem.classList.add('content__item', 'item', `#${itemId}`);
    newElem.innerHTML = template;

    // listeners for buttons: edit, delete, copy
    newElem.children[1].children[0].addEventListener('click', event => switchEditSave(event.target.parentNode.parentNode.children[0], event.target));
    newElem.children[1].children[1].addEventListener('click', event => removeItem(event.target.parentNode.parentNode));
    newElem.children[1].children[2].addEventListener('click', event => updateClipboard(event.target.parentNode.parentNode.children[0].textContent));

    listNode.children[itemId].children[0].textContent = '';
    listNode.insertBefore(newElem, listNode.children[itemId]);
}

function removeItem(node) {
    const list = node.parentNode;
    node.remove();

    // update indexes
    for (let i = 0; i < list.children.length - 1; ++i) {
        const classListArray = Array.from(list.children[i].classList);
        list.children[i].classList.remove(classListArray.find(className => className.startsWith('#')));
        list.children[i].classList.add(`#${i}`);
    }
}

function updateClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => console.log(`"${text}" copied!`),
            () => console.log('Error'));
}

function switchEditSave(content, button) {
    content.contentEditable = !JSON.parse(content.contentEditable);
    button.textContent = JSON.parse(content.contentEditable) ? 'Save' : 'Edit';
}