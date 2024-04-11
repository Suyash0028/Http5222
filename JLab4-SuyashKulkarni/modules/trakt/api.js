const trakt = "https://api.trakt.tv"; //base URL for any Trakt API requests

/*
 * Functions for Trakt API requests.
 */
async function getTrendingMovies() {
  let reqUrl = `${trakt}/movies/trending`;
  console.log(reqUrl);
  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
  );
  return await response.json();
}

async function getUserData(slug, token) {
  let reqUrl = `${trakt}/users/${slug}`;
  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": process.env.TRAKT_CLIENT_ID,
        "Authorization": `Bearer ${token}`,
      }
    }
  );
  return await response.json();
}

async function getPopularShows() {
  let reqUrl = `${trakt}/shows/popular?page=1&limit=15`;
  console.log(reqUrl);
  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID,
      }
    }
  );
  return await response.json();
}

module.exports = {
  getTrendingMovies,
  getUserData,
  getPopularShows
};