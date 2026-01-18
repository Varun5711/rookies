import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import { Public } from '@dpi/common';
import axios from 'axios';

/**
 * Registry Proxy Controller
 * Handles direct routing to service-registry for /api/registry/* endpoints
 *
 * Route Pattern: /api/registry/*
 * Example: GET /api/registry/services -> service-registry:3002/api/registry/services
 */
@Public()
@Controller('registry')
export class RegistryProxyController {
  private readonly logger = new Logger(RegistryProxyController.name);
  private readonly registryUrl =
    process.env.SERVICE_REGISTRY_URL || 'http://localhost:3002';

  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxyRegistryRequest(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || '';

    // Extract path after /api/registry
    const pathMatch = req.url.match(/^\/api\/registry\/(.+?)(?:\?|$)/);
    const registryPath = pathMatch ? pathMatch[1] : '';

    const targetUrl = `${this.registryUrl}/api/registry/${registryPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

    this.logger.log(
      `[${correlationId}] Proxying registry request: ${req.method} ${targetUrl}`,
    );

    try {
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          ...req.headers,
          host: new URL(this.registryUrl).host,
        },
        data: req.body,
        params: req.query,
        validateStatus: () => true, // Don't throw on any status
        timeout: 30000, // 30 second timeout to prevent hanging
      });

      // Forward response
      res.status(response.status);
      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });
      res.send(response.data);
    } catch (error) {
      this.logger.error(
        `[${correlationId}] Registry proxy error: ${error.message}`,
      );
      res.status(500).json({
        success: false,
        error: {
          code: 'PROXY_ERROR',
          message: 'Failed to reach service registry',
        },
      });
    }
  }
}
