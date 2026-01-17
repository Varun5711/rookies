import { Controller, All, Param, Req, Res, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Public } from '@dpi/common';

/**
 * Standard API Response Format
 */
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Standard Error Response Format
 */
interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}

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
  @All('*path')
  async proxyAuthRequest(
    @Param('path') path: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const correlationId = (req.headers['x-correlation-id'] as string) || '';

    // Use the path parameter from the route
    const targetUrl = this.buildTargetUrl(path || '', req.query);

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

      // Handle redirects (OAuth flows) - pass through as-is
      if (response.status >= 300 && response.status < 400) {
        res.status(response.status).send(response.data);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers['content-type'] || '';
      const isJson = contentType.includes('application/json');

      if (isJson) {
        // Parse JSON and wrap in standard format
        const jsonData = JSON.parse(response.data.toString());
        const wrappedResponse = this.wrapResponse(
          jsonData,
          response.status,
          correlationId,
        );
        res.status(response.status).json(wrappedResponse);
      } else {
        // Pass through non-JSON responses
        res.status(response.status).send(response.data);
      }
    } catch (error: any) {
      this.logger.error(
        `[${correlationId}] Auth proxy error: ${error.message}`,
        error.stack,
      );

      const timestamp = new Date().toISOString();

      if (error.code === 'ECONNREFUSED') {
        res.status(503).json(
          this.createErrorResponse(
            'SERVICE_UNAVAILABLE',
            'Authentication service is unavailable',
            correlationId,
            timestamp,
          ),
        );
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        res.status(504).json(
          this.createErrorResponse(
            'GATEWAY_TIMEOUT',
            'Authentication service request timed out',
            correlationId,
            timestamp,
          ),
        );
      } else {
        res.status(502).json(
          this.createErrorResponse(
            'BAD_GATEWAY',
            'Error forwarding request to authentication service',
            correlationId,
            timestamp,
          ),
        );
      }
    }
  }

  /**
   * Wrap response in standard format
   */
  private wrapResponse(
    data: any,
    status: number,
    correlationId: string,
  ): ApiResponse | ApiErrorResponse {
    const timestamp = new Date().toISOString();

    // Check if it's an error response (4xx or 5xx)
    if (status >= 400) {
      return this.createErrorResponse(
        data.error || this.getErrorCode(status),
        data.message || 'An error occurred',
        correlationId,
        timestamp,
        data.details || data.errors,
      );
    }

    // Success response
    return {
      success: true,
      data: data,
      meta: {
        timestamp,
        requestId: correlationId,
      },
    };
  }

  /**
   * Create standardized error response
   */
  private createErrorResponse(
    code: string,
    message: string,
    correlationId: string,
    timestamp: string,
    details?: any,
  ): ApiErrorResponse {
    return {
      success: false,
      data: null,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: {
        timestamp,
        requestId: correlationId,
      },
    };
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'ERROR';
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
