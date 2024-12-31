// Error Sources Type: Defines the structure for individual error source details
export type TErrorSources = {
  path: string | number
  message: string
}[]

// Generic Error Response Type: Defines the structure for a full error response
export type TGenericErrorResponse = {
  statusCode: number
  message: string
  errorSources: TErrorSources
}
