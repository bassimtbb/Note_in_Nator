FROM vikunja/vikunja:latest

# Health check pour vérifier que Vikunja fonctionne
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3456/api/v1/health || exit 1
