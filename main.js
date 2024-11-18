const mockNotes = [
    { id: 1, title: "Flexbox (CSS)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "yellow", isFavorite: true, isHidden: false },
    { id: 2, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "red", isFavorite: false, isHidden: false },
    { id: 3, title: "Объекты (JavaScript)", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", color: "pink", isFavorite: false, isHidden: false }
]

const model = {
    notes: [],
    addNote(noteTitle, noteText, noteColor) {
        this.notes.unshift({ id: Math.random(), title: noteTitle, text: noteText, color: noteColor, isFavorite: false, isHidden: false })
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId)
    },
    toggleFavorite(noteId) {
        this.notes.map((note) => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite
            }
        })
        // const note = this.notes.find((note) => note.id === noteId);
        // if (note) {
        //     note.isFavorite = !note.isFavorite;
        // } нам нужен 1 элемент
    },
    showFavorite() {
        this.notes.map((note) => {
            if (!note.isFavorite) {
                note.isHidden = true;
            }
        })
    },
    showAllNotes() {
        this.notes.forEach((note) => note.isHidden = false)
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
        const favoriteListToggle = document.querySelector('.checkbox-input')
        const colorsList = document.querySelector('.color')

        colorsList.addEventListener('click', (e) => {
            const selectedColor = colorsList.querySelector('.select-color');
            if (e.target.classList.contains('circle')) {
                if (selectedColor) {
                    selectedColor.classList.remove('select-color')
                }
                e.target.classList.add('select-color')
            }
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedColor = e.target.querySelector('.select-color');
            let noteColor = ''
            if (selectedColor) {
                noteColor = selectedColor.id
            }
            const noteTitle = inputTitle.value;
            const noteText = inputText.value;
            if (noteTitle && noteText && noteTitle.length <= 50) {
                noteText.trim();
                noteTitle.trim();
                messageBox.textContent = "Заметка добавлена" // спорный моментик
                controller.addNote(noteTitle, noteText, noteColor)
                inputTitle.value = '';
                inputText.value = '';
                if (selectedColor) { selectedColor.classList.remove('select-color') }
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

        favoriteListToggle.addEventListener('click', () => {
            if (favoriteListToggle.checked) {
                controller.showFavorite();
                // console.log("check");
            }
            else if (!favoriteListToggle.checked) {
                // console.log("uncheck");
                controller.showAllNotes();
            }
        })

        notesList.addEventListener('click', (e) => {
            const noteId = +e.target.closest('li').id
            if (e.target.classList.contains('delete-button')) {
                messageBox.textContent = "Заметка удалена";
                setTimeout(() => {
                    messageBox.textContent = ''
                }, 3000)
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

        if (!notes.length) {
            emptyList.innerHTML = `У вас нет еще ни одной заметки<br>
            Заполните поля выше и создайте свою первую заметку!`
            // return;
        }
        else {
            emptyList.innerHTML = ""
            let notesListHTML = notes.map((note) =>
                `<li id = '${note.id}' class = "${note.isHidden ? 'hidden note' : 'note'}"> 
                <div class = "${note.color ? note.color : 'yellow'} note-header">
                    <p class = 'note-title'>${note.title}</p> 
                    <div class = 'buttons'>
                        <input class="favorite-check" type="checkbox" ${note.isFavorite ? 'checked' : 'unchecked'}> 
                        <button class="delete-button" type="button"></button>
                    </div>
                </div>
                <div  class = 'note-text' >${note.text}</div>
                    </li>`
            ).join('');
            notesList.innerHTML = notesListHTML;
            this.notesCounterUpdate(notes)
        }

    },

    notesCounterUpdate(notes) {
        document.querySelector('.count').textContent = notes.length
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

// Вынести сообщения в отдельную функцию
// this.showMessage(
//     noteTitle.length > 50
//         ? 'Максимальная длина заголовка - 50 символов'
//         : 'Заполните все поля',
//     3000
// );
// }
// },

// showMessage(message, duration) {
//     this.dom.messageBox.textContent = message;
//     if (duration) {
//         setTimeout(() => {
//             this.dom.messageBox.textContent = '';
//         }, duration);
//     }
// },