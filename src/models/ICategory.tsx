import { ResultFoods } from "./IFoods";

export interface ICategory {
    status:  boolean;
    message: string;
    result:  ResultCategory[];
    total: number;
    totalPage:number;
    page:number;
}

export interface ResultCategory {
    createdDate:   number;
    modifiedDate:  number;
    createdBy:     string;
    modifiedBy:    string;
    id:            number;
    name:          string;
    url:           string;
    foods?:         ResultFoods;
}
