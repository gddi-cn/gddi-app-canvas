import { createContext } from 'react'

export type QueryModelContextType = {
  queryModelType: undefined | string
}

export const QueryModelContext = createContext<QueryModelContextType>({
  queryModelType: undefined
})
