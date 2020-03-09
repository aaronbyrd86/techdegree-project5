const gallery = document.getElementById("gallery");

// ----------------------------------------------
// FETCH FUNCTIONS
//-----------------------------------------------
fetch("https://randomuser.me/api/?results=12")
    .then(response => response.json())
    .then(data => data.results.forEach(person => generateCard(person)))
    
    
// ----------------------------------------------
// HELPER FUNCTIONS
//-----------------------------------------------
function generateCard(person)
{   
    const html = `
        <div class="card">
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
    generateModalBox(person);
}

function generateModalBox(person)
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
        </div>
        `;
        
        window.className = "modal-container";
        window.innerHTML = html;
        window.style.display = "none"
        document.body.appendChild(window)
}

// ----------------------------------------------
// EVENT LISTENERS
//-----------------------------------------------
gallery.addEventListener("click", event => {
    if(!event.target.classList.contains("gallery"))
    {
        const boxes = document.querySelectorAll(".modal-container");
        let clickedPerson = event.target;
        let modalBox;

        while(clickedPerson.className != "card")
        {
            clickedPerson = clickedPerson.parentElement;
        }
            
        for(let i =0; i < boxes.length; i++)
        {
            if(clickedPerson.querySelector("img").src === boxes[i].querySelector("img").src)
                modalBox = boxes[i];
        }
        
        modalBox.style.display = "block";
        modalBox.querySelector("#modal-close-btn").onclick = ()  => modalBox.style.display = "none";
        
    }
})
