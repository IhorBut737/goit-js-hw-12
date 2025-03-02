import axios from 'axios';

const API_KEY = '48994521-1332b5dc6d32291391eccb048';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page) {
  const params = new URLSearchParams({
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });
  const url = `${BASE_URL}?key=${API_KEY}&${params.toString()}`;

  try {
    const response = await axios.get(url);

    if (response.data.hits.length === 0) {
      return Promise.reject(new Error('No images found.'));
    }

    return { images: response.data.hits, totalHits: response.data.totalHits };
  } catch (error) {
    throw new Error('Failed to fetch images.');
  }
}
