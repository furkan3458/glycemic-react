import React, { useState, useEffect, useContext } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Image, Icon, Reveal, Button, Label } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

import { setDrawerAdd, setDrawerUpdate } from '../states/actions/drawerActions';

import { DrawerFoods } from '../states/reducers/drawerReducer';
import { StateType } from '../states/reducers';

import { ResultFoods } from '../models/IFoods';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

import CldImageComponent from './CldImageComponent';

interface FoodListCellProps {
    detail:ResultFoods,
    setDrawerAdd?: Function,
    setDrawerUpdate?: Function
}

const FoodListCellComponent = ({ ...props }: FoodListCellProps) => {

    const [isInsertClick, setIsInsertClick] = useState(false);
    const [addCount, setAddCount] = useState(0);

    const food = useSelector((state: StateType) => state.food);
    const drawer = useSelector((state: StateType) => state.drawer);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!drawer.isLoading && isInsertClick) {
            checkFoodAdd();
            setIsInsertClick(false);
            saveDrawerToLocal();
        }
    }, [drawer.isLoading]);

    const glycemicRiskColor = (): SemanticCOLORS => {
        const index = props.detail.glycemicIndex!;
        const color = (index > 80) ? 'red' : (index > 55 && index <= 80) ? 'orange' : 'green';

        return color;
    }

    const checkFoodAdd = () => {
        const temp:DrawerFoods[] = drawer.foods;

        const index = temp.findIndex(value => { return value.detail.id === props.detail.id });

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
        const index = temp.findIndex(item => { return item.detail.id === props.detail.id });

        if (index === -1) {
            const item: DrawerFoods = {
                amount: 1,
                detail: props.detail
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

    const handleClickDetail = () => {
        const url = "/food/detail?name=" + props.detail.url;
        navigate(url);
    }

    const saveDrawerToLocal = () => {
        localStorage.setItem("drawer",JSON.stringify(drawer.foods));
        localStorage.setItem("drawer-count",JSON.stringify(drawer.foodCount));
    }

    return (
        <Card fluid color={glycemicRiskColor()} style={{ width: 250 + "px" }}>
            <CldImageComponent width={250} height={250} src={props.detail.image!} wrapped={true} />
            <Card.Content>
                <Card.Header>{props.detail.name}</Card.Header>
                <Card.Meta>{new Date(props.detail.createdDate).toLocaleDateString()}</Card.Meta>
                <Card.Description>Glisemik Oranı:
                    <Label circular color={glycemicRiskColor()}>
                        {props.detail.glycemicIndex}
                    </Label>
                </Card.Description>
                <Card.Description><p>
                    <Icon name='user' />
                    {props.detail.createdBy}
                </p></Card.Description>
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <div className='ui two buttons'>
                    <Button animated='fade' color='green' onClick={() => handleClickInsert()} loading={isInsertClick ? true : false}>
                        <Button.Content visible><Icon name="plus" /></Button.Content>
                        <Button.Content hidden>Ekle</Button.Content>
                    </Button>
                    <Button animated='fade' color='yellow' onClick={() => handleClickDetail()}>
                        <Button.Content visible><Icon name="info" /></Button.Content>
                        <Button.Content hidden>Detay</Button.Content>
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { setDrawerAdd, setDrawerUpdate };

export default connect(mapStateToProps, mapDispatchToProps)(FoodListCellComponent);
