#!/bin/sh
# Change to the correct directory
cd /usr/src/app;
# Compile contracts
npm run compile;
# Deploy contract
npm run deploy;