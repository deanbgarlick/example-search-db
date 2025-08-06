#!/bin/bash

# Make the script exit on any error
set -e

echo "Testing autocomplete endpoint..."

# Test with different name prefixes
echo -e "\n1. Autocomplete with 'jo':"
curl -s "http://localhost:3001/autocomplete?query=jo" | jq '.'

echo -e "\n2. Autocomplete with 'mar':"
curl -s "http://localhost:3001/autocomplete?query=mar" | jq '.'

echo -e "\n3. Autocomplete with 'sa':"
curl -s "http://localhost:3001/autocomplete?query=sa" | jq '.'

# Test with a longer prefix
echo -e "\n4. Autocomplete with 'michael':"
curl -s "http://localhost:3001/autocomplete?query=michael" | jq '.'

# Test with an email prefix
echo -e "\n5. Autocomplete with '@gm':"
curl -s "http://localhost:3001/autocomplete?query=@gm" | jq '.'

echo -e "\nAll autocomplete tests completed!" 