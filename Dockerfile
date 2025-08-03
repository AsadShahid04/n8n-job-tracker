FROM n8nio/n8n:latest

# Copy workflow and resume into the container
COPY workflow.json /home/node/.n8n/
COPY resume.pdf /home/node/.n8n/

# Set environment variables for production
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=your_production_password_change_this
ENV N8N_ENCRYPTION_KEY=your_production_encryption_key_change_this
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=http
ENV WEBHOOK_URL=http://your-domain.com:5678/
ENV GENERIC_TIMEZONE=America/Los_Angeles
ENV N8N_USER_MANAGEMENT_DISABLED=false
ENV N8N_LOG_LEVEL=info

# Create directory for credentials
RUN mkdir -p /home/node/.n8n/credentials

# Set proper permissions
RUN chown -R node:node /home/node/.n8n

# Switch to node user
USER node

# Expose port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5678/healthz || exit 1 