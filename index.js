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
    console.log(response);

    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <li class= "li" id="${response.id}">
        <button class="delete-btn">❌</button>
        <span>${newPerson.name}</span>
        <input id="input-contact" type="tlf" value="${newPerson.number}"readonly>
        <button class="check-btn">✓</button>
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
