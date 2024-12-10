# Business Requirements
- users should be able to view Accounts and Vendors for a given company connected to Xero
- users should be able to download Accounts and Vendors lists as a json file

# Setup
- clone the repo
- run `npm install` on the `backend` and `frontend` directories
- ensure you have a Xero account and generate the Client ID and Client Secret for the Xero account you wish to connect
  
## Backend
- in the `backend` directory, create a `.env` file in the backend directory, and populate it as such:

```
CLIENT_ID=<YOUR_XERO_CLIENT_ID>
CLIENT_SECRET=<YOUR_XERO_CLIENT_SECRET>
REDIRECT_URI=<YOUR_XERO_REDIRECT_URI>
```
- if running locally, you can set the `REDIRECT_URI=http://localhost:5000/callback`, and configure the Redirect URI in your Xero App to be `http://localhost:5000/callback` as well
- run `node .\app.js` to start the server
- navigate to `http://localhost:5000/connect` to authenticate the app to Xero and choose which organization you would like to connect
- upon successful connection, you will be redirected to your Xero app's redirect URI page that says "Successfully connected to Xero!"
- you can view the Accounts and Vendors directly via `http://localhost:5000/accounts` and `http://localhost:5000/vendors` respectively

- you can run tests with `npm run test`

## Frontend
- in the `frontend` directory, run `npm run start` to start frontend web app
- select `Fetch Vendors` or `Fethc Accounts` to view the data for vendors and accounts from the backend
- select `Download Vendors File` or `Download Accounts File` to download the vendors and accounts files as a json file on your local disk
