$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$setupScript = Join-Path $projectRoot 'setup-db.ps1'
$backendDir = Join-Path $projectRoot 'backend'
$frontendDir = Join-Path $projectRoot 'frontend'

if (-not (Test-Path $setupScript)) {
  throw 'setup-db.ps1 was not found.'
}

Write-Host 'Preparing database...'
& $setupScript

Write-Host 'Starting backend in a new PowerShell window...'
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location '$backendDir'; npm run start:dev"
)

Write-Host 'Starting frontend in a new PowerShell window...'
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location '$frontendDir'; npm run dev"
)

Write-Host 'Backend and frontend startup commands were launched.'
