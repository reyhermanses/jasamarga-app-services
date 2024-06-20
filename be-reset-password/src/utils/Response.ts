interface ApiResponse {
  status: boolean;
  code: number;
  data: any;
}

export function buildApiResponse(
  status: boolean,
  code: number,
  data: any
): ApiResponse {
  return { status, code, data };
}

export function buildApiPagination(
  status: boolean,
  code: number,
  data: any
): ApiResponse {
  return { status, code, ...data };
}
