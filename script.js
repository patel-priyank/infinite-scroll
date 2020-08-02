const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const goToTopBtn = document.getElementById('go-to-top-btn');
const errorContainer = document.getElementById('error-container');
const loadStaticBtn = document.getElementById('load-static');

// Unsplash API
const imageCount = 10;
const apiKey = 'unsplash_developer_api_key'; // enter Unsplash developer API key here
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;

// Height to display Scroll to Top button
const goToTopBtnDisplayHeight = 750;
const loadPhotosDefaultHeight = 2000;

let ready = false; // ready to load photos
let imagesLoaded = 0; // to count images loaded in each call
let totalImages = 0; // total images loaded in each call
let photosArray = []; // array to store new loaded images

let errorCount = 0;
const maxErrorsAllowed = 10;

const staticImages = [
  {
    alt_description: 'koala on brown tree branch during daytime',
    links: {
      html: 'https://unsplash.com/photos/al2BO4QBRRM',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1595737133621-ff0a30406dec?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'white star light in tunnel',
    links: {
      html: 'https://unsplash.com/photos/ZE3nj34iO0M',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1595431231665-00a6c43b1d26?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'white metal frame on white floor',
    links: {
      html: 'https://unsplash.com/photos/bo1BUY4kOlI',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594761051343-96ff2105fdf5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'man surfing on sea near mountain during daytime',
    links: {
      html: 'https://unsplash.com/photos/aGMIRH_B4K0',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594749794764-717b02dbb530?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'pink flowers in tilt shift lens',
    links: {
      html: 'https://unsplash.com/photos/w0tg9l0Cd3A',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1595135877442-3408b56e291d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'orange bmw m 3 coupe',
    links: {
      html: 'https://unsplash.com/photos/b4u_PYTqMfo',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594502017947-6df36e5d71cd?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'lake in the middle of mountains during daytime',
    links: {
      html: 'https://unsplash.com/photos/xLmSiY1INLI',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594236089007-8180d3943012?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'people walking on street during night time',
    links: {
      html: 'https://unsplash.com/photos/-O5a-OvFeTU',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594604028390-9daf26f9b0e4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description:
      'woman in black long sleeve shirt and blue denim jeans wearing brown fedora hat sitting on with with with on',
    links: {
      html: 'https://unsplash.com/photos/OHdwO_1TW4c',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1595464267009-97fd66be744f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
  {
    alt_description: 'gray rock formation under blue sky during daytime',
    links: {
      html: 'https://unsplash.com/photos/6Y70GngCD60',
    },
    urls: {
      regular:
        'https://images.unsplash.com/photo-1594639665875-b8e8699df5f8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE1MzY2Mn0',
    },
  },
];

// Check if all images are loaded
function imageLoaded() {
  // increment after each image load
  ++imagesLoaded;

  // hide loader when first image is loaded
  if (imagesLoaded === 1) {
    hideLoader();
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

// Helper function to shuffle an array
function shuffleArray(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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
    // fetch photos from API and display them
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    if (errorCount < maxErrorsAllowed) {
      // if error occurs, show loader, increment error count and retry
      showLoader();
      ++errorCount;
      getPhotos();
    } else {
      // if error limit exceeded, hide loader and show error message
      hideLoader();
      showErrorMessage();
    }
  }
}

// Function to load new photos and show scroll to top button on scroll
window.addEventListener('scroll', () => {
  // check if scrolled down
  const scrolledDown =
    document.body.scrollTop > goToTopBtnDisplayHeight ||
    document.documentElement.scrollTop > goToTopBtnDisplayHeight;

  // if scrolled down, show and enable scroll to top button else disable scroll to top button
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
  heightToLoadPhotos =
    photosArray.length > 0
      ? photosArray[photosArray.length - 1].height / 5
      : loadPhotosDefaultHeight;

  // Check to see if scrolling near bottom of page, show loader and load more photos
  if (
    ready &&
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - heightToLoadPhotos
  ) {
    ready = false;
    showLoader();
    getPhotos();
  }
});

// shuffle static photos and display them
loadStaticBtn.addEventListener('click', () => {
  shuffleArray(staticImages);
  photosArray = [...staticImages];
  hideErrorMessage();
  displayPhotos();
});

function hideErrorMessage() {
  errorContainer.hidden = true;
}

function showErrorMessage() {
  errorContainer.hidden = false;
  // Calculate height to load photos based on height of last image
  heightToLoadPhotos =
    photosArray.length > 0
      ? photosArray[photosArray.length - 1].height / 5
      : loadPhotosDefaultHeight;

  // if scrolled down enough to load new photos, scroll to end to displaying error message
  if (
    document.body.scrollTop >=
      document.body.scrollHeight - heightToLoadPhotos ||
    document.documentElement.scrollTop >=
      document.body.scrollHeight - heightToLoadPhotos
  ) {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function hideLoader() {
  loader.hidden = true;
}

function showLoader() {
  loader.hidden = false;
}

// Scroll to Top on button click, remove fade out class and add fade in
goToTopBtn.addEventListener('click', () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  goToTopBtn.classList.remove('animate__fadeIn');
  goToTopBtn.classList.add('animate__fadeOut');
});

// On load
getPhotos();
if (apiKey === 'unsplash_developer_api_key') {
  console.log(
    "You'll need to clone this website from Github and enter an Unsplash Developer API Key first!",
    'Instructions can be found at https://github.com/patel-priyank/infinite-scroll.'
  );
}
