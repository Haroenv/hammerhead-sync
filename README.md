# Hammerhead sync

API to force a sync of the Hammerhead routes, so you don't have to log in before a ride.

Intended to be used with IFTTT or similar to be triggered when you e.g. update Strava or Komoot.

## API

### /api/sync

method: POST
body: { "username": "user@example.com", "password": "password" }

Syncs the routes for the given user.

## Tech details

- running on Vercel on <https://hammerhead-sync.vercel.app>
