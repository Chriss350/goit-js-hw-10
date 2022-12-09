import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let userInput;

//CountryInfo
let flag, header, pCap, pPop, pLang;

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

const pickCountry = input => {
  fetchCountries(input)
    .then(data => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      displayCountryInfo(data);

      return;
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return;
    });
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

const createCountryInfoLayout = () => {
  flag = document.createElement('img');
  flag.className = 'country-flag';
  flag.height = '55';
  flag.width = '90';
  header = document.createElement('h2');
  header.className = 'country-name';
  pCap = document.createElement('p');
  pPop = document.createElement('p');
  pLang = document.createElement('p');

  countryInfo.append(flag, header, pCap, pPop, pLang);
};

const checkData = data => {
  if (typeof data === 'object') {
    const newData = data.length >= 1 ? data : `-`;
    return (data = newData);
  }

  if (data === undefined) {
    return '-';
  }

  return data;
};

const displayCountryInfo = data => {
  createCountryInfoLayout();

  [...data].forEach(res => {
    flag.src = checkData(res.flag);
    flag.alt = 'Flag of ' + checkData(res.name);

    const lang = res.languages.length > 1 ? `Languages:` : `Language:`;
    header.innerHTML = checkData(res.name);
    pCap.innerHTML = `Capital: ${checkData(res.capital)}`;
    pPop.innerHTML = `Population:  ${checkData(res.population)}`;

    if (typeof res.languages === 'object') {
      pLang.innerHTML =
        lang + checkData(res.languages.map(lang => ' ' + lang.name));
    } else {
      pLang.innerHTML = lang + res.languages;
    }
  });
};

const checkInputString = data => {
  return /^[a-zA-Z\s\W]*$/.test(data);
};

inputSearch.addEventListener(
  'input',
  debounce(
    e => {
      if (checkInputString(e.target.value) === true) {
        searchCountry();
      } else {
        Notiflix.Notify.failure('Use letters and special characters');
      }
    },

    DEBOUNCE_DELAY
  )
);

countryList.addEventListener('click', e => {
  if (e.target.nodeName === 'LI') {
    inputSearch.value = e.target.textContent;
    pickCountry(e.target.textContent);
    return;
  }

  if (e.target.nodeName === 'IMG') {
    inputSearch.value = e.target.parentNode.textContent;
    pickCountry(e.target.parentNode.textContent);

    return;
  }
  return;
});
