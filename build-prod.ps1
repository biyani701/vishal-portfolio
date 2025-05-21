# build-prod.ps1
# PowerShell script to build the application for production environment

Write-Host "Building for PROD environment..." -ForegroundColor Green

# Set environment variables
$env:ENVIRONMENT = "PROD"
$env:REACT_APP_AUTH_SERVER_URL = "https://my-next-auth-app-ten.vercel.app"
$env:REACT_APP_CLIENT_URL = "https://vishal.biyani.xyz"

# Run the build script
node build-prod.js

Write-Host "Build completed for PROD environment" -ForegroundColor Green
