# Monitoring Setup

This directory contains the monitoring setup for the Multi-Tenant Task Management Platform using Prometheus, Grafana, Node Exporter, and cAdvisor.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **Node Exporter**: System metrics collection
- **cAdvisor**: Container metrics collection
- **Alertmanager**: Alert handling and notification

## Directory Structure

```
monitoring/
├── alertmanager/
│   └── config.yml          # Alertmanager configuration
├── prometheus/
│   ├── prometheus.yml      # Main Prometheus configuration
│   └── rules/
│       └── alerts.yml      # Alert rules
```

## Default Ports

- Prometheus: 9090
- Grafana: 3000
- Node Exporter: 9100
- cAdvisor: 8080
- Alertmanager: 9093

## Grafana Setup

1. Access Grafana at http://localhost:3000
2. Default login: admin/admin
3. Add Prometheus data source:
   - URL: http://prometheus:9090
   - Access: Browser

## Default Dashboards

1. System Overview:

   - CPU, Memory, Disk usage
   - Network I/O
   - System load

2. Container Metrics:

   - Container CPU usage
   - Container memory usage
   - Container network I/O
   - Container disk I/O

3. Application Metrics:
   - HTTP request rate
   - Response times
   - Error rates
   - MongoDB metrics

## Alert Rules

- High CPU Usage (>80% for 5m)
- High Memory Usage (>80% for 5m)
- Low Disk Space (<20% for 5m)

## Maintenance

1. Verify Prometheus targets:

   ```
   http://localhost:9090/targets
   ```

2. Check Alertmanager status:

   ```
   http://localhost:9093
   ```

3. View alert rules:
   ```
   http://localhost:9090/rules
   ```
