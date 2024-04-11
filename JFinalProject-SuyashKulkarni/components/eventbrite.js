const moment = require('moment');

const apiUrl = process.env.EVENTBRITE_API_URL;

async function getEvents(eventIds) {
    try {
        const reqUrl = `${apiUrl}destination/events/?event_ids=${eventIds}&page_size=21&expand=event_sales_status,image,primary_venue,saves,ticket_availability,primary_organizer,public_collections`;
        const response = await fetch(reqUrl);
        
        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        let finalData = data.events;
        const myEventData = [];
        finalData.forEach(event => {
            myEventData.push({
                eventId: event.id,
                eventImg: event.image.original.url,
                eventTitle: event.name,
                eventUrl: event.url,
                eventSummary: event.summary,
                eventTickets: event.tickets_url,
                eventDateTime: event.event_sales_status.start_sales_date?.utc,
                eventAddress: event.primary_venue.address.localized_address_display,
                eventLongitude: event.primary_venue.address.longitude,
                eventLatitude: event.primary_venue.address.latitude,
                eventVenue: event.primary_venue.name,
                eventVenue: event.primary_venue.name,
                eventStatus: event.event_sales_status.default_message,
                eventMaxPrice: event.ticket_availability.maximum_ticket_price?.major_value === "0.00" ? "Free Tickets" : "$ " + event.ticket_availability.maximum_ticket_price?.major_value,
                eventMinPrice: event.ticket_availability.minimum_ticket_price?.major_value === "0.00" ? "Free Tickets" : "Starting From $ " + event.ticket_availability.minimum_ticket_price?.major_value,
            });
        });
        return myEventData;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw new Error('Failed to fetch events from Eventbrite API');
    }
}

async function getEventDetails(eventId) {
    try {
        const response = await fetch(`https://www.eventbrite.com/api/v3/destination/events/?event_ids=${eventId}&expand=event_sales_status,ticket_availability,image,primary_venue,category,saves,primary_organizer,organization_id&include_parent_events=true`);
        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        let finalData = data.events;
        let myEventData;
        finalData.forEach(event => {
            // Parse the UTC date string and convert it to local time
            const localDate = moment.utc(event.event_sales_status.start_sales_date?.utc).local();
            
            // Format the local date as desired
            const formattedDateTime = localDate.format('MMMM DD, YYYY h:mm A');
            myEventData = {
                eventId: event.id,
                eventImg: event.image.original.url,
                eventTitle: event.name,
                eventUrl: event.url,
                eventSummary: event.summary,
                eventTickets: event.tickets_url,
                eventDateTime: formattedDateTime,
                eventAddress: event.primary_venue.address.localized_address_display,
                eventVenueName: event.primary_venue.name,
                eventLongitude: event.primary_venue.address.longitude,
                eventLatitude: event.primary_venue.address.latitude,
                eventVenue: event.primary_venue.name,
                eventMaxPrice: event.ticket_availability.maximum_ticket_price?.major_value === "0.00" ? "Free Tickets" : "$ " + event.ticket_availability.maximum_ticket_price?.major_value,
                eventMinPrice: event.ticket_availability.minimum_ticket_price?.major_value === "0.00" ? "Free Tickets" : "Starting From $ " + event.ticket_availability.minimum_ticket_price?.major_value,
                eventTags: [],
                eventOrganizerId: event.primary_organizer.id,
                organizerFacebook: event.primary_organizer.facebook,
                organizerTwitter: event.primary_organizer.twitter,
                organizerWebsite: event.primary_organizer.website_url,
                eventStatus: event.event_sales_status.default_message,      
            };
            event.tags.map(tags=>{
                myEventData.eventTags.push(tags.display_name); 
            });
        });
        return myEventData;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw new Error('Failed to fetch events from Eventbrite API');
    }

}

module.exports = { getEvents, getEventDetails };