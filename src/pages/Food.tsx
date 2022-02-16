import React, { useState, useEffect, useContext } from 'react'
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Container, Divider, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { StateType } from '../states/reducers';
import { ListFoods } from '../states/reducers/listReducer';

import { getFood } from '../states/actions/foodActions';
import { setListAdd, setListUpdate } from '../states/actions/listActions';

import { ResultFoods } from '../models/IFoods';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import CldImageComponent from '../components/CldImageComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

import States from '../utils/states';

import * as CSS from 'csstype';

interface FoodProps {
    getFood?: Function;
    setListAdd?: Function,
    setListUpdate?: Function
}

const Food = (props: FoodProps) => {

    const [searchParams] = useSearchParams();

    const [pageState, setPageState] = useState<States>(States.INIT);
    const [isInsertClick, setIsInsertClick] = useState(false);
    const [addCount, setAddCount] = useState(0);
    const [foodObject, setfoodObject] = useState<ResultFoods>();

    const food = useSelector((state: StateType) => state.food);
    const list = useSelector((state: StateType) => state.list);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    useEffect(() => {
        handleFoodNameCategory();
    }, []);

    useEffect(() => {
        if (food.isLoading && pageState === States.INIT) {
            setPageState(States.PENDING);
        } else if (!food.isLoading && pageState === States.PENDING) {
            setPageState(States.FINISH);
            setfoodObject(food.foods[0]);
        }
    }, [food.isLoading]);

    useEffect(() => {
        if (!list.isLoading && isInsertClick) {
            checkFoodAdd();
            setIsInsertClick(false);
            saveListToLocal();
        }
    }, [list.isLoading]);

    const handleFoodNameCategory = () => {
        props.getFood!(searchParams.get('name'));
    }

    const saveListToLocal = () => {
        localStorage.setItem("list", JSON.stringify(list.foods));
        localStorage.setItem("list-count", JSON.stringify(list.foodCount));
    }

    const checkFoodAdd = () => {
        const temp: ListFoods[] = list.foods;

        const index = temp.findIndex(value => { return value.detail.id === foodObject!.id });

        if (index !== -1 && addCount === temp[index].amount && temp[index].amount === 1)
            toastContext.toastSuccess!("Besin listenize eklendi.");
        else if (index !== -1 && addCount === temp[index].amount)
            toastContext.toastSuccess!("Listenizdeki besin güncellendi.");
        else
            toastContext.toastError!("Besin listenize eklenemedi.");
    }

    const handleClickInsert = () => {
        if (list.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        const temp: ListFoods[] = list.foods;
        const index = temp.findIndex(item => { return item.detail.id === foodObject!.id });

        if (index === -1) {
            const item: ListFoods = {
                amount: 1,
                detail: foodObject!
            }
            props.setListAdd!(item);
            setAddCount(1);
        }
        else {
            const item: ListFoods = Object.assign({}, temp[index]);
            item.amount += 1;
            props.setListUpdate!(item, index);
            setAddCount(item.amount);
        }

        setIsInsertClick(true);
    }

    const Rates = (): JSX.Element => {
        return (
            <Grid>
                <Grid.Row centered>
                    <Grid.Column width={16} textAlign='left'>
                        <div>Glisemik indeksi:{food.foods[0].glycemicIndex}</div>
                        <div>İnsülin indeksi:{food.foods[0].insulin}</div>
                        <div>Karbonhidratlar:{food.foods[0].carbs}g</div>
                        <div>Kalori:{food.foods[0].calori}</div>
                        <div>Porsiyon:{food.foods[0].serving}kcal</div>
                        <div>Asiditlik:{food.foods[0].acidity}</div>
                    </Grid.Column>
                </Grid.Row>
                <Divider></Divider>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <div style={{ textAlign: 'center' }}>
                            <Header as="h2">
                                Besin Değerleri
                                <Header.Subheader>Önemli besin değerleri</Header.Subheader>
                            </Header>
                        </div>
                        <Nutritions />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    const Nutritions = (): JSX.Element => {
        return (
            <>
                {
                    foodObject!.foodNutritional!.length > 0 ?
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {
                                foodObject!.foodNutritional!.map((item, index) => {
                                    const style: CSS.Properties = {
                                        ['--p' as any]: item.percent,
                                        ['--c' as any]: item.percent < 69 ? (item.percent < 35 ? 'red' : 'orange') : 'green',
                                    };

                                    return (
                                        <div key={index} style={{ margin: '0 10px', textAlign: "center" }}>
                                            <div className="pie animate" style={style}> {item.percent}%</div>
                                            <Header as="h4">{item.nutritional.name}</Header>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        :
                        <Header as="h4" textAlign='center'>Veri bulunamadı...</Header>
                }
            </>
        )
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {(pageState === States.FINISH && foodObject) && 'Glycemic Indexer - ' + foodObject.name}
                </title>
            </Helmet>
            <NavbarComponent />
            {
                (pageState === States.PENDING || pageState === States.INIT) &&
                <SpinnerComponent />
            }
            {
                (pageState === States.FINISH && foodObject) &&
                <>
                    <Container fluid>
                        <BreadcrumbComponent size={"large"}
                            links={[
                                { name: 'Ana Sayfa', url: "/", active: false },
                                { name: foodObject.category!.name, url: "/category/" + foodObject.category!.url, active: false },
                                { name: foodObject.name, url: "", active: true }
                            ]
                            }
                        />
                    </Container>
                    <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
                        <Grid celled>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header as='h2' textAlign='center'>
                                        {foodObject.name}
                                    </Header>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={3} divided only='computer'>
                                <Grid.Column width={3} verticalAlign='middle'>
                                    <CldImageComponent width={300} height={300} src={foodObject.image} />
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Divider horizontal>
                                        <Header as='h4'>
                                            <Icon name='percent' />
                                            Oranlar
                                        </Header>
                                    </Divider>
                                    <Rates />
                                </Grid.Column>
                                <Grid.Column width={3} textAlign="center">
                                    <Button animated='fade' color='green' onClick={() => handleClickInsert()} loading={isInsertClick ? true : false}>
                                        <Button.Content visible><Icon name="plus" /></Button.Content>
                                        <Button.Content hidden>Ekle</Button.Content>
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row only='tablet mobile'>
                                <Grid.Column width={16}>
                                    <div style={{ textAlign: 'center' }}>
                                        <CldImageComponent width={300} height={300} src={foodObject.image} />
                                    </div>
                                    <div>
                                        <Button fluid animated='fade' color='green' onClick={() => handleClickInsert()} loading={isInsertClick ? true : false}>
                                            <Button.Content visible><Icon name="plus" /></Button.Content>
                                            <Button.Content hidden>Ekle</Button.Content>
                                        </Button>
                                    </div>
                                    <div>
                                        <Divider horizontal>
                                            <Header as='h4'>
                                                <Icon name='percent' />
                                                Oranlar
                                            </Header>
                                        </Divider>
                                    </div>
                                    <div>
                                        <div>Glisemik indeksi:{food.foods[0].glycemicIndex}</div>
                                        <div>İnsülin indeksi:{food.foods[0].insulin}</div>
                                        <div>Karbonhidratlar:{food.foods[0].carbs}g</div>
                                        <div>Kalori:{food.foods[0].calori}</div>
                                        <div>Porsiyon:{food.foods[0].serving}kcal</div>
                                        <div>Asiditlik:{food.foods[0].acidity}</div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Divider horizontal>
                                        <Header as='h4'>
                                            <Icon name='info' />
                                            Bilgiler
                                        </Header>
                                    </Divider>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </Container>
                </>

            }
            {
                (pageState === States.FINISH && !foodObject) &&
                <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
                    <Segment placeholder>
                        <Header as='h2' textAlign='center' icon>
                            <Icon name='search' />
                            Ürün bulunamadı.
                        </Header>
                        <Segment.Inline>
                            <Link to="/">Ana sayfa'</Link>ya dönün ve ordan aramaya başlayın.
                        </Segment.Inline>
                    </Segment>
                </Container>
            }
            <FooterComponent />
        </>
    )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = { getFood, setListAdd, setListUpdate }

export default connect(mapStateToProps, mapDispatchToProps)(Food);