import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [vendors, setVendors] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vendors');
      console.log(response.data);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts');
      setAccounts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const downloadVendorsFile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vendors', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vendors.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading vendors file:', error);
    }
  };

  const downloadAccountsFile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'accounts.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading accounts file:', error);
    }
  };

  return (
    <div>
      <h1>Xero Data Fetcher</h1>

      <button onClick={fetchVendors}>Fetch Vendors</button>
      <button onClick={fetchAccounts}>Fetch Accounts</button>

      <div>
        <h2>Vendors</h2>
        <pre>{JSON.stringify(vendors, null, 2)}</pre>
        <button onClick={downloadVendorsFile}>Download Vendors File</button>
      </div>

      <div>
        <h2>Accounts</h2>
        <pre>{JSON.stringify(accounts, null, 2)}</pre>
        <button onClick={downloadAccountsFile}>Download Accounts File</button>
      </div>
    </div>
  );
};

export default App;
