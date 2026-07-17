#!/bin/bash
set -e

TOKEN="${GITHUB_TOKEN:-$1}"

# Try to load from .env.local if TOKEN is empty
if [ -z "$TOKEN" ] && [ -f .env.local ]; then
  TOKEN=$(grep -E "^GITHUB_TOKEN=" .env.local | cut -d'=' -f2-)
fi

if [ -z "$TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable, argument, or .env.local configuration is required."
  echo "Usage: GITHUB_TOKEN=your_token bash scripts/upload.sh OR bash scripts/upload.sh your_token"
  exit 1
fi

OWNER="palromproductssrl-sys"
REPO="palrom"
BRANCH="main"
VERSION=$(grep '"version":' package.json | cut -d'"' -f4)

update_file() {
  local LOCAL_PATH="$1"
  local REMOTE_PATH="$2"

  echo "Processing $REMOTE_PATH..."

  # Calculate local Git blob SHA
  local FILE_SIZE
  FILE_SIZE=$(stat -f%z "$LOCAL_PATH")
  local LOCAL_SHA
  LOCAL_SHA=$( (printf "blob $FILE_SIZE\0"; cat "$LOCAL_PATH") | shasum -a 1 | cut -d' ' -f1 )

  # Get the current file SHA from GitHub API
  echo "Fetching remote SHA for $REMOTE_PATH..."
  local API_RES
  API_RES=$(curl -s -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$OWNER/$REPO/contents/$REMOTE_PATH?ref=$BRANCH")

  # Extract SHA using jq
  local SHA
  SHA=$(echo "$API_RES" | jq -r '.sha // empty')

  if [ "$LOCAL_SHA" = "$SHA" ]; then
    echo "Skipping $REMOTE_PATH (content matches remote)."
    return 0
  fi

  # Read file and base64 encode it (clean without linebreaks)
  local CONTENT
  CONTENT=$(base64 < "$LOCAL_PATH" | tr -d '\n')

  # Construct payload
  local PAYLOAD
  if [ -n "$SHA" ] && [ "$SHA" != "null" ]; then
    echo "Found remote SHA: $SHA"
    PAYLOAD=$(jq -n \
      --arg msg "Update $REMOTE_PATH to v$VERSION" \
      --arg content "$CONTENT" \
      --arg sha "$SHA" \
      --arg branch "$BRANCH" \
      '{message: $msg, content: $content, sha: $sha, branch: $branch}')
  else
    echo "No remote SHA found (new file)."
    PAYLOAD=$(jq -n \
      --arg msg "Update $REMOTE_PATH to v$VERSION" \
      --arg content "$CONTENT" \
      --arg branch "$BRANCH" \
      '{message: $msg, content: $content, branch: $branch}')
  fi

  # Upload the file
  echo "Uploading updated file to GitHub..."
  local PUT_RES
  PUT_RES=$(curl -s -X PUT \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "https://api.github.com/repos/$OWNER/$REPO/contents/$REMOTE_PATH")

  local ERROR
  ERROR=$(echo "$PUT_RES" | jq -r '.message // empty')
  if [ -n "$ERROR" ] && [ "$ERROR" != "null" ] && [ "$ERROR" != "" ]; then
    echo "Error updating $REMOTE_PATH: $ERROR"
    echo "$PUT_RES"
    exit 1
  else
    echo "Success: $REMOTE_PATH updated on GitHub!"
  fi
}

update_file "src/components/Footer.js" "src/components/Footer.js"
update_file "src/components/ContactSection.js" "src/components/ContactSection.js"
update_file "src/components/CartSidebar.js" "src/components/CartSidebar.js"
update_file "package.json" "package.json"
update_file "next.config.mjs" "next.config.mjs"
update_file "src/app/globals.css" "src/app/globals.css"
update_file "src/app/portal/admin/page.js" "src/app/portal/admin/page.js"
update_file "src/app/api/vacancies/route.js" "src/app/api/vacancies/route.js"
update_file "src/app/api/news/route.js" "src/app/api/news/route.js"
update_file "src/app/api/inquire/route.js" "src/app/api/inquire/route.js"
update_file "src/app/api/portal/inquiries/route.js" "src/app/api/portal/inquiries/route.js"
update_file "src/app/api/portal/admin/inquiries/route.js" "src/app/api/portal/admin/inquiries/route.js"
update_file "src/app/api/portal/download-pdf/route.js" "src/app/api/portal/download-pdf/route.js"
update_file "src/app/api/telemetry/route.js" "src/app/api/telemetry/route.js"
update_file "src/app/api/upload/route.js" "src/app/api/upload/route.js"
update_file "vacancies.json" "vacancies.json"
update_file "news.json" "news.json"
update_file "src/app/configurator/page.js" "src/app/configurator/page.js"
update_file "src/app/configurator/v2/page.js" "src/app/configurator/v2/page.js"
update_file "src/app/configurator/v3/page.js" "src/app/configurator/v3/page.js"
update_file "src/app/configurator/v4/page.js" "src/app/configurator/v4/page.js"
update_file "src/app/about/page.js" "src/app/about/page.js"
update_file "src/app/page.js" "src/app/page.js"
update_file "src/app/products/page.js" "src/app/products/page.js"
update_file "src/app/blanks/page.js" "src/app/blanks/page.js"
update_file "src/app/rods/page.js" "src/app/rods/page.js"
update_file "src/app/profiles/page.js" "src/app/profiles/page.js"
update_file "src/app/specials/page.js" "src/app/specials/page.js"
update_file "src/app/careers/page.js" "src/app/careers/page.js"
update_file "src/app/apply/page.js" "src/app/apply/page.js"
update_file "src/app/api/contact/route.js" "src/app/api/contact/route.js"
update_file "scripts/upload.sh" "scripts/upload.sh"

echo "All files successfully uploaded to GitHub!"
