#!/bin/bash

# Test health endpoint
echo "Testing health endpoint..."
curl -X GET http://localhost:3001/health

# Test offers endpoint
echo "Testing offers endpoint..."
curl -X GET http://localhost:3001/api/offers

# Test create offer
echo "Testing create offer..."
curl -X POST http://localhost:3001/api/offers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Offer",
    "description": "Test Description",
    "platform": "facebook",
    "adLibraryUrl": "https://facebook.com/ads/library"
  }'