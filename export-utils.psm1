# Export project for distribution
function Export-Project {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $exportPath = ".\project_export_${timestamp}"
    
    Write-Host "Creating export directory..."
    New-Item -ItemType Directory -Path $exportPath

    Write-Host "Copying project files..."
    
    # Copy docker and configuration files
    Copy-Item "docker-compose.yml" -Destination $exportPath
    Copy-Item "docker-compose.monitoring.yml" -Destination $exportPath
    Copy-Item "docker-utils.psm1" -Destination $exportPath
    Copy-Item ".env.example" -Destination $exportPath
    
    # Copy backend
    $backendPath = Join-Path $exportPath "backend"
    New-Item -ItemType Directory -Path $backendPath
    Copy-Item "backend\*" -Destination $backendPath -Recurse -Exclude "node_modules", "coverage", ".env"
    
    # Copy frontend
    $frontendPath = Join-Path $exportPath "frontend"
    New-Item -ItemType Directory -Path $frontendPath
    Copy-Item "frontend\*" -Destination $frontendPath -Recurse -Exclude "node_modules", "coverage", "dist", ".env"
    
    # Copy monitoring
    $monitoringPath = Join-Path $exportPath "monitoring"
    New-Item -ItemType Directory -Path $monitoringPath -Force
    Copy-Item "monitoring" -Destination $exportPath -Recurse
    
    # Create README for deployment
    $readmeContent = @"
# Multi-Tenant Task Management Platform

## Deployment Instructions

1. Install Prerequisites:
   - Docker Desktop
   - PowerShell 5.0 or later

2. Setup Steps:
   a. Copy .env.example to .env and update the values
   b. Import the management module:
      ```powershell
      Import-Module .\docker-utils.psm1
      ```
   c. Start the services:
      ```powershell
      Start-Services
      ```

3. Access the Application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090

4. Useful Commands:
   - Check service status: Get-ServicesStatus
   - View service logs: Get-ServiceLogs -Service <service-name>
   - Stop all services: Stop-Services

## Environment Variables (.env)

Update the following variables in your .env file:
- JWT_SECRET: Your JWT secret key
- EMAIL_USER: Email for notifications
- EMAIL_PASSWORD: Email password
- GRAFANA_ADMIN_PASSWORD: Grafana admin password

## Additional Information

- Default Grafana login: admin/admin
- MongoDB data is persisted in Docker volumes
- Logs are available via Get-ServiceLogs command
"@
    Set-Content -Path (Join-Path $exportPath "README.md") -Value $readmeContent

    # Create environment variables example file
    $envExampleContent = @"
# MongoDB
MONGO_INITDB_DATABASE=multi_tenant_db

# JWT Authentication
JWT_SECRET=your-secret-key-here

# Email Configuration
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password

# Grafana
GRAFANA_ADMIN_PASSWORD=admin

# Frontend URL
FRONTEND_URL=http://localhost
"@
    Set-Content -Path (Join-Path $exportPath ".env.example") -Value $envExampleContent

    # Create zip archive
    Compress-Archive -Path $exportPath\* -DestinationPath "project_export_${timestamp}.zip" -Force
    
    # Cleanup
    Remove-Item -Path $exportPath -Recurse -Force
    
    Write-Host "Export completed: project_export_${timestamp}.zip"
}

Export-ModuleMember -Function Export-Project
