const deleteButtons = document.querySelectorAll('.button_delete');
const copyButtons = document.querySelectorAll('.button_copy');

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
