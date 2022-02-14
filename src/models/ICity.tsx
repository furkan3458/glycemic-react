export interface ICity{
    status:boolean;
    error:number;
    message:string;
    result:ResultCity[];
}

export interface ResultCity{
    id:number;
    name:string;
    value:string;
}