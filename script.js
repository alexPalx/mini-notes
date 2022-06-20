const editButtons = document.querySelectorAll('.button_edit');
const deleteButtons = document.querySelectorAll('.button_delete');
const copyButtons = document.querySelectorAll('.button_copy');

editButtons.forEach(button => button.addEventListener('click', event => switchEditSave(event.target.parentNode.parentNode.children[0], event.target)));
deleteButtons.forEach(button => button.addEventListener('click', event => removeItem(event.target.parentNode.parentNode)));
copyButtons.forEach(button => button.addEventListener('click', event => updateClipboard(event.target.parentNode.parentNode.children[0].textContent)));

function removeItem(node) {
    node.remove();
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