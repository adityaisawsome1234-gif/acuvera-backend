#!/bin/bash
# SSL Certificate Setup Script for Acuvera Enterprise
# This script helps set up Let's Encrypt SSL certificates using Certbot

set -e

echo "=========================================="
echo "Acuvera Enterprise - SSL Certificate Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Get domain from user
read -p "Enter your API domain (e.g., api.your-domain.com): " API_DOMAIN
read -p "Enter your frontend domain (e.g., app.your-domain.com) [optional]: " FRONTEND_DOMAIN

# Create webroot directory for ACME challenge
mkdir -p /var/www/certbot

# Obtain certificate for API domain
echo ""
echo "Obtaining SSL certificate for $API_DOMAIN..."
certbot certonly --webroot \
    -w /var/www/certbot \
    -d $API_DOMAIN \
    --email admin@${API_DOMAIN#*.} \
    --agree-tos \
    --non-interactive

# Obtain certificate for frontend domain if provided
if [ ! -z "$FRONTEND_DOMAIN" ]; then
    echo ""
    echo "Obtaining SSL certificate for $FRONTEND_DOMAIN..."
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d $FRONTEND_DOMAIN \
        --email admin@${FRONTEND_DOMAIN#*.} \
        --agree-tos \
        --non-interactive
fi

# Set up auto-renewal
echo ""
echo "Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "=========================================="
echo "SSL certificates installed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update nginx.conf with certificate paths:"
echo "   ssl_certificate /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;"
echo "   ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;"
echo ""
echo "2. Test nginx configuration: sudo nginx -t"
echo "3. Reload nginx: sudo systemctl reload nginx"
echo ""
echo "Certificates will auto-renew via certbot.timer"
