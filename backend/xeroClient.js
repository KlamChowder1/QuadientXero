require('dotenv').config();
const express = require('express');
const { XeroClient } = require('xero-node');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const xero = new XeroClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUris: [process.env.REDIRECT_URI],
  scopes: [
    'offline_access',
    'accounting.contacts.read',
    'accounting.transactions.read',
    'accounting.settings.read',
  ],
});

app.get('/connect', async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (error) {
    res.status(500).send('Failed to generate consent URL.');
  }
});

app.get('/callback', async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    console.log('TokenSet:', tokenSet);

    const tenants = await xero.updateTenants();
    console.log('Tenants:', tenants);

    if (tenants.length > 0) {
      xero.tenantIds = tenants.map((tenant) => tenant.tenantId);
      console.log('Tenant IDs:', xero.tenantIds);
    } else {
      console.error('No tenants found.');
    }

    res.send('Successfully connected to Xero!');
  } catch (error) {
    console.error('Error in callback:', error.response?.data || error.message);
    res.status(500).send('Error connecting to Xero.');
  }
});

app.get('/vendors', async (req, res) => {
  try {
    console.log('Fetching vendors from Xero...');

    if (!xero.tenantIds || xero.tenantIds.length === 0) {
      console.error('No tenant ID available.');
      return res
        .status(500)
        .send('No tenant ID available. Could not retrieve vendors');
    }

    const response = await xero.accountingApi.getContacts(xero.tenantIds[0]);
    console.log('Xero API Response:', response.body);

    const vendors = response.body.contacts.filter(
      (contact) => contact.isSupplier && contact.contactStatus === 'ACTIVE'
    );
    res.json(vendors);
  } catch (error) {
    console.error(
      'Error fetching vendors:',
      error.response?.data || error.message
    );
    res.status(500).send('Failed to fetch vendors.');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

app.get('/accounts', async (req, res) => {
  try {
    console.log('Fetching accounts from Xero...');

    if (!xero.tenantIds || xero.tenantIds.length === 0) {
      console.error('No tenant ID available.');
      return res
        .status(500)
        .send('No tenant ID available. Could not retrieve vendors');
    }

    const response = await xero.accountingApi.getAccounts(xero.tenantIds[0]);
    console.log('Xero API Response:', response.body);

    if (!response.body.accounts) {
      throw new Error('No accounts found in the response.');
    }

    const accounts = response.body.accounts;
    res.json(accounts);
  } catch (error) {
    console.error(
      'Error fetching accounts:',
      error.response?.data || error.message
    );
    res.status(500).send('Failed to fetch accounts.');
  }
});

app.get('/save-accounts', async (req, res) => {
  try {
    console.log('Fetching accounts from Xero...');

    if (!xero.tenantIds || xero.tenantIds.length === 0) {
      console.error('No tenant ID available.');
      return res
        .status(500)
        .send(
          'No tenant ID available. Ensure you are connected to a Xero organization.'
        );
    }

    const response = await xero.accountingApi.getAccounts(xero.tenantIds[0]);
    console.log('Xero API Response:', response.body);

    const accounts = response.body.accounts;
    const filePath = path.join(__dirname, 'accounts.json');
    fs.writeFile(filePath, JSON.stringify(accounts, null, 2), (err) => {
      if (err) {
        console.error('Error saving accounts to file:', err);
        return res.status(500).send('Failed to save accounts to file.');
      }
      console.log('Accounts saved to accounts.json');
    });

    res.json(accounts);
  } catch (error) {
    console.error(
      'Error fetching accounts:',
      error.response?.data || error.message
    );
    res.status(500).send('Failed to fetch accounts.');
  }
});
