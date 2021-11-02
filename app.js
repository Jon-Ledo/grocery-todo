// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement;
let editFlag = false // true when edit btn is clicked
let editId = ''

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem)
// clear the form
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems)

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString() // quick way to get unique id
  
  if (value && !editFlag) {
    createListItem(id, value)
    // display Alert
    displayAlert('item added to the list', 'success')
    // display item
    container.classList.add('show-container')
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefault()
  }
  else if(value && editFlag) {
    editElement.innerHTML = value
    displayAlert('value changed', 'success')
    // editLocalStorage
    editLocalStorage(editId, value)
    setBackToDefault()
  }
  else {
    displayAlert('please enter value', 'danger')
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(function() {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  },1000)
}

// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item')

  if (items.length > 0) {
    items.forEach(item => {
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('emptied the list', 'danger')
  setBackToDefault()
  localStorage.removeItem('list')
}

//delete function
function deleteItem (e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)

  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }

  displayAlert('item removed', 'danger')
  setBackToDefault()
  removeFromLocalStorage(id)
}
// edit function
function editItem (e) {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item (previously created list item)
  editElement = e.currentTarget.parentElement.previousElementSibling
  //set input value to match item
  grocery.value = editElement.innerHTML
  editFlag = true
  editId = element.dataset.id
  submitBtn.textContent = "edit"
}
// set to default
function setBackToDefault() {
  grocery.value = ''
  editFlag = false
  editId = ''
  submitBtn.textContent = 'submit'
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = {id: id, value: value}
  // const grocery = {id, value} <-- shorthand if both key and value are the same in ES6
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage()
  items = items.filter(item => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
  let items = getLocalStorage()
  items = items.map(item => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list')) 
    : [] 
}

// localStorage API
// setItem
// getItem
// removeItem
// save as strings

// ****** SETUP ITEMS **********
function setupItems () {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach(item => {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem (id, value) {
  const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attribute = document.createAttribute('data-id')
    attribute.value = id
    element.setAttributeNode(attribute)
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
      <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`

    // NOTE the event listeners for the delete and edit buttons do not exist on page load, therefore we must create the event listeners and query the variables within this section
    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)

    // append child
    list.appendChild(element)
}