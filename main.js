const mockNotes = [
    { id: 1, title: "Flexbox (CSS)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: 1, isFavorite: true },
    { id: 2, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: 2, isFavorite: false },
    { id: 3, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: 2, isFavorite: false }
]

const model = {
    notes: mockNotes,
    addNote(noteTitle, noteText) {
        this.notes.unshift({ id: Math.random(), title: noteTitle, text: noteText, isFavorite: false })
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId)
    },
    toggleFavorite(noteId) {
        this.notes.forEach((note) => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite
            }
            return note;
        })
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title')
        const inputText = document.querySelector('.input-text')
        const notesList = document.querySelector('.list')
        const messageBox = document.querySelector('.message-box')

        notesList.addEventListener('click', (e) => {
            const noteId = +e.target.closest('li').id
            console.log(noteId);
            if (e.target.classList.contains('delete-button')) {
                messageBox.textContent = "Заметка удалена";
                setTimeout(() => {
                    messageBox.textContent = ''
                }, 3000)
                controller.deleteNote(noteId)
            }
            else if (e.target.classList.contains('favorite-button')) {
                controller.toggleFavorite(noteId)
            }
        })

        form.addEventListener('submit', (e) => {
            if (e.target.classList.contains('circle')) {
            }
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const noteTitle = inputTitle.value;
            const noteText = inputText.value;
            if (noteTitle && noteText && noteTitle.length <= 50) {
                noteText.trim();
                noteTitle.trim();
                messageBox.textContent = "Заметка добавлена" // спорный моментик
                controller.addNote(noteTitle, noteText)
                inputTitle.value = '';
                inputText.value = '';
            }
            else if (noteTitle.length > 50) {
                messageBox.textContent = "Максимальная длина заголовка - 50 символов"
            }
            else {
                messageBox.textContent = "Заполните все поля" // спорный моментик
            }

            setTimeout(() => {
                messageBox.textContent = ''
            }, 3000) // спорный моментик
        })
    },
    renderNotes(notes) {
        const notesList = document.querySelector('.list')
        const emptyList = document.querySelector('.empty-list')

        if (!notes.length) {
            emptyList.innerHTML = `У вас нет еще ни одной заметки<br>
            Заполните поля выше и создайте свою первую заметку!`
        }
        let notesListHTML = '';
        notes.forEach((note) => {
            notesListHTML += `<li id = '${note.id}' class = 'note'> 
            <div class = "${note.isFavorite ? 'note-header favorite' : 'note-header'}">
                <p class = 'note-title'>${note.title}</p> 
                <div class = 'buttons'>
                    <input class="favorite-check" type="checkbox" > 
                    <button class="delete-button" type="button"></button>
                </div>
            </div>
            <div  class = 'note-text' >${note.text}</div>
                </li>`
        });
        notesList.innerHTML = notesListHTML;
    }
}

const controller = {
    addNote(noteTitle, noteText) {
        model.addNote(noteTitle, noteText);
        view.renderNotes(model.notes)
    },
    deleteNote(noteId) {
        model.deleteNote(noteId);
        view.renderNotes(model.notes);
    },
    toggleFavorite(noteId) {
        model.toggleFavorite(noteId)
        view.renderNotes(model.notes)
    }

}

function init() {
    view.init()
}
init();