document.addEventListener('DOMContentLoaded', () => {
    const favoritesSection = document.querySelector("#favorite-images");
  
    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log(favorites);
  
    // Render the favorite items
    function renderFavorites() {
    if (favorites.length > 0) {
      const favoriteHtml = favorites
        .map(
          (fav) => `
          <div class="photo-container">
            <img src="${fav.url}" alt="${fav.description}" class="photo-container" id="fetch-Fav-Image" class="photo"/>
            <span class="heart-icon" data-id="${fav.id}" style="color: red; margin-top: -2rem;">&#10084;</span>
          </div>`
        )
        .join("");
      favoritesSection.innerHTML = favoriteHtml;
    } else {
      favoritesSection.innerHTML = "<p>No favorites added yet!</p>";
    }
  }
  renderFavorites();

  // Function to remove item from favorites
  function removeFromFavorites(id) {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    return updatedFavorites;
  }

  // Handle click event on the heart icon to remove a favorite
  favoritesSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("heart-icon")) {
      const imageId = event.target.getAttribute("data-id");

      // Remove the item from the favorites list in localStorage
      const updatedFavorites = removeFromFavorites(imageId);

      // Update the UI and re-render the favorites
      favorites.splice(0, favorites.length, ...updatedFavorites); // Sync the array
      renderFavorites();
    }
  });
});
  