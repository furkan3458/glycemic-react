import React, { useState, useEffect, useContext } from 'react'
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Button, Container, Divider, Grid, Header, Icon, Label } from 'semantic-ui-react';

import { StateType } from '../states/reducers';
import { DrawerFoods } from '../states/reducers/drawerReducer';

import { getFood } from '../states/actions/foodActions';
import { setDrawerAdd, setDrawerUpdate } from '../states/actions/drawerActions';

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
    setDrawerAdd?: Function,
    setDrawerUpdate?: Function
}

const Food = (props: FoodProps) => {

    const [searchParams] = useSearchParams();

    const [pageState, setPageState] = useState<States>(States.INIT);
    const [isInsertClick, setIsInsertClick] = useState(false);
    const [addCount, setAddCount] = useState(0);
    const [foodObject, setfoodObject] = useState<ResultFoods>();

    const food = useSelector((state: StateType) => state.food);
    const drawer = useSelector((state: StateType) => state.drawer);

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
        if (!drawer.isLoading && isInsertClick) {
            checkFoodAdd();
            setIsInsertClick(false);
            saveDrawerToLocal();
        }
    }, [drawer.isLoading]);

    const handleFoodNameCategory = () => {
        props.getFood!(searchParams.get('name'));
    }

    const saveDrawerToLocal = () => {
        localStorage.setItem("drawer", JSON.stringify(drawer.foods));
        localStorage.setItem("drawer-count", JSON.stringify(drawer.foodCount));
    }

    const checkFoodAdd = () => {
        const temp: DrawerFoods[] = drawer.foods;

        const index = temp.findIndex(value => { return value.detail.id === foodObject!.id });

        if (index !== -1 && addCount === temp[index].amount && temp[index].amount === 1)
            toastContext.toastSuccess!("Besin çantanıza eklendi.");
        else if (index !== -1 && addCount === temp[index].amount)
            toastContext.toastSuccess!("Çantanızdaki besin güncellendi.");
        else
            toastContext.toastError!("Besin çantanıza eklenemedi.");
    }

    const handleClickInsert = () => {
        if (drawer.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        const temp: DrawerFoods[] = drawer.foods;
        const index = temp.findIndex(item => { return item.detail.id === foodObject!.id });

        if (index === -1) {
            const item: DrawerFoods = {
                amount: 1,
                detail: foodObject!
            }
            props.setDrawerAdd!(item);
            setAddCount(1);
        }
        else {
            const item: DrawerFoods = Object.assign({}, temp[index]);
            item.amount += 1;
            props.setDrawerUpdate!(item, index);
            setAddCount(item.amount);
        }

        setIsInsertClick(true);
    }

    const Rates = (): JSX.Element => {
        const glycemicStyle: CSS.Properties = {
            ['--p' as any]: foodObject?.glycemicIndex,
            ['--c' as any]: foodObject!.glycemicIndex > 55 ? (foodObject!.glycemicIndex > 71 ? 'red' : 'orange') : 'green',
        };

        return (
            <Grid>
                <Grid.Row centered>
                    <Grid.Column width={4} textAlign='center'>
                        <Header as="h3" textAlign='center'>Glisemik Indeksi</Header>
                        <div className="pie animate" style={glycemicStyle}> {foodObject!.glycemicIndex}%</div>
                    </Grid.Column>
                </Grid.Row>
                <Divider></Divider>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header as="h3" textAlign='center'>Besin Değerleri</Header>
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
                        <div style={{ display: "flex", flexWrap:"wrap"}}>
                            {
                                foodObject!.foodNutritional!.map((item, index) => {
                                    const style: CSS.Properties = {
                                        ['--p' as any]: item.rate,
                                        ['--c' as any]: item.rate > 55 ? (item.rate > 71 ? 'red' : 'orange') : 'green',
                                    };

                                    return (
                                        <div key={index} style={{margin:'0 10px', textAlign:"center"}}>
                                            <div className="pie animate" style={style}> {item.rate}%</div>
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
                                        <div>Glisemik indeksi:{food.foods[0].glycemicindex}</div>
                                        <div>Glisemik indeksi:{food.foods[0].glycemicindex}</div>
                                        <div>Glisemik indeksi:{food.foods[0].glycemicindex}</div>
                                        <div>Glisemik indeksi:{food.foods[0].glycemicindex}</div>
                                        <div>Glisemik indeksi:{food.foods[0].glycemicindex}</div>
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
                <div>Ürün bulunamadı.</div>
            }
            <FooterComponent />
        </>
    )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = { getFood, setDrawerAdd, setDrawerUpdate }

export default connect(mapStateToProps, mapDispatchToProps)(Food);