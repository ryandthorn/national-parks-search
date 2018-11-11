'use strict'

const options = {
  headers: new Headers({
    "X-Api-Key": "i0yy50qQRGOykFiPqFOeq5fVlYHVRCFWfbqK1LKa"})
};
const searchURL = "https://api.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function formatAddress(addressObj) {
  let address = `<p>${addressObj.line1}<br>`;
  if (addressObj.line2 !== "") {address = address.concat(`${addressObj.line2}<br>`)}
  if (addressObj.line3 !== "") {address = address.concat(`${addressObj.line3}<br>`)}
  address = address.concat(`${addressObj.city}, ${addressObj.stateCode} ${addressObj.postalCode}</p>`)
  
  return address;
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#js-error-message').empty();
  $('#results-list').empty();
  
  for (let i=0; i < responseJson.data.length; i++) {
    let currentItem = responseJson.data[i];
    let addressString = formatAddress(currentItem.addresses[0]);
    // Multiple addresses on occasion - hardcoded to use first address

    $('#results-list').append(
      `<hr>
       <li>
        <h3>${currentItem.fullName}</h3>
        <p>${currentItem.description}</p>
        <a href="${currentItem.url}">Link to Website</a>
        <h4>Address</h4>
        ${addressString}
      </li>`
    );
  }
  $('#results').removeClass('hidden');
}

function getParksData(states, maxResults) {
  const params = {
    stateCode: states,
    limit: maxResults,
    fields: "addresses"
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const states = $('#js-states').val();
    const maxResults = $('#js-max-results').val() - 1; // Strange behavior from limit parameter: counts from 0?
    getParksData(states, maxResults);
  });
}

$(watchForm);
