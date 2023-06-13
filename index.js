const nameInput = document.querySelector('#name-input');
const numberInput = document.querySelector('#number-input');
const form = document.querySelector('#form');
const list = document.querySelector('#list');

const getPersonas = () => {
    list.innerHTML = localStorage.getItem('yoquiera');
}
getPersonas();

//Regex
const NAME_REGEX = /^[A-Za-z ]*$/;
const TLF_REGEX = /^([0]{1})([2,4]{1})([1,2]{1})([2,4,6]{1})([0-9]{7})$/;

//gender
let gender = '';

const validation = (validation, input) => {
    console.log(validation);
    if (validation) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        input.parentElement.children[2].classList.remove('display-text');
    } else {
        input.classList.add('wrong');
        input.classList.remove('correct');
        input.parentElement.children[2].classList.add('display-text');
    }
}

nameInput.addEventListener('input', e => {
    const nameValidation = NAME_REGEX.test(e.target.value);
    validation(nameValidation, nameInput);
});

numberInput.addEventListener('input', e => {
    const numberValidation = TLF_REGEX.test(e.target.value);
    validation(numberValidation, numberInput);
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    const newPerson = {
        name: nameInput.value,
        number: numberInput.value
    }
    const responseJSON = await fetch('http://localhost:3000/contactos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nameInput.value, number: numberInput.value }),
    });

    const response = await responseJSON.json();

    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <li class= "li" id="${response.id}">
        <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        </button>
        <span>${newPerson.name}</span>
        <input id="input-contact" type="tlf" value="${newPerson.number}"readonly>
        <button class="check-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </button>
    </li>
    `;

    list.append(listItem);
    form.value = '';
    localStorage.setItem('yoquiera', list.innerHTML);
});

list.addEventListener('click', async e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.parentElement.id;
        await fetch(`http://localhost:3000/contactos/${id}`, { method: 'DELETE' });
        e.target.parentElement.remove();
        localStorage.setItem('yoquiera', list.innerHTML);
    }

    if (e.target.classList.contains('check-btn')) {
        const input = e.target.parentElement.children[2];
        if (input.hasAttribute('readonly')) {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('value', input.value);
            input.setAttribute('readonly', true);
            localStorage.setItem('yoquiera', list.innerHTML);
        }
    }
});
