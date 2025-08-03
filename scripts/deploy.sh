#!/bin/bash

# n8n Job Tracker Deployment Script
# This script helps deploy the n8n job tracker to a VPS

set -e

echo "🚀 n8n Job Tracker Deployment Script"
echo "====================================="

# Configuration
VPS_HOST="your-vps-host.com"
VPS_USER="your-username"
VPS_PORT="22"
DOCKER_IMAGE="n8n-job-tracker"
CONTAINER_NAME="n8n-job-tracker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    if [ ! -f "workflow.json" ]; then
        print_error "workflow.json not found!"
        exit 1
    fi
    
    if [ ! -f "resume.pdf" ]; then
        print_error "resume.pdf not found!"
        exit 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found!"
        exit 1
    fi
    
    print_status "All required files found ✓"
}

# Build Docker image
build_image() {
    print_status "Building Docker image..."
    docker build -t $DOCKER_IMAGE .
    
    if [ $? -eq 0 ]; then
        print_status "Docker image built successfully ✓"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Deploy to VPS
deploy_to_vps() {
    print_status "Deploying to VPS..."
    
    # Create remote directory
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "mkdir -p ~/n8n-job-tracker"
    
    # Copy files to VPS
    scp -P $VPS_PORT docker-compose.yml $VPS_USER@$VPS_HOST:~/n8n-job-tracker/
    scp -P $VPS_PORT workflow.json $VPS_USER@$VPS_HOST:~/n8n-job-tracker/
    scp -P $VPS_PORT resume.pdf $VPS_USER@$VPS_HOST:~/n8n-job-tracker/
    scp -P $VPS_PORT Dockerfile $VPS_USER@$VPS_HOST:~/n8n-job-tracker/
    scp -P $VPS_PORT .dockerignore $VPS_USER@$VPS_HOST:~/n8n-job-tracker/
    
    # Build and run on VPS
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << 'EOF'
        cd ~/n8n-job-tracker
        
        # Stop existing container if running
        docker stop n8n-job-tracker 2>/dev/null || true
        docker rm n8n-job-tracker 2>/dev/null || true
        
        # Build the image
        docker build -t n8n-job-tracker .
        
        # Create data volume if it doesn't exist
        docker volume create n8n-data 2>/dev/null || true
        
        # Run the container
        docker run -d \
            --name n8n-job-tracker \
            --restart always \
            -p 5678:5678 \
            -v n8n-data:/home/node/.n8n \
            n8n-job-tracker
        
        # Check if container is running
        if docker ps | grep -q n8n-job-tracker; then
            echo "✅ n8n Job Tracker deployed successfully!"
            echo "🌐 Access at: http://$(hostname -I | awk '{print $1}'):5678"
        else
            echo "❌ Deployment failed!"
            docker logs n8n-job-tracker
        fi
EOF
}

# Show logs
show_logs() {
    print_status "Showing container logs..."
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "docker logs -f n8n-job-tracker"
}

# Stop service
stop_service() {
    print_status "Stopping n8n service..."
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "docker stop n8n-job-tracker"
    print_status "Service stopped ✓"
}

# Start service
start_service() {
    print_status "Starting n8n service..."
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "docker start n8n-job-tracker"
    print_status "Service started ✓"
}

# Restart service
restart_service() {
    print_status "Restarting n8n service..."
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "docker restart n8n-job-tracker"
    print_status "Service restarted ✓"
}

# Check status
check_status() {
    print_status "Checking service status..."
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "docker ps | grep n8n-job-tracker || echo 'Container not running'"
}

# Main menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Deploy to VPS"
    echo "2) Show logs"
    echo "3) Stop service"
    echo "4) Start service"
    echo "5) Restart service"
    echo "6) Check status"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            check_files
            build_image
            deploy_to_vps
            ;;
        2)
            show_logs
            ;;
        3)
            stop_service
            ;;
        4)
            start_service
            ;;
        5)
            restart_service
            ;;
        6)
            check_status
            ;;
        7)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option"
            show_menu
            ;;
    esac
}

# Check if configuration is set
if [ "$VPS_HOST" = "your-vps-host.com" ] || [ "$VPS_USER" = "your-username" ]; then
    print_error "Please update the VPS_HOST and VPS_USER variables in this script"
    exit 1
fi

# Show menu
show_menu 