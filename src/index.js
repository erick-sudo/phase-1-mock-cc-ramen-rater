// write your code here
document.addEventListener("DOMContentLoaded", event=> {
    
    fetch("http://localhost:3000/ramens")
    .then(response => response.json())
    .then(ramens => {
        viewRamenMenu(ramens[Math.floor(Math.random()*10)%ramens.length])
        ramens.forEach(item => {
            createMenuitem(item)  
        });
    })
    .catch(error => {
        console.log(error)
    })

    document.querySelector("#new-ramen").addEventListener('submit', event => {
        event.preventDefault()
        const url = event.target.image.value
        if(!(url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".jpg"))){
            event.target.image.style.border = "solid 2px red"
            return
        }

        const menuitem = {
            name: event.target.name.value,
            restaurant: event.target.restaurant.value,
            image: event.target.image.value,
            rating: event.target.rating.value,
            comment: event.target.comment.value
        }

        createMenuitem(menuitem)

        persistData(event.target)
    })
})

function viewRamenMenu(menuitem) {
    document.querySelector(".detail-image").setAttribute("src", menuitem.image)
    document.querySelector(".name").textContent = menuitem.name
    document.querySelector(".restaurant").textContent = menuitem.restaurant
    document.querySelector("#rating-display").textContent = menuitem.rating
    document.querySelector("#comment-display").textContent = menuitem.comment
}


function createMenuitem(item) {
    let ramenmenu = document.querySelector("#ramen-menu")
    const img = document.createElement("img")
    img.addEventListener('click', event => {
        viewRamenMenu(item)
    })
    img.setAttribute("src",item.image)
    ramenmenu.appendChild(img)
}

function persistData(form){

    const itemData = new FormData(form)
    const itemDataJson = Object.fromEntries(itemData.entries())

    const itemConfig = {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(itemDataJson)
        }

    fetch("http://localhost:3000/ramens", itemConfig)
    .then(response => response.json())
    .then(updatedItem => {
        viewRamenMenu(updatedItem)
        showCreationState("Menu updated succesfully")
    })
    .catch(error => {
        showCreationState("Error Creating Comment")
    })
}

function showCreationState(message){
    const state = document.createElement("div")
    const clear = document.createElement("button")
    const messagespan = document.createElement("span")

    clear.setAttribute("id", "clear")
    messagespan.textContent = message

    clear.addEventListener("click", event => {
        event.target.parentNode.remove();
    })

    state.appendChild(messagespan)
    state.appendChild(clear)

    state.setAttribute("id", "state")
    document.getElementById("serverstate").appendChild(state)
}