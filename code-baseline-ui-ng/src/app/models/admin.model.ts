export interface AdminModel{
    id?:number;
    title:string;
    description:string;
}

export interface AdminEntitiesModel{
    id: number;
    entities:AdminModel[]
}