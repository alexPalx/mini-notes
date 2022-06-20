const editButtons = document.querySelectorAll('.button_edit');
const deleteButtons = document.querySelectorAll('.button_delete');
const copyButtons = document.querySelectorAll('.button_copy');
const createButtons = document.querySelectorAll('.button_create');
const tabButtons = document.querySelectorAll('.tab');
const importButton = document.querySelector('.button_import');
const exportButton = document.querySelector('.button_export');

editButtons.forEach(button => button.addEventListener('click', event => switchEditSave(event.target.parentNode.parentNode.children[0], event.target)));
deleteButtons.forEach(button => button.addEventListener('click', event => removeItem(event.target.parentNode.parentNode)));
copyButtons.forEach(button => button.addEventListener('click', event => updateClipboard(event.target.parentNode.parentNode.children[0].textContent)));
createButtons.forEach(button => button.addEventListener('click', event => addItem(event.target.parentNode.parentNode)));
tabButtons.forEach(button => button.addEventListener('click', event => setActiveTab(event.target)));
importButton.addEventListener('click', dataImport);
exportButton.addEventListener('click', dataExport);

function addItem(listNode, content) {
    const itemId = listNode.children.length - 1;
    const itemText = content ? content : listNode.children[itemId].children[0].textContent;
    if (itemText === '') return;

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

    saveToLocalStorage();
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

    saveToLocalStorage();
}

function updateClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => console.log(`"${text}" copied!`),
            (err) => console.log(`Error: ${err}`));
}

function switchEditSave(content, button) {
    content.contentEditable = !JSON.parse(content.contentEditable);

    if (JSON.parse(content.contentEditable)) {
        content.focus();

        const range = document.createRange();
        const selection = window.getSelection();

        range.setStart(content, 1);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        button.textContent = 'Save';
    }
    else {
        button.textContent = 'Edit';
        saveToLocalStorage();
    }
}

function setActiveTab(tabNode) {
    const allListsParent = document.querySelector('.content-wrapper');

    if (tabNode.textContent === ' + ') {
        addTab();
        return;
    }

    const activeTabId = +Array.from(tabNode.classList).find(className => className.startsWith('#')).slice(1) || 0;

    document.querySelectorAll('.tab').forEach(button => button.classList.remove('tab_active'));
    tabNode.classList.add('tab_active');

    [].forEach.call(allListsParent.children, list => list.classList.remove('content_active'));
    allListsParent.children[activeTabId].classList.add('content_active');
}

function addTab() {
    const tabNode = document.querySelector('.tab_create');
    const allListsParent = document.querySelector('.content-wrapper');
    const tabs = tabNode.parentNode;
    const newTabId = tabs.children.length;

    const newTab = document.createElement('li');
    newTab.classList.add('tab', `#${newTabId - 1}`);
    newTab.textContent = `Tab ${newTabId}`;
    tabs.insertBefore(newTab, tabNode);

    newTab.addEventListener('click', event => setActiveTab(event.target));

    const newContent = document.createElement('ul');
    newContent.classList.add('content', `#${newTabId}`);
    newContent.innerHTML = `
    <li class="content__item item item_create">
        <div class="item__text" contentEditable="true"></div>
        <button class="button button_create">Add</button>
    </li>`;
    // listener for add button
    newContent.children[0].children[1].addEventListener('click', event => addItem(event.target.parentNode.parentNode));

    allListsParent.appendChild(newContent);

    setActiveTab(tabs.children[newTabId - 1]);
}

function erase() {
    const tabs = document.querySelectorAll('.tab');
    const lists = document.querySelectorAll('.content');

    for (let i = 0; i < tabs.length - 1; ++i) tabs[i].remove()
    lists.forEach(list => list.remove());
}

function loadData(data) {
    if (!Array.isArray(data[0])) {
        console.log('Invalid data');
        return;
    }
    
    erase();

    for (let list = 0; list < data.length; ++list) {
        addTab();
        for (let item = 0; item < data[list].length; ++item) {
            const lists = document.querySelectorAll('.content');
            const listNode = lists[lists.length - 1];
            addItem(listNode, data[list][item]);
        }
    }

    setActiveTab(document.querySelector('.tab'));

    return data;
}

function saveToLocalStorage() {
    // save as [ lists[ list_items(text) ] ] ]
    const data = Array.from(document.querySelectorAll('.content'))
        .map(item => Array.from(item.children)
            .map(elem => elem.children[0].textContent)
            .filter(elem => elem !== ''));

    localStorage.setItem('mini-notes-data', JSON.stringify(data));
}

function loadFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem('mini-notes-data'));
    if (!data) {
        localStorage.setItem('mini-notes-data', JSON.stringify([[["Note example"]]]));
        data = JSON.parse(localStorage.getItem('mini-notes-data'));
    };

    return loadData(data);
}

function dataExport() {
    updateClipboard(JSON.stringify(loadFromLocalStorage()));
}

function dataImport() {
    try {
        loadData(JSON.parse(document.querySelector('#import').value));
        setActiveTab(document.querySelector('.tab'));
    }
    catch {
        console.log('Invalid data');
        return;
    }

    console.log('Successfully imported');
    saveToLocalStorage();
}

function init() {
    loadFromLocalStorage();
}

init();