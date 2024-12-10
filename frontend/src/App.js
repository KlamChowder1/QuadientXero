import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
    <div className="body">
      <h1>Xero Sample Company Data Fetcher</h1>
      <div className="data-container">
        <div className="section">
          <h2>Vendors</h2>
          <div className="button-group">
            <button onClick={fetchVendors}>Fetch Vendors</button>
            <button onClick={downloadVendorsFile}>Download Vendors File</button>
          </div>
          <pre>{JSON.stringify(vendors, null, 2)}</pre>
        </div>

        <div className="section">
          <h2>Accounts</h2>
          <div className="button-group">
            <button onClick={fetchAccounts}>Fetch Accounts</button>
            <button onClick={downloadAccountsFile}>
              Download Accounts File
            </button>
          </div>
          <pre>{JSON.stringify(accounts, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;
