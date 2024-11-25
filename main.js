const mockNotes = [
    { id: 1, title: "Flexbox (CSS)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "yellow", isFavorite: true, isHidden: false },
    { id: 2, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "red", isFavorite: false, isHidden: false },
    { id: 3, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "pink", isFavorite: false, isHidden: false }
]

const messages = {
    deleteMessage: {
        text: 'Заметка удалена',
        image: 'assets/images/Done.svg'
    },
    addMessage: {
        image: 'assets/images/Done.svg',
        text: 'Заметка добавлена'
    },
    messageWarning: {
        image: 'assets/images/warning.svg',
        class: 'message-warning',
        text: 'Заполните все поля'
    },
    messageWarningLength: {
        image: 'assets/images/warning.svg',
        class: 'message-warning',
        text: 'Максимальная длина заголовка - 50 символов'
    }
}

const myStorage = window.sessionStorage;
// myStorage.notes = model.notes
const model = {
    notes: JSON.parse(myStorage.getItem('notes')) || [],
    addNote(noteTitle, noteText, noteColor) {
        this.notes.unshift({ id: Math.random(), title: noteTitle, text: noteText, color: noteColor, isFavorite: false })
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
    toggleShowFavorite(isShowOnlyFavorite) {
        if (isShowOnlyFavorite) {
            return this.notes.filter(note => note.isFavorite);
        }
        else{
            return this.notes;
        }
    },
    saveNotes() {
        myStorage.setItem('notes', JSON.stringify(this.notes));
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title')
        const inputText = document.querySelector('.input-text')
        const notesList = document.querySelector('.list')
        const favoriteListToggle = document.querySelector('.checkbox-input')
        const colorsList = document.querySelector('.colors-list')

        colorsList.addEventListener('click', (e) => {
            const selectedColor = colorsList.querySelector('.select-color');
            if (e.target.classList.contains('circle')) {
                selectedColor.classList.remove('select-color')
                e.target.parentElement.classList.add('select-color')
            }
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedColor = e.target.querySelector('.select-color');
            const noteColor = selectedColor.firstElementChild.id
            const noteTitle = inputTitle.value;
            const noteText = inputText.value;
            const isNoteAdded = controller.addNote(noteTitle, noteText, noteColor)
            if (isNoteAdded) {
                inputTitle.value = '';
                inputText.value = '';
            }
            if (selectedColor) {
                const yellow = document.querySelector('.yellow')
                selectedColor.classList.remove('select-color')
                yellow.parentElement.classList.add('select-color')
            }
            favoriteListToggle.checked = false;
        })

        favoriteListToggle.addEventListener('click', () => {
            const isShowOnlyFavorite = favoriteListToggle.checked;
            controller.toggleShowFavorite(isShowOnlyFavorite)
        })

        notesList.addEventListener('click', (e) => {
            const noteId = +e.target.closest('li').id
            if (e.target.classList.contains('delete-button')) {
                controller.deleteNote(noteId)
            }
            else if (e.target.classList.contains('favorite-check')) {
                controller.toggleFavorite(noteId);
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
            notesListHTML += `<li id = '${note.id}' class = 'note'> 
            <div class = "note-header ${note.color}">
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
    showMessage(messageType) {
        const messageBox = document.querySelector('.message-box')
        const message = document.createElement('div');
        message.classList.add('message', messageType.class);
        message.innerHTML = `
            <img src= '${messageType.image}'>
            <span>${messageType.text}</span>`
        messageBox.prepend(message)
        setTimeout(() => {
            message.remove()
        }, 3000)
    }
}

const controller = {
    addNote(noteTitle, noteText, noteColor) {
        noteTitle = noteTitle.trim();
        noteText = noteText.trim();
        if (!noteTitle || !noteText) {
            view.showMessage(messages.messageWarning)
            return false;
        }
        else if (noteTitle.length > 50) {
            view.showMessage(messages.messageWarningLength);
            return false;
        }
        else {
            model.addNote(noteTitle, noteText, noteColor);
            view.showMessage(messages.addMessage);
            view.renderNotes(model.notes)
            return true;
        }
    },
    deleteNote(noteId) {
        model.deleteNote(noteId);
        view.renderNotes(model.notes);
        view.showMessage(messages.deleteMessage)
    },
    toggleFavorite(noteId) {
        model.toggleFavorite(noteId)
        view.renderNotes(model.notes)
    },
    toggleShowFavorite(isShowOnlyFavorite) {
        view.renderNotes(model.toggleShowFavorite(isShowOnlyFavorite))
    }
}

function init() {
    view.init()
}
init();