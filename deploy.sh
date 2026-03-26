#!/bin/bash
# deploy_next.sh - Script to create tar ball of .next directory and upload it

# Set variables
NEXT_DIR="./app/.next"  # Path to .next directory - adjust as needed
OUTPUT_FILE="next-deploy.tar.gz"  # Name of the tar ball
DEPLOY_URL="https://gsoc.rocket.chat/rcconf-deploy/deploy"
AUTH_HEADER="Basic cmNhZG1pbjpnc29jMjAyNC4u"

# Build the Next.js application
echo "Building the Next.js application..."
cd app || { echo "Error: Directory 'app' not found"; exit 1; }
yarn build
if [ $? -ne 0 ]; then
  echo "Error: Build failed"
  exit 1
fi
cd ..
echo "Build completed successfully."

# Check if .next directory exists
if [ ! -d "$NEXT_DIR" ]; then
  echo "Error: .next directory not found at $NEXT_DIR"
  echo "Please make sure to build the Next.js application first."
  exit 1
fi

echo "Creating tar ball of .next directory..."

# Create tar ball
tar -czf "$OUTPUT_FILE" -C "$(dirname "$NEXT_DIR")" "$(basename "$NEXT_DIR")"

# Check if tar ball was created successfully
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Error: Failed to create tar ball"
  exit 1
fi

echo "Tar ball created: $OUTPUT_FILE"
echo "Uploading to deployment endpoint..."

# Upload using curl
RESPONSE=$(curl --location "$DEPLOY_URL" \
  --header "Authorization: $AUTH_HEADER" \
  --form "file=@\"$OUTPUT_FILE\"" \
  --write-out "%{http_code}" \
  --silent \
  --output /tmp/curl_response.txt)

# Check HTTP status code
if [[ "$RESPONSE" -ge 200 && "$RESPONSE" -lt 300 ]]; then
  echo "Deployment successful!"
  cat /tmp/curl_response.txt
else
  echo "Error: Deployment failed with status code $RESPONSE"
  cat /tmp/curl_response.txt
  exit 1
fi

# Clean up
echo "Cleaning up temporary files..."
rm "$OUTPUT_FILE"
rm /tmp/curl_response.txt

echo "Deployment process completed!"