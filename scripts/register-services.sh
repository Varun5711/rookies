#!/bin/bash

# Service Registration Script
# Registers all domain services with the Service Registry

REGISTRY_URL=${REGISTRY_URL:-"http://localhost:3002/api/registry/services"}

echo "Registering services with Service Registry at $REGISTRY_URL"
echo "============================================================"

# Healthcare Service
echo "Registering Healthcare Service..."
curl -s -X POST "$REGISTRY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "healthcare",
    "displayName": "Healthcare Service",
    "description": "Healthcare platform for hospital discovery, doctor appointments, and medical services",
    "baseUrl": "http://localhost:3010",
    "healthEndpoint": "/api/health",
    "status": "active",
    "version": "1.0.0",
    "tags": ["healthcare", "hospitals", "doctors", "appointments"],
    "isPublic": false,
    "requiredRoles": ["citizen", "admin"]
  }' | jq .

echo ""

# Agriculture Service
echo "Registering Agriculture Service..."
curl -s -X POST "$REGISTRY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "agriculture",
    "displayName": "Agriculture Service",
    "description": "Agricultural platform for crop advisories, government schemes, and market prices",
    "baseUrl": "http://localhost:3011",
    "healthEndpoint": "/api/health",
    "status": "active",
    "version": "1.0.0",
    "tags": ["agriculture", "farming", "schemes", "market-prices"],
    "isPublic": false,
    "requiredRoles": ["citizen", "admin"]
  }' | jq .

echo ""

# Urban Service
echo "Registering Urban Service..."
curl -s -X POST "$REGISTRY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "urban",
    "displayName": "Urban Services",
    "description": "Urban civic services platform for grievance redressal and city services",
    "baseUrl": "http://localhost:3012",
    "healthEndpoint": "/api/health",
    "status": "active",
    "version": "1.0.0",
    "tags": ["urban", "civic", "grievances", "city-services"],
    "isPublic": false,
    "requiredRoles": ["citizen", "admin"]
  }' | jq .

echo ""
echo "============================================================"
echo "Service registration complete!"
echo ""
echo "Verify by calling: curl $REGISTRY_URL"
