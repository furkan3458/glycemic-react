import React, { useState, useEffect } from 'react';
import { Container, Grid, Input, Card, Icon, Header, Dropdown, Button, Select, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { IFoods, ResultFoods } from '../models/IFoods';
import { ResultCategory } from '../models/ICategory';

import { StateType } from '../states/reducers';

import FoodListCellComponent from './FoodListCellComponent';
import SearchbarComponent from './SearchbarComponent';

interface FoodListProps {
    header: string,
    foods: ResultFoods[],
    category: ResultCategory[];
    specialCategory?: boolean;
    isUserIndexes?:boolean;
}

const FoodListComponent = ({ ...props }: FoodListProps) => {
    const [foods, setFoods] = useState<ResultFoods[]>(props.foods);

    const search = useSelector((state: StateType) => state.search);

    useEffect(() => {
        if (search.isResulted)
            setFoods(search.results);
    }, [search.isResulted])


    return (
        <Grid columns={16}>
            <Grid.Row textAlign='center'>
                <Grid.Column>
                    <Header size='huge'>{props.header}</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16} only="tablet computer">
                    <SearchbarComponent category={props.category} specialCategory={props.specialCategory} />
                </Grid.Column>
                <Grid.Column width={16} only="mobile">
                    <SearchbarComponent category={props.category} specialCategory={props.specialCategory} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Segment>
                    <Dimmer active={search.isLoading} inverted>
                        <Loader inverted size='huge'>Yükleniyor</Loader>
                    </Dimmer>
                    {foods.length ?
                        <Card.Group centered>
                            {foods.map((item, index) => <FoodListCellComponent key={index} detail={item} isUserIndexes={props.isUserIndexes!}/>)}
                        </Card.Group>
                        :
                        <Card.Group centered><Header as="h3" style={{padding:20}}>Ürün bulunamadı.</Header></Card.Group>
                    }
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default FoodListComponent;
