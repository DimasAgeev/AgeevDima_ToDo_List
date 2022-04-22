let app = document.querySelector(".container");
let form = document.createElement("form");
app.append(form);

// //CreateElement////////////////////////////////////////////////////////
function createElement(tag, className, text) {
  let el = document.createElement(tag);
  className ? el.classList.add(className) : null;
  text ? (el.innerText = text) : null;
  return el;
}
//CreateInput/////////////////////////////////////////////////////////////
function createInput(className, type, placeholdertext) {
  let el = document.createElement("input");
  className ? el.classList.add(className) : null;
  el.setAttribute("type", type);
  el.setAttribute("placeholder", placeholdertext);
  return el;
}
//Enter toDO////////////////////////////////////////////////////////////////
let form_content = createElement("div", "form_content");
form.append(form_content);
let content_inner = createElement("div", "content_inner");
form_content.append(content_inner);
let button_delete_all = createElement("button", "delete_all", "Delete All");
button_delete_all.setAttribute("type", "button");
content_inner.append(button_delete_all);
let button_delete_Last = createElement("button", "delete_last", "Delete Last");
button_delete_Last.setAttribute("type", "button");
content_inner.append(button_delete_Last);
let input_enter_todo = createInput("enter_todo", "text", "Enter todo");
content_inner.append(input_enter_todo);
let button_add = createElement("button", "add", "Add");
button_add.setAttribute("type", "button");
content_inner.append(button_add);
//Search////////////////////////////////////////////////////////////////////////
let content_inner_second = createElement("div", "content_inner");
form_content.append(content_inner_second);
let text_all = createElement("p", "", "All: ");
content_inner_second.append(text_all);
let number_all = createElement("span", "number_all", "0");
text_all.append(number_all);
let text_completed = createElement("p", "", "Completed: ");
content_inner_second.append(text_completed);
let number_completed = createElement("span", "number_completed", "0");
text_completed.append(number_completed);
let show_all = createElement("button", "show_all", "Show All");
show_all.setAttribute("type", "button");
content_inner_second.append(show_all);
let show_completed = createElement(
  "button",
  "show_completed",
  "Show Completed"
);
show_completed.setAttribute("type", "button");
content_inner_second.append(show_completed);
let input_search = createInput("search", "text", "Search");
content_inner_second.append(input_search);
//СreateСommonСontainerForCards////////////////////////////////////////////////////////////////////////
let listContent = createElement("div", "list_content", "");
//CreaterEmtyArray///////////////////////////////////////////////////////////////////
let cardArray = [];
//CreaterObject/////////////////////////////////////////////////////////////////////
function createObject(id, content, date) {
  let cardObj = {
    id: id,
    content: content,
    date: date,
    status: "neutral",
  };
  return cardObj;
}
//GetDate/////////////////////////////////////////////////////////////////////////////////////
function getDate() {
  let date = new Date();
  return `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}\n ${date.getHours()}:${date.getMinutes()}`;
}
//GetContentFromInput//////////////////////////////////////////////////////////////////////////
function getContent() {
  if (input_enter_todo.value !== "") {
    let content = input_enter_todo.value;
    return content;
  }
}
//GetUniqueIdFromLocalStorage//////////////////////////////////////////////////////////////
function getUniqueId() {
  let uniqueId = Number(localStorage.getItem("UniqueId"));
  return uniqueId ? uniqueId : 0;
}
//SaveToLocalStoragecardArray/////////////////////////////////////////////////////////////////////
function saveCardArray(cardArray) {
  let cardArrayPush = JSON.stringify(cardArray);
  localStorage.setItem("cardArray", cardArrayPush);
}
//ObjectFillingAndPushToArray//////////////////////////////////////////////////////////////////////////
function createCard() {
  let id = getUniqueId() + 1;
  let content = getContent();
  let date = getDate();
  let object = createObject(id, content, date);
  cardArray.push(object);
  saveCardArray(cardArray);
  localStorage.setItem("UniqueId", id);
}
//CreateLinkCard////////////////////////////////////////////////////////////////////////
function createList() {
  let content_inner_background = createElement(
    "div",
    "content_inner_background"
  );
  listContent.append(content_inner_background);
  let input_checkbox = createInput("checkbox", "checkbox", "");
  content_inner_background.append(input_checkbox);
  let input_todo_text = createElement("p", "todo_text", "");
  content_inner_background.append(input_todo_text);
  let content_date = createElement("div", "content_date", "");
  content_inner_background.append(content_date);
  let button_cross = createElement("button", "cross", "X");
  button_cross.setAttribute("type", "button"); /////////////////
  content_date.append(button_cross);
  let input_date = createElement("p", "date", "");
  content_date.append(input_date);
  form_content.append(listContent);
}
///GetContentFromLocalStorage///////////////////////////////////////////////////////////////////
function getContentFromLocal(el, card) {
  let p = card.querySelector(".todo_text");
  let cardContent = el.content;
  p.innerText = cardContent;
}
///GetDateFromLocalStorage//////////////////////////////////////////////////////////////////////
function getDateFromLocal(el, card) {
  let p = card.querySelector(".date");
  let cardDate = el.date;
  p.innerText = cardDate;
}
///AppropriationData-idToCard//////////////////////////////////////////////////////////////////////
function dataIdToCard(el, card) {
  let id = el.id;
  card.setAttribute("data-id", id);
}
//CangeCardStatus/////////////////////////////////////////////////////////////////////////////
function selectLink(event) {
  if (event.target.className === "checkbox") {
    let input = event.target;
    let dataId = input
      .closest(".content_inner_background")
      .getAttribute("data-id");
    cardArray.forEach((el) => {
      if (el.id == dataId) {
        input.checked ? (el.status = "checked") : (el.status = "neutral");
      }
    });
    saveCardArray(cardArray);
    getLocalCardArray(cardArray);
    render(cardArray);
  }
}
form_content.addEventListener("click", (e) => selectLink(e));
//GetFromLocalCardArray/////////////////////////////////////////////////////////////////////
function getLocalCardArray(cardArray) {
  cardArray = JSON.parse(localStorage.getItem("cardArray"));
  return cardArray;
}
//AddLinkCardAfterEvent-'Add'///////////////////////////////////////////
let addBtn = document.querySelector(".add");
addBtn.addEventListener("click", () => {
  createCard();
  saveCardArray(cardArray);
  getLocalCardArray(cardArray);
  render(cardArray);
});

// Render///////////////////////////////////////////////////////////////////////////////
function render(array) {
  listContent.innerHTML = "";
  if (array.status != "deleted") {
    array.forEach((el) => {
      if (el.status == "checked" || el.status == "neutral") {
        createList();
        let currentCard = listContent.lastChild;
        getDateFromLocal(el, currentCard);
        getContentFromLocal(el, currentCard);
        dataIdToCard(el, currentCard);
        el.status == "checked"
          ? (currentCard.querySelector(".checkbox").checked = "true")
          : null;
        input_enter_todo.value = "";
        getNumberAllCard();
        getNumberCompletedCard();
        select();
      }
      listContent.scrollTop = listContent.scrollHeight;
    });
  }
}
//DeleteAllLinkCardAfterEvent-'Delete All'; ///////////////////////////////////////////
let deleteAllBtn = document.querySelector(".delete_all");
deleteAllBtn.addEventListener("click", () => {
  cardArray.forEach((el) => {
    if (el.status == "checked" || el.status == "neutral") {
      el.status = "deleted";
    }
    saveCardArray(cardArray);
    render(cardArray);
    getNumberAllCard();
    getNumberCompletedCard();
  });
});
//DeleteLinkCardAfterEvent-'X'; ///////////////////////////////////////////
listContent.addEventListener("click", (e) => {
  if (e.target.className == "cross") {
    let idCard = e.target
      .closest(".content_inner_background")
      .getAttribute("data-id");
    cardArray.forEach((el) => {
      if (el.id == idCard) {
        el.status = "deleted";
      }
      saveCardArray(cardArray);
      render(cardArray);
      getNumberAllCard();
      getNumberCompletedCard();
    });
  }
});
//DeleteLastLinkCardAfterEvent-'Delete Last'; ///////////////////////////////////////////
form_content.addEventListener("click", (e) => {
  if (e.target.className == "delete_last") {
    let idLastCard = listContent.lastChild.getAttribute("data-id");
    cardArray.forEach((el) => {
      if (el.id == idLastCard) {
        el.status = "deleted";
      }
      saveCardArray(cardArray);
      render(cardArray);
      getNumberAllCard();
      getNumberCompletedCard();
    });
  }
});
//ShowAllLinkCardAfterEvent-'ShowAll'; ///////////////////////////////////////////
let showAllBtn = document.querySelector(".show_all");
showAllBtn.addEventListener("click", () => {
  let localCardArray = getLocalCardArray(cardArray);
  localCardArray ? (cardArray = localCardArray) : (cardArray = []);
  render(cardArray);
});
//ShowCompletedCardAfterEvent-'ShowCompleted'; ///////////////////////////////////////////
let showCompletedBtn = document.querySelector(".show_completed");
showCompletedBtn.addEventListener("click", () => {
  let localCardArray = getLocalCardArray(cardArray);
  localCardArray ? (cardArray = localCardArray) : (cardArray = []);
  let completedArray = cardArray.filter((el) => el.status === "checked");
  render(completedArray);
});
//GetNumberAll//////////////////////////////////////////////////////////////////////////////
let numberAll = document.querySelector(".number_all");
function getNumberAllCard() {
  let numberAllCard = 0;
  cardArray.forEach((el) => {
    if (el.status != "deleted") {
      ++numberAllCard;
    }
    numberAll.innerText = numberAllCard;
  });
}
//GetNumberCompleted//////////////////////////////////////////////////////////////////////////////
let numberCompleted = document.querySelector(".number_completed");
function getNumberCompletedCard() {
  let numberCompletedCard = 0;
  cardArray.forEach((el) => {
    if (el.status == "checked") {
      ++numberCompletedCard;
    }
    numberCompleted.innerText = numberCompletedCard;
  });
}
//SelectionsTextAndBackground/////////////////////////////////////////////////////////
function select() {
  let cards = document.querySelectorAll(".content_inner_background");
  cards.forEach((el) => {
    let input = el.querySelector(".checkbox");
    let p = el.querySelector(".todo_text");

    if (input.checked) {
      p.classList.add("active_todo_text");
      el.classList.add("active_content_inner_background");
    } else {
      p.classList.remove("active_todo_text");
      el.classList.remove("active_content_inner_background");
    }
  });
}

//Search////////////////////////////////////////////////////////////////////////////////
let inputSearch = document.querySelector(".search");
inputSearch.addEventListener("input", (e) => {
  let valueInput = e.target.value;
  let searchArray = cardArray.filter((el) =>
    el.content.toLowerCase().includes(valueInput)
  );
  render(searchArray);
});
////////
window.addEventListener("load", () => {
  let localCardArray = getLocalCardArray(cardArray);
  localCardArray ? (cardArray = localCardArray) : (cardArray = []);
  render(cardArray);
});

//SelectionCard///////////////////////////////////////////
// function selectLink(event) {
//   if (event.target.className === "checkbox") {
//     event.target.closest(".content_inner_background").classList.add("active");
//   }
// }
// form_content.addEventListener("change", selectLink);
