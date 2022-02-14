import {ResultCategory} from './ICategory';
import {ResultNutritional} from './INutritional';

export interface IFoods {
    status:  boolean;
    message: string;
    result?:  ResultFoods[];
    total:   number;
    totalPage: number;
    page: number;
}

export interface ResultFoods {
    id:            number;
    name:          string;
    glycemicIndex: number;
    image:         string;
    source:        string;
    url:           string;
    enabled:       boolean;
    category?:      ResultCategory;
    foodNutritional?: ResultNutritional[];
    createdDate:   number;
    modifiedDate:  number;
    createdBy:     string;
    modifiedBy:    string;
    foodStatus:     string;
}
