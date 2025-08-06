#!/bin/bash

# Make the script exit on any error
set -e

echo "Testing User CRUD endpoints..."

# Create a new user
echo -e "\n1. Creating a new user:"
NEW_USER=$(curl -s -X POST "http://localhost:3001/users" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "fullName": "Test User",
    "email": "test@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "country": "US"
  }' | jq '.')
echo "$NEW_USER"

# Get all users
echo -e "\n2. Getting all users (with pagination):"
curl -s "http://localhost:3001/users?page=1&limit=5" | jq '.'

# Get single user
echo -e "\n3. Getting the created user:"
curl -s "http://localhost:3001/users/test-user-123" | jq '.'

# Update user
echo -e "\n4. Updating the user:"
curl -s -X PUT "http://localhost:3001/users/test-user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Test User",
    "email": "updated@example.com"
  }' | jq '.'

# Get updated user
echo -e "\n5. Getting the updated user:"
curl -s "http://localhost:3001/users/test-user-123" | jq '.'

# Delete user
echo -e "\n6. Deleting the user:"
curl -s -X DELETE "http://localhost:3001/users/test-user-123" -w "\nStatus: %{http_code}\n"

# Verify deletion
echo -e "\n7. Trying to get deleted user (should return 404):"
curl -s "http://localhost:3001/users/test-user-123" -w "\nStatus: %{http_code}\n"

echo -e "\nAll CRUD tests completed!" 