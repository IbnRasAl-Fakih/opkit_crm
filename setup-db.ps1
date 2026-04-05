$ErrorActionPreference = 'Stop'

Write-Host 'Starting PostgreSQL via docker compose...'
docker compose up -d

Write-Host 'Waiting for PostgreSQL healthcheck...'
$containerName = 'opkit_crm_postgres'
$maxAttempts = 30

for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
  $status = docker inspect --format "{{.State.Health.Status}}" $containerName 2>$null

  if ($status -eq 'healthy') {
    Write-Host 'PostgreSQL is healthy.'
    break
  }

  if ($attempt -eq $maxAttempts) {
    throw 'PostgreSQL did not become healthy in time.'
  }

  Start-Sleep -Seconds 2
}

Write-Host 'Applying Prisma migrations...'
Push-Location backend
try {
  npm run prisma:migrate:deploy
} finally {
  Pop-Location
}

Write-Host 'Database is ready.'
