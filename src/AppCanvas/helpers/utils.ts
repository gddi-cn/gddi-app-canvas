import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { isLeft } from 'fp-ts/lib/Either'

export class ValidationError extends Error {
  constructor(errors: string[]) {
    const errorMessage = errors.join(',\n')
    super(errorMessage)
  }
}

export const getParsedData = <TData = any, O = TData, I = unknown>(
  rawData: I,
  codec: t.Type<TData, O, I>
): TData => {
  const result = codec.decode(rawData)
  if (isLeft(result)) {
    // Use a reporter to throw an error if validation fails
    throw new ValidationError(PathReporter.report(result))
  }

  // Get the validated value and use it in your application
  return result.right
}
