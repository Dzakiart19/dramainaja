import { PlatformConfig } from '../types';

export abstract class BaseAPI {
  protected config: PlatformConfig;
  protected lastRequest = 0;
  protected readonly RATE_LIMIT_MS = 300;
  protected readonly TIMEOUT_MS = 5000;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  protected async request<T>(
    endpoint: string,
    params: Record<string, string | number> = {}
  ): Promise<T> {
    // Rate limiting
    const now = Date.now();
    if (now - this.lastRequest < this.RATE_LIMIT_MS) {
      await new Promise(r => setTimeout(r, this.RATE_LIMIT_MS - (now - this.lastRequest)));
    }
    this.lastRequest = now;

    const url = new URL(`${this.config.api.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    console.log(`🌐 [${this.config.name}] ${url.toString()}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') throw new Error('Request timeout');
      throw error;
    }
  }

  abstract getHome(page?: number, limit?: number): Promise<any>;
  abstract searchDrama(query: string, page?: number): Promise<any>;
  abstract getDramaDetail(id: string): Promise<any>;
}
