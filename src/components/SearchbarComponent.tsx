import React, { useEffect, useState, useContext } from 'react'
import { connect, useSelector } from 'react-redux';
import { Input, Select } from 'semantic-ui-react';

import { StateType } from '../states/reducers';

import { startSearch,setSearchText,setSearchCategory,setSearchPage,startUserSearch } from '../states/actions/searchActions';

import { ResultCategory } from '../models/ICategory';


interface CategoryOptions {
    key: string,
    text: string,
    value: string,
}

interface SearchbarProps {
    category: ResultCategory[];
    specialCategory?: boolean;
    startSearch?:Function;
    startUserSearch?:Function;
    setSearchText?:Function;
    setSearchCategory?:Function;
    setSearchPage?:Function;
}

const SearchbarComponent = ({ ...props }: SearchbarProps) => {

    const [category, setCategoryOption] = useState("all");
    const [isInit, setIsInit] = useState(false);
    const [options, setOptions] = useState<CategoryOptions[]>([]);

    const search = useSelector((state: StateType) => state.search);

    useEffect(() => {
        initializeCategoryOptions();
    }, []);

    const initializeCategoryOptions = () => {
        let options: CategoryOptions[] = [];

        if (props.specialCategory) {
            options.push({ key: props.category[0].url!, text: props.category[0].name!, value: props.category[0].url! });
            setCategoryOption(props.category[0].url!);
            props.setSearchCategory!(props.category[0].url!);
        }
        else {
            options.push({ key: "all", text: "Tüm", value: "all" });

            props.category.map((item, index) => {
                options.push({ key: item.url!, text: item.name!, value: item.url! });
            });

            props.setSearchCategory!("all");
        }
        setOptions(options);
        setIsInit(true);
    }

    const handleCategoryChange = (e: any, select: any) => {
        setCategoryOption(select.value);
        props.setSearchCategory!(select.value);
        props.setSearchPage!(1);
        
        props.startSearch!(search.info);
    }

    const handleSearching = (text: string) => {
        props.setSearchText!(text);
        props.setSearchCategory!(category);
        props.setSearchPage!(1);

        setTimeout(() => { startSearchDeadline(text) }, 1 * 250);   
    }

    const startSearchDeadline = (value:string) =>{
        if (search.info.text === value) {
            search.searchDB === 'user' ? props.startUserSearch!(search.info) : props.startSearch!(search.info);
            
        }
    }

    return (
        isInit ?
            <Input fluid size='huge' placeholder='Ara...' action>
                <input onKeyUp={(e) => handleSearching(e.currentTarget.value)}/>
                <Select onChange={(e, x) => handleCategoryChange(e, x)} options={options} defaultValue={isInit ? options[0].value : ''}></Select>
            </Input> : <></>
    );
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { startSearch,startUserSearch,setSearchText,setSearchCategory,setSearchPage };

export default connect(mapStateToProps, mapDispatchToProps)(SearchbarComponent);