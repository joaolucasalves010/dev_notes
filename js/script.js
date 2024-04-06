// selecionando elementos
const addNoteBtn = document.querySelector(".add-note")

const notesContainer = document.querySelector("#notes-container")

const noteInput = document.querySelector("#note-content")

const searchInput = document.querySelector('#search-input')

const exportBtn = document.querySelector('#export-notes')

// funções
function showNotes() {
  cleanNotes()

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed)
    notesContainer.appendChild(noteElement)
  })
}

function cleanNotes() {
  notesContainer.replaceChildren([])
}

function addNote() {
  const notes = getNotes()

  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  }

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  )

  notesContainer.appendChild(noteElement)

  notes.push(noteObject)

  saveNotes(notes)

  noteInput.value = ""
}

function copyNote(id) {
  const notes = getNotes()
  const targetNote = notes.filter((note) => note.id === id)[0]
  const noteObject = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  }

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  )

  notesContainer.appendChild(noteElement)

  notes.push(noteObject)

  saveNotes(notes)
}

function generateId() {
  return Math.floor(Math.random() * 5000)
}

function createNote(id, content, fixed) {
  //     `<div class="note">
  //   <textarea placeholder="Adicione algum texto"></textarea>
  //   <i class="bi bi-pin"></i>
  //   <i class="bi bi-x-lg"></i>
  //   <i class="bi bi-file-earmark-plus"></i>
  // </div>`

  const element = document.createElement("div")

  element.classList.add("note")

  const textarea = document.createElement("textarea")

  textarea.value = content

  textarea.placeholder = "Adicione algum texto"

  element.appendChild(textarea)

  const pinIcon = document.createElement("i")

  pinIcon.classList.add(...["bi", "bi-pin"])

  element.appendChild(pinIcon)

  // evento de elemento fixed

  element.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id)
  })

  const deleteIcon = document.createElement("i")

  deleteIcon.classList.add(...["bi", "bi-x-lg"])

  element.appendChild(deleteIcon)

  // evento do elemento de remover

  deleteIcon.addEventListener("click", () => {
    deleteNote(id, element)
  })

  // criação do elemento de duplicar

  const duplicateIcon = document.createElement("i")

  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])

  element.appendChild(duplicateIcon)

  duplicateIcon.addEventListener("click", () => {
    copyNote(id)
  })

  if (fixed) {
    element.classList.add("fixed")
  }

  element.querySelector('textarea').addEventListener('keyup', (e) => {

    const noteContent = e.target.value

    updateNote(id, noteContent)

  })

  return element
}

function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id !== id)

  saveNotes(notes)

  notesContainer.removeChild(element)
}

function toggleFixNote(id) {
  const notes = getNotes()

  const targetNote = notes.filter((note) => note.id === id)[0]

  targetNote.fixed = !targetNote.fixed

  saveNotes(notes)

  showNotes()
}

const updateNote = (id, newContent) => {
  const notes = getNotes()

  const targetNote = notes.filter((note) => note.id === id)[0]

  targetNote.content = newContent

  saveNotes(notes)

}

const searchNotes = (search) => {

  const searchResults = getNotes().filter((note) => {
    return note.content.includes(search)
  })

  if (search !== "") {
    cleanNotes()

    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content)
      notesContainer.appendChild(noteElement)
    })


    return
  }
  else {
    cleanNotes()

    showNotes()
  }

}

function exportData() {
  const notes = getNotes()

  // separa o dado por , e quebra a linha pelo caractere \n

  const csvString = [
    ["ID", "Conteúdo", "Fixed"],
    ...notes.map((note) => [note.id, note.content, note.fixed])
  ].map((e) => e.join(",")).join("\n")


  const element = document.createElement('a')

  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString)

  element.target = '_blank'

  element.download = 'notes.csv'

  element.click()
}


// Ls

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes))
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]")

  const ordernedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1))

  return notes
}

// eventos
addNoteBtn.addEventListener("click", () => {
  addNote()
})

noteInput.addEventListener('keyup', (e) => {
  const tecla = e.key

  if(tecla === 'Enter') {
    addNote()
  }
})

searchInput.addEventListener('keyup', (e) => {

  const search = e.target.value

  searchNotes(search)

})

exportBtn.addEventListener('click', () => {
  exportData()
})

function showNotes() {
  cleanNotes()

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed)
    notesContainer.appendChild(noteElement)
  })
}


// inicialização
showNotes()
