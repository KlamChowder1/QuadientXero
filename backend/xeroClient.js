require('dotenv').config();
const express = require('express');
const { XeroClient } = require('xero-node');

const app = express();
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
      (contact) => contact.contactStatus === 'ACTIVE'
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
