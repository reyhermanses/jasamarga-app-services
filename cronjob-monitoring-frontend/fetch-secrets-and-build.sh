#!/bin/bash

# Fetch secrets from OpenShift Secret
oc get secret frontend-secrets -o json | jq -r '.data | to_entries[] | "export \(.key)=\(.value | @base64d)"' > .env

# Build the app for production
npm run build
