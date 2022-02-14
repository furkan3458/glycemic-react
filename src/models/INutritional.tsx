
interface Nutritional{
    id:number;
    name:string;
    createdDate?:   number;
    modifiedDate?:  number;
    createdBy?:     string;
    modifiedBy?:    string;
}

export interface ResultNutritional{
    id:string;
    nutritional:Nutritional;
    rate:number;

}