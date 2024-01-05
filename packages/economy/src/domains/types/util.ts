export { Query, QueryOperationType, TableFromTypeBox }

type Query = (params: any) => string

type QueryOperationType = (tableFromTypeBox: TableFromTypeBox) => string

type TableFromTypeBox = any
