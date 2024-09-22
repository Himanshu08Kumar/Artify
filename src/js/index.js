import { createApi } from "unsplash-js";

const main = document.querySelector("#main");
const searchInput = document.querySelector("#search-input");
const abstract = document.querySelector("#abstract");
const classic = document.querySelector("#classic");
const sculptures = document.querySelector("#sculptures");
const contemporary = document.querySelector("#contemporary");

const unsplash = createApi({
  accessKey: import.meta.env.ACCESS_KEY || "Z9vfZEfgbG9pFwF7U7G_YT1kw2a9t-mz5IoGz3Y3_dM",
});



// Function to render photos on the page
function renderPhotos(photos, container) {
  const favorites = getFavoritesFromLocalStorage(); // Get favorites from localStorage
  const getUrls = photos
    .map((photo) => {
      const isFavorite = favorites.some((fav) => fav.id === photo.id); // Check if the photo is already in favorites
      return `
        <div class="photo-container">
          <img src="${photo.urls.small}" id="fetch-image" alt="${photo.alt_description}" data-id="${photo.id}" class="photo"/>
          <span class="heart-icon" data-id="${photo.id}" style="color: ${isFavorite ? 'red' : 'grey'};cursor:pointer">&#10084;</span>
        </div>
      `;
    })
    .join("");
  container.innerHTML = getUrls;
  container.querySelectorAll(".photo").forEach((image) => {
    image.addEventListener("click", () => showImageDetails(image.dataset.id));
  });

// Function to show image details in a new tab
function showImageDetails(photoId) {
  unsplash.photos.get({ photoId }).then((result) => {
    if (result.type === "success") {
      const photo = result.response;

      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
          
            <title>${photo.alt_description || "Image Details"}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 40px;
                text-align: center;
              }
              .image-container {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
                transition: transform 0.2s ease-in-out;
              }
              .image-container:hover {
                transform: scale(1.02);
              }

              .backHome{
                float: left;
                transition: all 0.2s;
                background-color: transparent;
                border-radius:50%
              }
              .backHome:hover{
                box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
                transform: scale(1.05);
              }
              
            </style>
          </head>
          <body>
            <div class="image-container">
            <a href ="/index.html" style="background-color:none, background: none"><img src="./assets/back.png" alt="back" width="50" class="backHome"></a>
              <img src="${photo.urls.regular}" 
              alt="${photo.alt_description}" 
              style="max-width: 100%;
                height: 80%;
                border-radius: 12px;
                margin: 20px 0;"/>
                <h3>${photo.alt_description.toUpperCase() || "No description available"}</h3>
              <p><strong>Photographer:</strong> ${photo.user.name}</p>
              <p><strong>Likes:</strong> ${photo.likes}</p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  });
}

  // Add event listener to each heart icon
  container.querySelectorAll(".heart-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => toggleFavorite(event.target));
  });
}

// Toggle favorite status and redirect to favorite page if heart icon is clicked
function toggleFavorite(icon) {
  const photoId = icon.dataset.id;
  const favorites = getFavoritesFromLocalStorage();
  const photoIndex = favorites.findIndex((fav) => fav.id === photoId);

  if (photoIndex !== -1) {
    // If the photo is already in favorites, remove it
    favorites.splice(photoIndex, 1);
    icon.style.color = "grey"; // Change the heart icon color to grey
  } else {
    // If not, add it to favorites
    const photoElement = document.querySelector(`[data-id="${photoId}"]`);
    const photoUrl = photoElement.src;
    const altDescription = photoElement.alt;
    favorites.push({ id: photoId, url: photoUrl, description: altDescription });
    icon.style.color = "red"; // Change the heart icon color to red
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

}

// Get favorites from localStorage
function getFavoritesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Function to fetch photos based on category or query
async function fetchPhotos(category) {
  const result = await unsplash.search
    .getPhotos({
      query: category,
      page: 1,
      perPage: 30,
      orientation: "portrait",
    });
  if (result.type === "success") {
    const photos = result.response.results;
    return photos;
  }
  return [];
}

// Combine and render images for multiple categories
function renderImage() {
  Promise.all([fetchPhotos("winter"), fetchPhotos("summer"), fetchPhotos("nature")])
    .then((results) => {
      const allPhotos = [...results[0], ...results[1], ...results[2]];
      renderPhotos(allPhotos, main);
    })
    .catch((error) => {
      console.error("Error fetching photos:", error);
    });
}

renderImage(); // Render initial photos for 'winter' and 'summer'

// Event listeners for navigation buttons to fetch photos based on category
abstract.addEventListener("click", () => {
  fetchPhotos("abstract").then((photos) => renderPhotos(photos, main));
});

classic.addEventListener("click", () => {
  fetchPhotos("modern art").then((photos) => renderPhotos(photos, main));
});

sculptures.addEventListener("click", () => {
  fetchPhotos("sculptures").then((photos) => renderPhotos(photos, main));
});

contemporary.addEventListener("click", () => {
  fetchPhotos("contemporary").then((photos) => renderPhotos(photos, main));
});

// Event listener for search functionality
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (query !== "") {
      fetchPhotos(query).then((photos) => renderPhotos(photos, main));
    } else {
      fetchPhotos("random").then((photos) => renderPhotos(photos, main));
    }
  }
});
