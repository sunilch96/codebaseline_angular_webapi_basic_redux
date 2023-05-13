export interface PostModel{
    id?:number;
    title:string;
    description:string;
}

export interface PostEntitiesModel{
    id: number;
    entities:PostModel[]
}