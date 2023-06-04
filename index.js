function createCarousel(data, idx) {
  let carousel = document.createElement("div");
  carousel.setAttribute("id", `carouselExampleControls${idx + 1}`);
  carousel.setAttribute("class", "carousel slide");
  carousel.setAttribute("data-bs-ride", "carousel");

  let carouselButtons = `
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${
          idx + 1
        }" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${
          idx + 1
        }" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    `;

  carousel.innerHTML = carouselButtons;

  const innerCarousel = createInnerCarousel(data);
  carousel.appendChild(innerCarousel);
  return carousel;
}

function createInnerCarousel(data) {
  let innerCarousel = document.createElement("div");
  innerCarousel.setAttribute("class", "carousel-inner");

  data.items.forEach((item, index) => {
    let itemDiv = document.createElement("div");
    let className = "carousel-item ";
    if (index === 0) className += "active";
    itemDiv.setAttribute("class", className);

    const itemCard = createItemCard(item);

    itemDiv.appendChild(itemCard);

    innerCarousel.appendChild(itemDiv);
  });

  return innerCarousel;
}

function createItemCard(data) {
  let card = document.createElement("div");
  card.setAttribute("class", "data-card");
  card.setAttribute("id", data.guid);

  let cardContent = `
        <img class="card-image" src="${data.enclosure.link}" alt="${data.guid}">
        <h1 class="card-title">${data.title}</h1>
        <div class="card-details">
        <p class="card-author">${data.author}</p>
        <div></div>
        <p class="card-date">${data.pubDate}</p>
        </div>
        <p class="card-description">${data.content}</p>
    `;

  card.innerHTML = cardContent;
  return card;
}

async function getData(link) {
  const response = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${link}`
  );
  const data = await response.json();
  console.log(data);
  return data;
}

async function gatherCarousels() {
  for (let i = 0; i < magazines.length; i++) {
    const data = await getData(magazines[i]);
    console.log(data);
    document.getElementById(`accordian-button-${i + 1}`).innerHTML =
      data.feed.title;
    const carousel = createCarousel(data, i);
    document.getElementById(`accordian-body-${i + 1}`).appendChild(carousel);
  }
}

gatherCarousels();
