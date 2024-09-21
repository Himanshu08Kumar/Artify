//Z9vfZEfgbG9pFwF7U7G_YT1kw2a9t-mz5IoGz3Y3_dM
import { createApi } from "unsplash-js";

const main = document.querySelector("#main");
const searchInput = document.querySelector("#search-input");
const latest = document.querySelector("#latest");
const abstract = document.querySelector("#abstract");
const classic = document.querySelector("#classic");
const sculptures = document.querySelector("#sculptures");
const contemporary = document.querySelector("#contemporary");

const unsplash = createApi({
  accessKey:
    import.meta.env.ACCESS_KEY || "Z9vfZEfgbG9pFwF7U7G_YT1kw2a9t-mz5IoGz3Y3_dM",
});

function renderPhotos(photos, container, query) {
  const getUrls = photos.map((photo) => {
    return `<img src = "${photo.urls.small}" id="fetch-image" at="${photo.alt_description}" key="${photo.id}"/>`;
  });
  container.innerHTML = getUrls.join("");
}

unsplash.search
  .getPhotos({
    query: "random",
    page: 1,
    perPage: 30,
    orientation: "portrait",
  })
  .then((result) => {
    if (result.type === "success") {
      const photos = result.response.results;
      renderPhotos(photos, latest, "random");
      latest.innerHTML = getUrls.join("");
    }
  });

function fetchPhotos(category = "dog") {
  let query = category;
  switch (category) {
    case "abstract":
      query = "Abstract Art";
      break;
    case "classic":
      query = "Modern Art";
      break;
    case "sculptures":
      query = "Sculptures Art";
      break;
    case "contemporary":
      query = "Contemporary Art";
      break;
    default:
      query = category;
  }
  unsplash.search
    .getPhotos({
      query: query,
      page: 1,
      perPage: 30,
      orientation: "portrait",
    })

    .then((result) => {
      if (result.type === "success") {
        const photos = result.response.results;
        console.log(photos);
        renderPhotos(photos, main, query);
        main.innerHTML = getUrls.join("");
      }
    });
}
fetchPhotos();

abstract.addEventListener("click", () => fetchPhotos("abstract"));
classic.addEventListener("click", () => fetchPhotos("classic"));
sculptures.addEventListener("click", () => fetchPhotos("sculptures"));
contemporary.addEventListener("click", () => fetchPhotos("contemporary"));
