document.addEventListener('DOMContentLoaded', () => {
  const favoritesSection = document.querySelector("#favorite-images");

  // Get favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log(favorites);

  // Render the favorite items
  function renderFavorites() {
      if (favorites.length > 0) {
          const favoriteHtml = favorites
              .map(
                  (fav) => `
                  <div class="photo-container">
                      <img src="${fav.url}" alt="${fav.description}" class="photo" id="fetch-Fav-Image"/>
                      <span class="heart-icon" data-id="${fav.id}" style="color: red; margin-top: -2rem;">&#10084;</span>
                  </div>`
              )
              .join("");
          favoritesSection.innerHTML = favoriteHtml;
      } else {
          favoritesSection.innerHTML = "<p>No favorites added yet!</p>";
      }
  }

  // Initial render of favorites
  renderFavorites();

  // Function to remove item from favorites
  function removeFromFavorites(id) {
      favorites = favorites.filter((fav) => fav.id !== id); // Update the favorites array
      localStorage.setItem("favorites", JSON.stringify(favorites)); // Update localStorage
      return favorites;
  }

  // Handle click event on the heart icon to remove a favorite
  favoritesSection.addEventListener("click", (event) => {
      if (event.target.classList.contains("heart-icon")) {
          const imageId = event.target.getAttribute("data-id");

          // Remove the item from the favorites list in localStorage
          favorites = removeFromFavorites(imageId);

          // Re-render the favorites after removing an item
          renderFavorites();
      }
  });
});
