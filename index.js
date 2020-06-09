/* eslint-disable no-console */
'use strict';

// put your own value below!
const apiKey = 'laq6kPBucnVSuO3cAxupE9Ncnta6X80Dxzd1VybG'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();// if there are previous results, remove them
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each object in the items 
    //array, add a list item to the results 
    //list with the  title, description,
    //and first image
    $('#results-list').append(
      `<li>
      <img src='${responseJson.data[i].images[0].url}'>
      <div class='park-details'>
      <h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].addresses[0].city}, 
      ${responseJson.data[i].addresses[0].stateCode}</p>
      <p>${responseJson.data[i].description}</p>
      <p><a href = '${responseJson.data[i].url}'>Park website</a></p>
      </div>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(query, stateCode='MT', maxResults=10) {
  const params = {
    api_key: apiKey,
    q: query,
    stateCode,
    limit: maxResults
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
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const stateCode = $('#js-state-code').val();
    getParks(searchTerm, stateCode, maxResults);
  });
}

$(watchForm);