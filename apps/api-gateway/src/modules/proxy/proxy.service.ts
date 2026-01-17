import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceInfo } from './interfaces/service-info.interface';

/**
 * Proxy Service
 * Handles HTTP forwarding from API Gateway to target services.
 * Preserves headers, body, query params, and handles streaming responses.
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Forward request to target service
   */
  async forwardRequest(
    req: Request,
    res: Response,
    service: ServiceInfo,
    path: string,
    correlationId: string,
  ): Promise<void> {
    const targetUrl = this.buildTargetUrl(service.baseUrl, path, req.query);
    const method = req.method.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete';

    this.logger.debug(
      `Forwarding ${method.toUpperCase()} ${req.originalUrl} -> ${targetUrl}`,
    );

    const headers = this.buildForwardHeaders(req, correlationId);

    const config: AxiosRequestConfig = {
      method,
      url: targetUrl,
      headers,
      data: req.body,
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
      responseType: 'arraybuffer', // Handle binary data
    };

    try {
      const startTime = Date.now();
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request(config),
      );
      const duration = Date.now() - startTime;

      this.logger.debug(
        `Response from ${service.name}: ${response.status} (${duration}ms)`,
      );

      // Forward response headers
      this.forwardResponseHeaders(response, res);

      // Set status and send response
      res.status(response.status).send(response.data);
    } catch (error: any) {
      this.logger.error(
        `Proxy error for ${service.name}: ${error.message}`,
        error.stack,
      );

      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({
          statusCode: 503,
          message: `Service ${service.displayName} is unavailable`,
          error: 'Service Unavailable',
        });
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        res.status(504).json({
          statusCode: 504,
          message: `Request to ${service.displayName} timed out`,
          error: 'Gateway Timeout',
        });
      } else {
        res.status(502).json({
          statusCode: 502,
          message: `Error forwarding request to ${service.displayName}`,
          error: 'Bad Gateway',
        });
      }
    }
  }

  /**
   * Build target URL with path and query params
   */
  private buildTargetUrl(
    baseUrl: string,
    path: string,
    query: Request['query'],
  ): string {
    // Ensure baseUrl doesn't end with slash and path starts with slash
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    let url = `${cleanBaseUrl}${cleanPath}`;

    // Append query parameters
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

  /**
   * Build headers to forward to target service
   */
  private buildForwardHeaders(
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

    // Forward content-type
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'] as string;
    }

    // Forward authorization
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'] as string;
    }

    // Forward accept
    if (req.headers['accept']) {
      headers['accept'] = req.headers['accept'] as string;
    }

    // Forward user context if available (set by JWT validation)
    if ((req as any).user) {
      headers['x-user-context'] = JSON.stringify((req as any).user);
    }

    return headers;
  }

  /**
   * Forward response headers from target service
   */
  private forwardResponseHeaders(
    response: AxiosResponse,
    res: Response,
  ): void {
    const headersToForward = [
      'content-type',
      'cache-control',
      'etag',
      'last-modified',
      'content-disposition',
      'x-request-id',
    ];

    for (const header of headersToForward) {
      if (response.headers[header]) {
        res.setHeader(header, response.headers[header]);
      }
    }
  }
}
