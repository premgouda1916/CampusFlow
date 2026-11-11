# CampusFlow - Local Development Orchestrator for Windows PowerShell
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "        CampusFlow Local Development Environment Launcher   " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Configure Java 21 Environment
$java21Path = "C:\Program Files\Java\jdk-21.0.10"
if (Test-Path $java21Path) {
    $env:JAVA_HOME = $java21Path
    Write-Host "[OK] Configured JAVA_HOME to: $java21Path" -ForegroundColor Green
} else {
    Write-Host "[INFO] Using existing system JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Yellow
}

# 2. Check Port 8081 Availability
$portBusy = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
if ($portBusy) {
    Write-Host "[WARN] Port 8081 is already in use by process ID $($portBusy.OwningProcess)." -ForegroundColor Yellow
    Write-Host "Please terminate the process or configure another port in application.yml." -ForegroundColor Yellow
}

# 3. Start Spring Boot Backend in a New Window
Write-Host "[...] Launching Spring Boot 3 Backend on port 8081..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME='$env:JAVA_HOME'; cd '$PSScriptRoot\backend'; Write-Host 'Starting CampusFlow Backend (Port 8081)...' -ForegroundColor Green; mvn spring-boot:run"

# 4. Wait for Backend Port 8081 to Listen
Write-Host "[...] Waiting for Backend to initialize and listen on port 8081..." -ForegroundColor Cyan
$retries = 30
$backendReady = $false
while ($retries -gt 0) {
    Start-Sleep -Seconds 2
    $check = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
    if ($check) {
        $backendReady = $true
        break
    }
    $retries--
    Write-Host "." -NoNewline
}
Write-Host ""

if ($backendReady) {
    Write-Host "[OK] Backend is LIVE on http://localhost:8081" -ForegroundColor Green
    Write-Host "     Swagger UI: http://localhost:8081/swagger-ui.html" -ForegroundColor DarkCyan
} else {
    Write-Host "[WARN] Backend taking longer than expected to bind to 8081. Proceeding with frontend launch..." -ForegroundColor Yellow
}

# 5. Start Frontend Vite Server in a New Window
Write-Host "[...] Launching React 18 Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting CampusFlow Frontend (Port 5173)...' -ForegroundColor Green; npm run dev"

# 6. Launch Browser to Frontend
Start-Sleep -Seconds 3
Write-Host "[OK] Opening CampusFlow in your default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CampusFlow is running! Check the separate console windows.  " -ForegroundColor Cyan
Write-Host " - Web Portal: http://localhost:5173                        " -ForegroundColor White
Write-Host " - REST API:   http://localhost:8081                        " -ForegroundColor White
Write-Host " - Swagger UI: http://localhost:8081/swagger-ui.html        " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan
