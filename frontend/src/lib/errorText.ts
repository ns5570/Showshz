export function errorText(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string; detail?: string } } }).response
    return response?.data?.message ?? response?.data?.detail ?? 'Something went wrong. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}
