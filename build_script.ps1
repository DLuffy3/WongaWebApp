Write-Host "=== Starting build script ===" -ForegroundColor Cyan

$solutionDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendProject = "$solutionDir\WongaWebApp.Server\WongaWebApp.Server.csproj"
$frontendDir = "$solutionDir\wongawebapp.client"
$publishDir = "$solutionDir\publish"

if (Test-Path $publishDir) {
    Remove-Item -Recurse -Force $publishDir
}
New-Item -ItemType Directory -Path $publishDir -Force | Out-Null

Write-Host "`n>>> Building backend..." -ForegroundColor Yellow
dotnet restore $backendProject
if ($LASTEXITCODE -ne 0) { Write-Host "Backend restore failed" -ForegroundColor Red; exit 1 }

dotnet build $backendProject -c Release
if ($LASTEXITCODE -ne 0) { Write-Host "Backend build failed" -ForegroundColor Red; exit 1 }

dotnet publish $backendProject -c Release -o "$publishDir\backend"
if ($LASTEXITCODE -ne 0) { Write-Host "Backend publish failed" -ForegroundColor Red; exit 1 }
Write-Host "Backend published to $publishDir\backend" -ForegroundColor Green

Write-Host "`n>>> Building frontend..." -ForegroundColor Yellow
Set-Location $frontendDir

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed" -ForegroundColor Red; exit 1 }

npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Frontend build failed" -ForegroundColor Red; exit 1 }

Copy-Item -Recurse "$frontendDir\dist\*" "$publishDir\frontend" -Force
Write-Host "Frontend built and copied to $publishDir\frontend" -ForegroundColor Green

Set-Location $solutionDir

Write-Host "`n=== Build script completed successfully! ===" -ForegroundColor Cyan
Write-Host "Output folder: $publishDir"