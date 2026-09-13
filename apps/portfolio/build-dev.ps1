# build-dev.ps1
# PowerShell script to build the application for development environment

Write-Host "Building for DEV environment..." -ForegroundColor Green

# Set environment variables
$env:ENVIRONMENT = "DEV"

# Run the build script
node build-prod.js

Write-Host "Build completed for DEV environment" -ForegroundColor Green
