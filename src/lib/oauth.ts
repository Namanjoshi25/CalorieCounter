"use server"

import crypto from 'crypto';
import axios from 'axios';

// Function to generate the OAuth 1.0 signature and make a request
export const fetchFoodData = async (searchExpression: string) => {
  const consumerKey = process.env.CLIENT_ID || '';
  const consumerSecret = process.env.CLIENT_SECRET || '';
  const fatSecretRestUrl = 'https://platform.fatsecret.com/rest/server.api';

  const reqObj = {
    method: 'foods.search',
    format:"json",
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).substr(2),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(new Date().getTime() / 1000).toString(),
    oauth_version: '1.0',
    search_expression: searchExpression,
  };
  
type paramsObj ={
    method: string,
    oauth_consumer_key: string,
    oauth_nonce: number,
    oauth_signature_method: string,
    oauth_timestamp: number,
    oauth_version: string,
    search_expression: string,
  };

  // Construct the parameter string
  const paramsStr = Object.keys(reqObj)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(reqObj[key])}`)
    .join('&');

  // Create the signature base string
  const sigBaseStr = `POST&${encodeURIComponent(fatSecretRestUrl)}&${encodeURIComponent(paramsStr)}`;

  // Concatenate the consumer secret and access secret (if applicable)
  const signingKey = `${encodeURIComponent(consumerSecret)}&`;

  // Generate the HMAC-SHA1 signature
  const hashedBaseStr = crypto.createHmac('sha1', signingKey).update(sigBaseStr).digest('base64');

  // Add the OAuth signature to the request object
  reqObj.oauth_signature = hashedBaseStr;

  try {
    // Make the POST request to the FatSecret API
    const response = await axios.post(fatSecretRestUrl, null, {
      params: reqObj,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching food data:', error);
    throw new Error('Failed to fetch food data');
  }
};
