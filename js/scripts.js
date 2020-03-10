const gallery = document.getElementById("gallery");
const searchContainer = document.querySelector(".search-container");
document.body.style.backgroundColor = "cornflowerblue"

searchContainer.innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`

// ----------------------------------------------
// FETCH FUNCTIONS
//-----------------------------------------------
fetch("https://randomuser.me/api/?results=12&nat=us,gb,au,ca")
    .then(response => response.json())
    .then(data => data.results.forEach((person, index) => generateCard(person, index)))
    
    
// ----------------------------------------------
// HELPER FUNCTIONS
//-----------------------------------------------
/**
 * create a card for each employee
 * @param {Object} person
 * @param {*number} index 
 */
function generateCard(person, index)
{   
    const html = `
        <div class="card" id="${index}">
            <div class="card-img-container">
                <img class="card-img" src=${person.picture.medium} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
        </div>
    `;

    gallery.innerHTML += html;
    generateModalBox(person, index);
}

/**
 * generate a modal box for each employee
 * @param {*Object} person
 * @param {*number} index 
 */
function generateModalBox(person, index)
{
    const window = document.createElement("div");
        const html = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.cell}</p>
                <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${person.dob.date}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;
        
        window.id = index;
        window.classList.add("modal-container");
        window.classList.add("match");
        window.innerHTML = html;
        window.style.display = "none"
        document.body.appendChild(window)
}
/**
 * search for a given name and hide cards that
 * arent a match
 * @param {*Object} searchInput 
 * @param {*Object} cards 
 * @param {*Object} boxes 
 */
function search(searchInput, cards, boxes)
{
  
  //handle empty searchInput
  if(searchInput.value.length == 0)
  {
    cards.forEach(card => card.style.display = "flex")
    boxes.forEach(box => box.classList.add("match"));
    return;
  }

  //find matches and hide non matches
  for(let i = 0; i < cards.length; i++)
  {
      let currentName = cards[i].querySelector("h3").textContent; 
      cards[i].classList.remove("match");
      boxes[i].classList.remove("match"); 
      
      if(searchInput.value.length != 0 && currentName.toLowerCase().includes(searchInput.value.toLowerCase()))
      {
         cards[i].classList.add("match");
         boxes[i].classList.add("match");
      }

      if(cards[i].classList.contains("match"))
      {
         cards[i].style.display = "flex";
      }
      else
      {
         cards[i].style.display = "none";
      }
  }
}

/**
* displays a new modal box and hides the currently 
* open box if necessary
* @param (Object) newModalBox - box that will be displayed
* @param (array) boxes - array of all modal boxes
* @param (number) startIndex - index of current box
*/
function displayNewBox(newModalBox, boxes, startIndex)
{
    //display box
    newModalBox.style.display = "block";
    
    //setup close btn
    newModalBox.querySelector("#modal-close-btn").onclick = ()  => {
        newModalBox.classList.add("scale-out-center");
        newModalBox.onanimationend = () => {
            newModalBox.classList.remove("scale-out-center")
            newModalBox.style.display = "none";
        };
        
        
    }

    //setup prev/next btn
    newModalBox.querySelector("#modal-prev").onclick = () => {
        if(startIndex - 1 > -1)
        {
            startIndex--;
            newModalBox.style.display = "none";
            displayNewBox(boxes[startIndex], boxes, startIndex);
        }
        else
            console.log("could not get previous box");
    };

    newModalBox.querySelector("#modal-next").onclick = () => {
        if(startIndex + 1 < boxes.length)
        {
            startIndex++;
            newModalBox.style.display = "none";
            displayNewBox(boxes[startIndex], boxes, startIndex);
        }
        else
            console.log("could not get next box");
    };
}

// ----------------------------------------------
// EVENT LISTENERS
//-----------------------------------------------
gallery.addEventListener("click", event => {
    if(!event.target.classList.contains("gallery"))
    {
        const boxes = document.querySelectorAll(".modal-container.match");
        let clickedPerson = event.target;
        let modalBox;
        let startIndex;

        while(!clickedPerson.classList.contains("card"))
        {
            clickedPerson = clickedPerson.parentElement;
        }
            
        for(let i =0; i < boxes.length; i++)
        {
            if(clickedPerson.id === boxes[i].id) {
                modalBox = boxes[i];
                startIndex = i;
            }
                
        }
        
        displayNewBox(modalBox, boxes, startIndex)
    }
})

searchContainer.addEventListener("submit", event => {
    const cards = document.querySelectorAll(".card");
    const boxes = document.querySelectorAll(".modal-container");
    const searchInput = document.getElementById("search-input");
    
    search(searchInput, cards, boxes);
})

searchContainer.addEventListener("keyup", event => {
    const cards = document.querySelectorAll(".card");
    const boxes = document.querySelectorAll(".modal-container");
    const searchInput = document.getElementById("search-input");
    
    search(searchInput, cards, boxes);
})
