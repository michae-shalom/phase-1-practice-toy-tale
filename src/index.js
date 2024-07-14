let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const toyCollection = document.getElementById('toy-collection');

  // Fetch toys from the API
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        // Create card for each toy
        const card = document.createElement('div');
        card.className = 'card';

        // Populate card with toy information
        card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;

        // Append card to toy collection
        toyCollection.appendChild(card);

        // Add event listener to like button
        const likeButton = card.querySelector('.like-btn');
        likeButton.addEventListener('click', () => handleLikeToy(toy));
      });
    });
});
document.addEventListener('DOMContentLoaded', function() {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  // Function to handle toy creation form submission
  toyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve input values
    const name = toyForm.name.value;
    const image = toyForm.image.value;

    // Prepare POST request body
    const formData = {
      name: name,
      image: image,
      likes: 0 // Initial likes count
    };

    // Send POST request to add new toy
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newToy => {
        // Create card for the new toy
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${newToy.name}</h2>
          <img src="${newToy.image}" class="toy-avatar" />
          <p>${newToy.likes} Likes</p>
          <button class="like-btn" id="${newToy.id}">Like ❤️</button>
        `;

        // Append new card to toy collection
        toyCollection.appendChild(card);

        // Add event listener to new toy's like button
        const likeButton = card.querySelector('.like-btn');
        likeButton.addEventListener('click', () => handleLikeToy(newToy));

        // Clear form fields
        toyForm.reset();
      });
  });

  // Function to handle liking a toy
  function handleLikeToy(toy) {
    // Prepare updated likes count
    const newLikes = toy.likes + 1;

    // Send PATCH request to update likes count
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        // Update likes in the DOM
        const card = document.getElementById(updatedToy.id);
        const likeParagraph = card.querySelector('p');
        likeParagraph.textContent = `${updatedToy.likes} Likes`;
      });
  }
});
