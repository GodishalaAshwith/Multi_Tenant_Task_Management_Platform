# Start all services
function Start-Services {
    Write-Host "Starting application services..."
    docker-compose up -d
    
    Write-Host "Starting monitoring services..."
    docker-compose -f docker-compose.monitoring.yml up -d
}

# Stop all services
function Stop-Services {
    Write-Host "Stopping monitoring services..."
    docker-compose -f docker-compose.monitoring.yml down
    
    Write-Host "Stopping application services..."
    docker-compose down
}

# Check service status
function Get-ServicesStatus {
    Write-Host "Application Services Status:"
    docker-compose ps
    
    Write-Host "`nMonitoring Services Status:"
    docker-compose -f docker-compose.monitoring.yml ps
}

# View logs
function Get-ServiceLogs {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Service
    )
    
    if ($Service -in @("prometheus", "grafana", "node-exporter", "cadvisor")) {
        docker-compose -f docker-compose.monitoring.yml logs --tail=100 -f $Service
    } else {
        docker-compose logs --tail=100 -f $Service
    }
}

Export-ModuleMember -Function Start-Services, Stop-Services, Get-ServicesStatus, Get-ServiceLogs
