# Some changes from last time

## Local modules
The Trakt API stuff is in the /modules/trakt folder.


## Secured API settings using .env
1. Use the dotenv module (npm i dotenv) to save values in environment variables.
2. Place your values in the .env file with the custom environment variables written in all caps equals the value (one per line).

## To run
1. Modify the .env file values to ones which reflect your app settings.

## OAuth (EXTRA)
Read the OAuth PDF to better understand OAuth. This is not needed for every request nor is it needed for every REST API. OAuth is a standard protocol (i.e. a set of steps to follow) for user authorization. User authorization is the act of the user giving permission to--or authorizing--a site to use that user's data, hence authorization. In order to keep user data safe and to ensure the user is actually the one authorizing the usage of the data, there are a couple steps to the authorization process in order to keep it secure. The PPTX file gives a quick run-down of the steps in a diagram.
1. Make sure to modify values in the .env file with appropriate values from your app settings.
2. The redirect URI should also be registered as a redirect URI in your app settings (YOU need to add this). The redirect URI is what Trakt will redirect back to during the authorization process (after the user logs in and authorizes the data sharing).