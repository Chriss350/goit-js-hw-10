import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const searchCountry = () => {
  userInput = inputSearch.value.trim();

  if (userInput === '') {
    Notiflix.Notify.info('Please type in a country name');
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  } else {
    fetchCountries(userInput)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
          return;
        }

        if (data.length >= 2 && data.length <= 10) {
          countryList.innerHTML = '';
          createCountryList(data);
          countryInfo.innerHTML = '';
          return;
        }

        if ((data.length = 1)) {
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
          displayCountryInfo(data);

          return;
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
      });
  }
};

const createCountryList = data => {
  [...data].forEach(res => {
    const list = document.createElement('li');
    const img = document.createElement('img');
    img.src = res.flag;
    img.alt = 'Flag of ' + res.name;
    img.height = '110';
    img.width = '180';
    const txtNode = document.createTextNode(res.name);
    list.appendChild(img);
    list.appendChild(txtNode);

    countryList.append(list);
  });
};

const displayCountryInfo = data => {
  [...data].forEach(res => {
    const flag = document.createElement('img');
    flag.src = res.flag;
    flag.alt = 'Flag of ' + res.name;
    flag.height = '110';
    flag.width = '180';
    const header = document.createElement('span');
    const txtheader = document.createTextNode(res.name);
    header.appendChild(txtheader);
    const pCap = document.createElement('p');
    const txtCap = document.createTextNode('Capital: ' + res.capital);
    pCap.appendChild(txtCap);
    const pPop = document.createElement('p');
    const txtPop = document.createTextNode('Population: ' + res.population);
    pPop.appendChild(txtPop);
    const pLang = document.createElement('p');
    const txtLang = document.createTextNode(
      'Language: ' + res.languages.map(lang => ' ' + lang.name)
    );
    pLang.appendChild(txtLang);
    countryInfo.append(flag, header, pCap, pPop, pLang);
  });
};

inputSearch.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
