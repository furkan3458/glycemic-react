
interface Nutritional{
    id:number;
    name:string;
    unit:string;
    createdDate?:   number;
    modifiedDate?:  number;
    createdBy?:     string;
    modifiedBy?:    string;
}

export interface ResultNutritional{
    id:string;
    nutritional:Nutritional;
    rate:number;
    unit:string;
    percent:number;
}