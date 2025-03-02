import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', async event => {
  event.preventDefault();

  query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  clearGallery();
  page = 1;
  loader.style.display = 'block';
  loadMore.style.display = 'none';

  try {
    const { images, totalHits } = await fetchImages(query, page);

    if (images.length > 0) {
      renderImages(images);
      iziToast.success({ title: 'Success', message: 'Images loaded!' });

      if (totalHits > perPage) {
        loadMore.style.display = 'block';
      }
    } else {
      iziToast.error({ title: 'Error', message: 'No images found.' });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    loader.style.display = 'none';
    form.reset();
  }
});

loadMore.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    const { images, totalHits } = await fetchImages(query, page);

    if (images.length > 0) {
      renderImages(images);
      smoothScroll();

      if (totalHits <= page * perPage) {
        loadMore.style.display = 'none';
        iziToast.error({
          title: 'Error',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    loader.style.display = 'none';
  }
});

function smoothScroll() {
  const galleryCard = document.querySelector('.gallery-item');
  if (galleryCard) {
    const cardHeight = galleryCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
