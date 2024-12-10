const request = require('supertest');
const express = require('express');
const app = express();
const xeroRoutes = require('../routes/xeroRoutes');
app.use('/', xeroRoutes);

describe('Xero API Endpoints', () => {
  it('should return vendors', async () => {
    const response = await request(app).get('vendors');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return accounts', async () => {
    const response = await request(app).get('accounts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should handle callback', async () => {
    const response = await request(app).get('callback');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Successfully connected to Xero!');
  });
});
