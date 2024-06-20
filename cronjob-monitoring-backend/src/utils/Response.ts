interface ApiResponse {
  status: string;
  code: number;
  data: any;
}

export function createApiResponse(status: string, code: number, data: any): ApiResponse {
  return { status, code, data };
}