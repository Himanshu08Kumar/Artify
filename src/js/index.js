import { createApi } from "unsplash-js";

const main = document.querySelector("#main");
const searchInput = document.querySelector("#search-input");
const abstract = document.querySelector("#abstract");
const classic = document.querySelector("#classic");
const sculptures = document.querySelector("#sculptures");
const contemporary = document.querySelector("#contemporary");

const unsplash = createApi({
  accessKey:
    import.meta.env.ACCESS_KEY || "Z9vfZEfgbG9pFwF7U7G_YT1kw2a9t-mz5IoGz3Y3_dM",
});

// Function to render photos on the page
function renderPhotos(photos, container) {
  const getUrls = photos
    .map((photo) => {
      return `<img src="${photo.urls.small}" id="fetch-image" alt="${photo.alt_description}" data-id="${photo.id}" class="photo"/>`;
    })
    .join("");
  container.innerHTML = getUrls;

  // Add event listener to each image for showing detailed view on click
  container.querySelectorAll(".photo").forEach((image) => {
    image.addEventListener("click", () => showImageDetails(image.dataset.id));
  });
}

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
              <img src="${photo.urls.regular}" alt="${photo.alt_description}" 
              style="max-width: 100%;
                height: 80%;
                border-radius: 12px;
                margin: 20px 0;"/>
              <h3>${photo.alt_description.toUpperCase() || "No description available"}</h3>
              <p><strong>By - </strong> ${photo.user.name}</p>
              <p><strong>Likes:</strong> ${photo.likes}</p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  });
}

// Function to fetch photos based on category or query
function fetchPhotos(category) {
  return unsplash.search
    .getPhotos({
      query: category,
      page: 1,
      perPage: 30,
      orientation: "portrait",
    })
    .then((result) => {
      if (result.type === "success") {
        const photos = result.response.results;
        console.log(photos)
        return photos;
        
      }
      return [];
    });
}

// Combine and render images for multiple categories
function renderImage() {
  Promise.all([
    fetchPhotos("winter"),
    fetchPhotos("summer"),
    fetchPhotos("nature"),
  ])
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
