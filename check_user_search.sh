#!/bin/bash

# Make the script exit on any error
set -e

echo "Testing user search endpoint..."

# Test with a name query
echo -e "\n1. Searching for 'gilbert':"
curl -s "http://localhost:3001/search?query=gilbert" | jq '.'

# Test with a country query
echo -e "\n2. Searching for users from 'US':"
curl -s "http://localhost:3001/search?query=US" | jq '.'

# Test with an email domain
echo -e "\n3. Searching for '@gmail.com' emails:"
curl -s "http://localhost:3001/search?query=@gmail.com" | jq '.'

echo -e "\nAll search tests completed!" 