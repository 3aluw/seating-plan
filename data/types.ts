export interface IStudent {
    id?: number,
    name: string,
    fieldOne?: number | undefined
}
export type  seatType = "pairs" | "rows"
export interface IPlan {
    planName: string,
    description: string,
    seatType: seatType,
    numberOfRows:number,
    criteriaOneTitle: string,
    tableData: IStudent[],
    planScheme: IStudent[][]
}