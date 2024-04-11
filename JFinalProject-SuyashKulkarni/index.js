//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const moment = require('moment');

const { eventIds } = require('./constants');
const eventbrite = require('./components/eventbrite');
const openweathermap = require('./components/openweathermap');

//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set up middleware and static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get('/', async (req, res) => {
    try {
        // Fetch events from Eventbrite API
        let page = parseInt(req.query.page) || 1; // Get page from query parameter, default to 1
        let events = await getEvents(page);
        res.render('index', { events: events, page: page, totalPages: Math.round(eventIds.length / 20) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/events/details/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    let eventDetails = await eventbrite.getEventDetails(eventId);
    const latitude = eventDetails.eventLatitude;
    const longitude = eventDetails.eventLongitude;
    const today = moment().format('dddd');

    const weatherDetails = await openweathermap.getWeather(latitude,longitude);
    
    res.render('event-details', { selectedEvent: eventDetails, weatherDetails: weatherDetails, today: today });//, relatedEvents: relatedEvents
});

app.get('/events/search', async (req, res) => {
    let page = req.query.page || 1;
    let events = await getEvents(page);
    if (req.query.q) {
        const searchText = req.query.q.toLowerCase();
        const filteredItems = events.filter(event => event.eventTitle.toLowerCase().includes(searchText));

        res.render('event-search', { events: filteredItems, page: page, totalPages: Math.round(eventIds.length / 20) });
    } else {
        // Otherwise, render your Pug template with the items
        res.render('event-search', { events: events, page: page, totalPages: Math.round(eventIds.length / 20) });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Helper Functions
async function getEvents(pageNum) {
    // Now 'page' contains the updated page number, perform further processing as needed
    // For example, call the API with the new page number
    const limit = 20; // Number of items per page
    let ids = getPaginatedValues(eventIds, pageNum, limit);
    let events = await eventbrite.getEvents(ids.join(', '));
    return events;
}
// Function to get paginated values
function getPaginatedValues(array, page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return array.slice(startIndex, endIndex);
}