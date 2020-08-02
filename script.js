const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const goToTopBtn = document.getElementById('go-to-top-btn');

// Unsplash API
const imageCount = 10;
const apiKey = ''; // enter Unsplash developer API key here
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;

// Height to display Scroll to Top button
const goToTopBtnDisplayHeight = 500;

let ready = false; // ready to load photos
let imagesLoaded = 0; // to count images loaded in each call
let totalImages = 0; // total images loaded in each call
let photosArray = []; // array to store new loaded images

// Check if all images are loaded
function imageLoaded() {
  // increment after each image load
  ++imagesLoaded;

  // hide loaded when at least one image is loaded
  if (imagesLoaded === 1) {
    loader.hidden = true;
  }

  // ready to load new images once all images are loaded
  if (imagesLoaded === totalImages) {
    ready = true;
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links and photos, add to DOM
function displayPhotos() {
  // reset count of new loaded images
  imagesLoaded = 0;
  totalImages = photosArray.length;

  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const anchor = document.createElement('a');
    setAttributes(anchor, {
      href: photo.links.html,
      target: '_blank',
    });

    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event listener - check when each image is finished loading
    img.addEventListener('load', imageLoaded);

    // Put <img> inside <a>, then put both inside image-container
    anchor.appendChild(img);
    imageContainer.appendChild(anchor);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {}
}

// Function to load new photos and show scroll to top button on scroll
window.addEventListener('scroll', () => {
  // check if scrolled down
  const scrolledDown =
    document.body.scrollTop > goToTopBtnDisplayHeight ||
    document.documentElement.scrollTop > goToTopBtnDisplayHeight;

  // if scrolled down, show and enable scroll to top button
  // else disable scroll to top button
  if (scrolledDown) {
    goToTopBtn.style.display = 'block';
    goToTopBtn.disabled = false;
  } else {
    goToTopBtn.disabled = true;
  }

  // if scrolled to top, fade out and hide button then add class to fade in
  if (window.scrollY === 0) {
    setTimeout(() => {
      goToTopBtn.classList.remove('animate__fadeOut');
      goToTopBtn.style.display = 'none';
      goToTopBtn.classList.add('animate__fadeIn');
    }, 500);
  }

  // Calculate height to load photos based on height of last image
  heightToLoadPhotos = photosArray[photosArray.length - 1].height / 5;

  // Check to see if scrolling near bottom of page, load more photos
  if (
    ready &&
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - heightToLoadPhotos
  ) {
    ready = false;
    getPhotos();
  }
});

// Scroll to Top on button click, remove fade out class and add fade in
goToTopBtn.addEventListener('click', () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  goToTopBtn.classList.remove('animate__fadeIn');
  goToTopBtn.classList.add('animate__fadeOut');
});

// On load
getPhotos();
