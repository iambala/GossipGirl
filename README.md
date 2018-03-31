# GossipGirl

The concept is inspired by “Gossip Girl” TV series. The service tracks changes made in a
database and notifies subscribers in real-time to changes they are interested in. For
instance, Blair only wants to track changes made to Chuck's whereabouts while Georgina
wants to track everything about everyone.

## System requirements
1. MongoDB **3.6** 
2. NodeJS 8.11.1

Note: MongoDB 3.6 or above is required as it implements Change Streams.

## Installation instructions

1. Download or Clone the repository to your computer 
2. Run `npm install` inside the project directory where the package.json is present
3. Run `node server.js`

You should see the following message

            Alrighty, I am listening on  3000

4. Now go to localhost:3000 and you should see a webpage titled Gossip Girl which has three forms.

## Application usage instructions

First form is used to subscribe to the events you are interested in. Second form is used to insert new users to the db.
Third form is used to update the existing users.

- As it is our first run, we need to insert some users using the second form. Once inserted, we should be able to see the users email populated in first form.
- Now we can specifically subscribe to a user, a field or everyone.
- Whenever a change happens in the database, subscribers will be notified based on their subscriptions.
- To test this, we can update a particular user by changing a field which we have subscribed to. 


## How it works?

User details are entered and mongoDB change stream API is used to watch for the changes in database. Whenever a change (i.e update) happens in database, socket events are triggered which are consumed by the javascript socket listeners at client side.
