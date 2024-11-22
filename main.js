const mockNotes = [
    { id: 1, title: "Flexbox (CSS)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "yellow", isFavorite: true, isHidden: false },
    { id: 2, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "red", isFavorite: false, isHidden: false },
    { id: 3, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "pink", isFavorite: false, isHidden: false }
]

const myStorage = window.sessionStorage;
// myStorage.notes = model.notes
const model = {
    notes: JSON.parse(myStorage.getItem('notes')) || [],
    addNote(noteTitle, noteText, noteColor) {
        this.notes.unshift({ id: Math.random(), title: noteTitle, text: noteText, color: noteColor, isFavorite: false, isHidden: false })
        this.saveNotes()
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId)
        this.saveNotes()
    },
    toggleFavorite(noteId) {
        this.notes.forEach((note) => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite
            }
            return note;
        })
        this.saveNotes()
    },
    showFavorite() {
        this.notes.forEach((note) => {
            if (!note.isFavorite) {
                note.isHidden = true;
            }
        })
        this.saveNotes()
    },
    showAllNotes() {
        this.notes.forEach((note) => note.isHidden = false)
        this.saveNotes()
    },
    saveNotes() {
        myStorage.setItem('notes', JSON.stringify(this.notes));
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)
        controller.showAllNotes();

        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title')
        const inputText = document.querySelector('.input-text')
        const notesList = document.querySelector('.list')
        const favoriteListToggle = document.querySelector('.checkbox-input')
        const colorsList = document.querySelector('.colors-list')
        let text = "";
        let type = "";

        colorsList.addEventListener('click', (e) => {
            const selectedColor = colorsList.querySelector('.select-color');
            if (e.target.classList.contains('circle')) {
                if (!selectedColor) {
                    e.target.parentElement.classList.add('select-color')
                }
                else {
                    selectedColor.classList.remove('select-color')
                    e.target.parentElement.classList.add('select-color')
                }
            }
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedColor = e.target.querySelector('.select-color');
            let noteColor = ''
            if (selectedColor) {
                noteColor = selectedColor.firstElementChild.id
            }
            const noteTitle = inputTitle.value;
            const noteText = inputText.value;
            if (!noteTitle || !noteText) {
                text = 'Заполните все поля';
                type = 'message-warning';
            }
            else if (noteTitle.length > 50) {
                type = 'message-warning';
                text = 'Максимальная длина заголовка - 50 символов';
                // view.showMessage(type, text);
            }
            else {
                noteText.trim();
                noteTitle.trim();
                type = 'message';
                text = 'Заметка добавлена';
                controller.addNote(noteTitle, noteText, noteColor)
                // view.showMessage(type, text);
                inputTitle.value = '';
                inputText.value = '';
                if (selectedColor) {
                    selectedColor.classList.remove('select-color')
                }
                favoriteListToggle.checked = false;
                controller.showAllNotes();
            }
            this.showMessage(type, text);
        })

        favoriteListToggle.addEventListener('click', () => {
            if (favoriteListToggle.checked) {
                controller.showFavorite();
            }
            else if (!favoriteListToggle.checked) {
                controller.showAllNotes();
            }

        })

        notesList.addEventListener('click', (e) => {
            const noteId = +e.target.closest('li').id
            if (e.target.classList.contains('delete-button')) {
                type = 'message';
                text = "Заметка удалена";
                this.showMessage(type, text);
                controller.deleteNote(noteId)
            }
            else if (e.target.classList.contains('favorite-check')) {
                controller.toggleFavorite(noteId);
                if (favoriteListToggle.checked) {
                    controller.showFavorite();
                }
            }
        })
    },

    renderNotes(notes) {
        const notesList = document.querySelector('.list')
        const emptyList = document.querySelector('.empty-list')
        emptyList.innerHTML = "";
        if (!notes.length) {
            emptyList.innerHTML = `У вас нет ещё ни одной заметки.<br>
            Заполните поля выше и создайте свою первую заметку!`
        }
        let notesListHTML = '';
        notes.forEach((note) => {
            notesListHTML += `<li id = '${note.id}' class = "${note.isHidden ? 'hidden note' : 'note'}"> 
            <div class = "note-header ${note.color ? note.color : 'yellow'}">
                <p class = 'note-title'>${note.title}</p> 
                <div class = 'buttons'>
                    <input class="favorite-check" type="checkbox" ${note.isFavorite ? 'checked' : 'unchecked'}> 
                    <button class="delete-button" type="button"></button>
                </div>
            </div>
            <div  class = 'note-text' >${note.text}</div>
                </li>`
        });
        notesList.innerHTML = notesListHTML;
        this.notesCounterUpdate(notes)
    },
    notesCounterUpdate(notes) {
        document.querySelector('.count').textContent = notes.length
    },
    showMessage(type, text) {
        const messageBox = document.querySelector('.message-box')
        // messageBox.classList.add(`${type}`)
        const message = document.createElement('div');
        message.classList.add('message', type);
        message.innerHTML = `
            <img src="${type === 'message' ? 'assets/images/Done.svg' : 'assets/images/warning.svg'}" alt="warning">
            <span>${text}</span>`
        messageBox.prepend(message)
        setTimeout(() => {
            message.remove()
        }, 3000)
    }
}

const controller = {
    addNote(noteTitle, noteText, noteColor) {
        model.addNote(noteTitle, noteText, noteColor);
        view.renderNotes(model.notes)
    },
    deleteNote(noteId) {
        model.deleteNote(noteId);
        view.renderNotes(model.notes);
    },
    toggleFavorite(noteId) {
        model.toggleFavorite(noteId)
        view.renderNotes(model.notes)
    },
    showFavorite() {
        model.showFavorite();
        view.renderNotes(model.notes)
    },
    showAllNotes() {
        model.showAllNotes();
        view.renderNotes(model.notes)
    }
}

function init() {
    view.init()
}
init();