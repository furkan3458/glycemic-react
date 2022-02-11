import {ResultCategory} from './ICategory';

export interface IFoods {
    status?:  boolean;
    message?: string;
    result?:  ResultFoods[];
    total?:   number;
    totalPage?: number;
    page?: number;
}

export interface ResultFoods {
    createdDate?:   number;
    modifiedDate?:  number;
    createdBy?:     string;
    modifiedBy?:    string;
    gid?:           number;
    cid?:           number;
    name?:          string;
    glycemicindex?: number;
    image?:         string;
    source?:        string;
    url?:           string;
    enabled?:       boolean;
    category?:      ResultCategory;
}
