# Hamlet Backend API Gateway
# Cloudflare Worker for Railway Failover

export default {
  async fetch(request, env) {
    // Configuration
    const PRIMARY_BACKEND = env.RAILWAY_BACKEND_URL || 'https://hamlet-unified-complete-2027-production.up.railway.app';
    const BACKUP_BACKEND = env.BACKUP_BACKEND_URL || null;
    const HEALTH_CHECK_PATH = '/health';
    const TIMEOUT_MS = 5000;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Extract request details
    const url = new URL(request.url);
    const path = url.pathname;
    const queryString = url.search;

    /**
     * Try to fetch from a backend with timeout
     */
    async function fetchWithTimeout(backendUrl, timeoutMs = TIMEOUT_MS) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const targetUrl = `${backendUrl}${path}${queryString}`;

        const response = await fetch(targetUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }

    /**
     * Check if backend is healthy
     */
    async function checkHealth(backendUrl) {
      try {
        const response = await fetchWithTimeout(`${backendUrl}${HEALTH_CHECK_PATH}`, 3000);
        return response.ok;
      } catch {
        return false;
      }
    }

    try {
      // Try primary backend (Railway)
      try {
        const primaryResponse = await fetchWithTimeout(PRIMARY_BACKEND);

        // If successful, return response with CORS headers
        const responseHeaders = new Headers(primaryResponse.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          responseHeaders.set(key, value);
        });
        responseHeaders.set('X-Backend-Source', 'Railway-Primary');

        return new Response(primaryResponse.body, {
          status: primaryResponse.status,
          statusText: primaryResponse.statusText,
          headers: responseHeaders,
        });
      } catch (primaryError) {
        console.error('Primary backend (Railway) failed:', primaryError.message);

        // Try backup backend if configured
        if (BACKUP_BACKEND) {
          console.log('Attempting failover to backup backend...');

          try {
            const backupResponse = await fetchWithTimeout(BACKUP_BACKEND);

            const responseHeaders = new Headers(backupResponse.headers);
            Object.entries(corsHeaders).forEach(([key, value]) => {
              responseHeaders.set(key, value);
            });
            responseHeaders.set('X-Backend-Source', 'Backup-Failover');
            responseHeaders.set('X-Failover-Reason', 'Primary backend unavailable');

            return new Response(backupResponse.body, {
              status: backupResponse.status,
              statusText: backupResponse.statusText,
              headers: responseHeaders,
            });
          } catch (backupError) {
            console.error('Backup backend also failed:', backupError.message);
          }
        }

        // Both backends failed or no backup configured
        return new Response(
          JSON.stringify({
            error: 'Backend services unavailable',
            message: 'All backend services are currently unavailable. Please try again later.',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 503,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'X-Backend-Source': 'Error-Response',
            },
          }
        );
      }
    } catch (error) {
      // Unexpected error
      return new Response(
        JSON.stringify({
          error: 'Gateway error',
          message: 'An unexpected error occurred in the API gateway',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};
