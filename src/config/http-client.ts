export class HttpClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async get<T>(
    _path: string,
    options: { params: Record<string, string> },
  ): Promise<{ data: T }> {
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams(options.params).toString();
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = (await response.json()) as T;
    return { data };
  }
}
