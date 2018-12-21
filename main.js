//VARIABLES

//INPUT VARIABLES
var titleInput = document.getElementById("title");
var bodyInput = document.getElementById("body");

//BUTTON VARIABLES
var saveBtn = document.getElementById("save");
var upvoteBtn = document.querySelector(".upvote");
var downvoteBtn = document.querySelector(".downvote");
var deleteBtn = document.querySelector(".delete");
var searchBtn = document.getElementById("searchBtn");

//ARRAY VARIABLE
var arrayOfIdeas = [];
var qualityArray = ["Swill", "Plausible", "Genius"]

//AREA VARIABLE
var cardsArea = document.querySelector(".cards-section");

//SEARCH BOX VARIABLE
var searchField = document.getElementById("search");

//CARD
var card = document.querySelector(".card")
var cardTitle = document.querySelector(".card-title");
var bodyText = document.querySelector(".body-text");


///////////////////////////////////////////////
//EVENT LISTENERS

searchField.addEventListener('input', searchFunction);

saveBtn.addEventListener('click', saveFunction);

cardsArea.addEventListener('click', deleteCard);

window.addEventListener('load', pageLoad);

cardsArea.addEventListener('dblclick', editCard)

///////////////////////////////////////////////
//FUNCTIONS

function editCard(event){
  event.target.contentEditable = true;

  document.body.addEventListener('keypress', function (e) {
    var key = e.keyCode;
    if (key === 13) {
      event.target.contentEditable = false;
      var index = parseInt(event.target.parentElement.dataset.id);
      var ideaTarget = arrayOfIdeas.find(function(idea) {
        return idea.id === index;
      })
      if (event.target.classList.contains("card-title")) {
        ideaTarget.updateContent(event.target.innerText, "name")
      } else if (event.target.classList.contains("body-text")) {
        ideaTarget.updateContent(event.target.innerText, "content")
      }
      ideaTarget.saveToStorage(arrayOfIdeas)
    }
  });
}

function deleteCard(){
  var oldIdea = new Idea("", "", event.target.parentElement.parentElement.dataset.id);
  if (event.target.className === "delete") {
    event.target.parentElement.parentElement.remove();
    oldIdea.deleteFromStorage(oldIdea.id);
  }
}

function saveFunction() {
  // SAVE IDEA
  id = Date.now();
  var quality = 0;
  var newIdea = new Idea(titleInput.value, bodyInput.value, id, quality);
  arrayOfIdeas.push(newIdea);
  newIdea.saveToStorage(arrayOfIdeas);
  newIdeaCard(newIdea);
  titleInput.value = "";
  bodyInput.value = "";
}


function pageLoad(){
// CREATE CARDS ON PAGE LOAD
//recreate new instances on page load
  if (localStorage.hasOwnProperty("savedIdeas")){
    var localStorageArray = JSON.parse(localStorage.getItem("savedIdeas"));
    localStorageArray.forEach(function(element,index){
      var newIdea = new Idea(element.name, element.content, element.id, element.quality);
      newIdeaCard(element);
      arrayOfIdeas.push(newIdea)
    });
  }
}

function newIdeaCard(idea) {
// CREATE CARD
var cardSection = document.querySelector(".cards-section");
cardSection.insertAdjacentHTML('afterbegin', 
  `<article data-id=${idea.id} class="card">
  <h2 contenteditable="false" class = "card-input card-title">${idea.name}</h2>
  <p contenteditable="false" class = "card-input body-text">${idea.content}</p>
  <div>
  <img class="downvote" onclick="updateQuality(-1)" src="assets/downvote.svg">
  <img class="upvote" onclick="updateQuality(1)" src="assets/upvote.svg">
  <p class="quality">Quality: ${qualityArray[idea.quality]}</p>
  <img class="delete" src="assets/delete.svg">
  </div>
  </article>`
  );
}

// cardsArea.addEventListener('click', updateQuality);
// upvoteBtn.addEventListener('click', updateQuality);

 // console.log("hello")
 //  if (event.target.className === "downvote") {

function updateQuality(num) {
    var index = parseInt(event.target.parentElement.parentElement.dataset.id);
    var qualityTarget = arrayOfIdeas.find(function(idea) {
      return idea.id === index;
    })
    var qualityText = event.target.nextSibling.nextElementSibling.innerText;
    if (num === 1) {
      qualityTarget.quality++;
      console.log(qualityTarget.quality)
      console.log(qualityText)
    } else if (num === -1) {
      qualityTarget.quality--;
    }
    if (qualityTarget.quality === 1) {
      qualityText = qualityArray[1];
      console.log(qualityText)
    } else if (qualityTarget.quality === 2){
      qualityText = qualityArray[2];
      console.log(qualityText)
    } else if (qualityTarget.quality === 0)
      qualityText = qualityArray[0];
      console.log(qualityText)
  }

   // if (counter >= 2) {
 //   this.quality = 'Genius'
 //  } else if (counter = 1) {
 //   this.quality = 'Plausible'
 //  } else {
 //   this.quality = 'Swill'
 //  }

  // var index = parseInt(event.target.parentElement.dataset.id);

  // get the object find
  // arrayOfIdeas

  // counter += num;
  // If this element has class of upvote, allow this, if the element has a class of downvote, do this

  // thisElement.nextElementSibling.innerHTML = qualityArray[counter];


function searchFunction() {
//SEARCH FUNCTION
  var localStorageArray = JSON.parse(localStorage.getItem("savedIdeas"));
  cardsArea.innerHTML = "";
  var toFind = searchField.value;
  var filteredIdeas = localStorageArray.filter(function(idea) {
    return idea.name.includes(toFind) || idea.content.includes(toFind);
  })
  filteredIdeas.forEach(function(element){
    var newIdea = new Idea(element.name, element.content, element.id, element.quality);
    newIdeaCard(element);
  })
}
