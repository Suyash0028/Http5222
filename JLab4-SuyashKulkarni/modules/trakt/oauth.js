const qs = require("querystring");

const traktUrl = "https://api.trakt.tv";

function startAuthorizing() { 
  var params = {
    response_type: "code", 
    client_id: process.env.TRAKT_CLIENT_ID, 
    redirect_uri: process.env.TRAKT_REDIRECT_URI, 
    state: process.env.TRAKT_STATE
  }; 
  let formattedParams = qs.stringify(params); 
  let url = `${traktUrl}/oauth/authorize?${formattedParams}`; 
  return url; //return Trakt's authorizing page
} 

async function getAccessToken(code) { 
  var params = { 
    code: code, 
    client_id: process.env.TRAKT_CLIENT_ID, 
    client_secret: process.env.TRAKT_CLIENT_SECRET, 
    redirect_uri: process.env.TRAKT_REDIRECT_URI, 
    grant_type: "authorization_code" 
  }; 
  let response = await fetch( 
    `${traktUrl}/oauth/token`, 
    {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify(params)
    } 
  );
  let accessToken = await response.json();
  return accessToken;
}

module.exports = {
  startAuthorizing,
  getAccessToken
};