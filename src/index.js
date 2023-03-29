import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const refs = {
  inputEl: document.querySelector('#search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

const reset = () => {
  refs.ulEl.innerHTML = '';
  refs.divEl.innerHTML = '';
};

function searchCity(evt) {
  const cityName = evt.target.value.trim();
  if (!cityName) {
    reset();
    return;
  }

  fetchCountries(cityName)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        refs.ulEl.innerHTML = ulElMarkup(data);
        refs.ulEl.style.listStyle = 'none';
        refs.ulEl.style.padding = 0;
        refs.divEl.innerHTML = '';
      } else if (data.length === 1) {
        refs.divEl.innerHTML = divElMarkup(data);
        refs.ulEl.innerHTML = '';
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
      reset();
    });
}

function divElMarkup(arr) {
  return arr
    .map(
      ({ capital, population, languages, name, flags }) =>
        `<div style="display: flex; align-items: center; gap: 10px;">
        <img src="${flags.svg}"
        alt="${name.official}" width="30" height="30">
        <h1>${name.official}</h1></div>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages)} </p>`
    )
    .join('');
}

function ulElMarkup(arr) {
  return arr
    .map(
      ({
        name,
        flags,
      }) => `<li style="display: flex; align-items: center; gap: 10px;">
  <img src="${flags.svg}" alt="${name.official}" width="30" height="30">
  <h2>${name.official}</h2></li>`
    )
    .join('');
}

refs.inputEl.addEventListener('input', debounce(searchCity, DEBOUNCE_DELAY));