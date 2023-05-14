import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const countrylistEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  debounce(() => {
    choiceOfСountries()
      .then(data => {
        if (data.length > 10) {
          countrylistEl.innerHTML = '';
          countryInfoEl.innerHTML = '';
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length > 1) {
          renderCountriesList(data);
        } else {
          renderCountryInfo(data);
        }
      })
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY)
);

function renderCountriesList(countries) {
  countryInfoEl.innerHTML = '';
  const markup = countries
    .map(country => {
      return `<li style="list-style-type: none">
      <img src="${country.flags.svg}" alt="" width="50"><span style="margin-left:20px; font-size:40px">${country.name.official}</span></li>`;
    })
    .join('');
  countrylistEl.innerHTML = markup;
}

function renderCountryInfo(countries) {
  countrylistEl.innerHTML = '';
  console.log(countries);
  const markup = countries
    .map(country => {
      return `<ul style="list-style-type: none; font-size:40px">
      <li >
      <img src="${country.flags.svg}" alt="" width="100">
      <span style="margin-left:20px; font-size:60px">${
        country.name.official
      }</span></li>
      <li><span>Capital: </span><span>${country.capital}</span></li>
      <li><span>Population: </span><span>${country.population}</span></li>
      <li><span>Languages: </span><span>${Object.values(
        country.languages
      )}</span></li>
    </ul>`;
    })
    .join('');
  countryInfoEl.innerHTML = markup;
}

function choiceOfСountries() {
  const value = inputEl.value.trim();

  return fetch(
    `https://restcountries.com/v3.1/name/${value}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      countrylistEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }

    return response.json();
  });
}
