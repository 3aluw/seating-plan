export interface IStudent {
    id?: number,
    name: string,
    fieldOne?: number | undefined
}
export type  SeatType = "pairs" | "rows"
export type PlanScheme = IStudent[][]
export interface IPlan {
    planName: string,
    description: string,
    seatType: SeatType,
    numberOfRows:number,
    criteriaOneTitle: string | undefined,
    tableData: IStudent[],
    planScheme: PlanScheme
}