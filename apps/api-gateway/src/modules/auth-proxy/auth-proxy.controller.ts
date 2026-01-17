import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Public } from '@dpi/common';

/**
 * Auth Proxy Controller
 * Forwards all /api/auth/* requests to the Auth Service.
 *
 * This is a dedicated proxy for authentication endpoints because:
 * 1. Auth endpoints don't require prior authentication
 * 2. Auth service URL is configured directly (not from Service Registry)
 * 3. Simpler routing without service discovery overhead
 */
@Controller('auth')
export class AuthProxyController {
  private readonly logger = new Logger(AuthProxyController.name);
  private readonly authServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
  }

  /**
   * Handle all /api/auth/* requests
   * Public endpoint - authentication not required
   */
  @Public()
  @All('*')
  async proxyAuthRequest(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || '';

    // Extract path after /api/auth
    const path = req.params[0] || '';
    const targetUrl = this.buildTargetUrl(path, req.query);

    this.logger.debug(
      `[${correlationId}] Auth proxy: ${req.method} /auth/${path} -> ${targetUrl}`,
    );

    const headers = this.buildHeaders(req, correlationId);

    const config: AxiosRequestConfig = {
      method: req.method.toLowerCase() as any,
      url: targetUrl,
      headers,
      data: req.body,
      timeout: 30000,
      validateStatus: () => true,
      responseType: 'arraybuffer',
    };

    try {
      const startTime = Date.now();
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request(config),
      );
      const duration = Date.now() - startTime;

      this.logger.debug(
        `[${correlationId}] Auth response: ${response.status} (${duration}ms)`,
      );

      // Forward response headers
      this.forwardResponseHeaders(response, res);

      // Send response
      res.status(response.status).send(response.data);
    } catch (error: any) {
      this.logger.error(
        `[${correlationId}] Auth proxy error: ${error.message}`,
        error.stack,
      );

      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({
          statusCode: 503,
          message: 'Authentication service is unavailable',
          error: 'Service Unavailable',
        });
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        res.status(504).json({
          statusCode: 504,
          message: 'Authentication service request timed out',
          error: 'Gateway Timeout',
        });
      } else {
        res.status(502).json({
          statusCode: 502,
          message: 'Error forwarding request to authentication service',
          error: 'Bad Gateway',
        });
      }
    }
  }

  private buildTargetUrl(path: string, query: Request['query']): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${this.authServiceUrl}/api/auth${cleanPath}`;

    const queryString = Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join('&');

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  private buildHeaders(
    req: Request,
    correlationId: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'x-correlation-id': correlationId,
      'x-forwarded-for':
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '',
      'x-forwarded-host': req.headers.host || '',
      'x-forwarded-proto': req.protocol,
    };

    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'] as string;
    }

    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'] as string;
    }

    if (req.headers['accept']) {
      headers['accept'] = req.headers['accept'] as string;
    }

    // Forward cookies for OAuth flows
    if (req.headers['cookie']) {
      headers['cookie'] = req.headers['cookie'] as string;
    }

    return headers;
  }

  private forwardResponseHeaders(response: AxiosResponse, res: Response): void {
    const headersToForward = [
      'content-type',
      'cache-control',
      'set-cookie',
      'location', // Important for OAuth redirects
    ];

    for (const header of headersToForward) {
      if (response.headers[header]) {
        res.setHeader(header, response.headers[header]);
      }
    }
  }
}
