interface KeyValue { [key: string]: any | string }
interface Column {
    name: string
}
interface Tables {
    metaData: Column[]
    rows: any[][]
}