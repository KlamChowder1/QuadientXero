const { XeroClient } = require('xero-node');

// Initialize Xero client with xero-node package
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

// Fetch Xero vendors
const getVendors = async (req, res) => {
  try {
    console.log('Fetching vendors from Xero...');

    if (!xero.tenantIds || xero.tenantIds.length === 0) {
      console.error('No tenant ID available.');
      return res
        .status(500)
        .send('No tenant ID available. Could not retrieve vendors');
    }

    const response = await xero.accountingApi.getContacts(xero.tenantIds[0]);
    const vendors = response.body.contacts.filter(
      // isSupplier means if they are a vendor or not
      (contact) => contact.isSupplier
    );
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error.message);
    res.status(500).send('Failed to fetch vendors.');
  }
};

// Fetch Xero accounts
const getAccounts = async (req, res) => {
  try {
    console.log('Fetching accounts from Xero...');

    if (!xero.tenantIds || xero.tenantIds.length === 0) {
      console.error('No tenant ID available.');
      return res
        .status(500)
        .send('No tenant ID available. Could not retrieve accounts');
    }

    const response = await xero.accountingApi.getAccounts(xero.tenantIds[0]);
    const accounts = response.body.accounts;
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error.message);
    res.status(500).send('Failed to fetch accounts.');
  }
};

// callback URI needed for the Xero integration
const handleCallback = async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    const tenants = await xero.updateTenants();

    if (tenants.length > 0) {
      xero.tenantIds = tenants.map((tenant) => tenant.tenantId);
      res.send('Successfully connected to Xero!');
    } else {
      res.status(500).send('No tenants found.');
    }
  } catch (error) {
    console.error('Error in callback:', error.message);
    res.status(500).send('Error connecting to Xero.');
  }
};

// Generate Xero consent URL to handle auth and login, need valid Client ID and Client Secret
const connectXero = async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (error) {
    res.status(500).send('Failed to generate consent URL.');
  }
};

module.exports = {
  getVendors,
  getAccounts,
  handleCallback,
  connectXero,
};
