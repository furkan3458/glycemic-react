import { useState, useEffect, useContext } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Icon, Button, Label } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { getCookieConsentValue } from "react-cookie-consent";

import { setListAdd, setListUpdate } from '../states/actions/listActions';

import { ListFoods } from '../states/reducers/listReducer';
import { StateType } from '../states/reducers';

import { ResultFoods } from '../models/IFoods';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

import CldImageComponent from './CldImageComponent';

interface FoodListCellProps {
    detail: ResultFoods,
    isUserIndexes: boolean,
    setListAdd?: Function,
    setListUpdate?: Function
}

const FoodListCellComponent = ({ ...props }: FoodListCellProps) => {

    const [isInsertClick, setIsInsertClick] = useState(false);
    const [addCount, setAddCount] = useState(0);

    const food = useSelector((state: StateType) => state.food);
    const list = useSelector((state: StateType) => state.list);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!list.isLoading && isInsertClick) {
            checkFoodAdd();
            setIsInsertClick(false);
            saveListToLocal();
        }
    }, [list.isLoading]);

    const glycemicRiskColor = (): SemanticCOLORS => {
        const index = props.detail.glycemicIndex!;
        const color = (index > 80) ? 'red' : (index > 55 && index <= 80) ? 'orange' : 'green';

        return color;
    }

    const checkFoodAdd = () => {
        const temp: ListFoods[] = list.foods;
        const index = temp.findIndex(value => { return value.detail.id === props.detail.id });

        if (index !== -1 && addCount === temp[index].amount && temp[index].amount === 1)
            toastContext.toastSuccess!("Besin listenize eklendi.");
        else if (index !== -1 && addCount === temp[index].amount)
            toastContext.toastSuccess!("Listenizdeki besin g??ncellendi.");
        else
            toastContext.toastError!("Besin listenize eklenemedi.");
    }

    const handleClickInsert = () => {

        if (list.isLoading) {
            toastContext.toastInfo("L??tfen bekleyiniz...");
            return;
        }
        else if (!getCookieConsentValue(process.env.REACT_APP_COOKIE_NAME)) {
            toastContext.toastError("Bu i??lemi ger??ekle??tirebilmek i??in l??tfen ??erezleri kabul ediniz.");
            return;
        }
        const temp: ListFoods[] = list.foods;
        const index = temp.findIndex(item => { return item.detail.id === props.detail.id });

        if (index === -1) {
            const item: ListFoods = {
                amount: 1,
                detail: props.detail
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

    const handleClickDetail = () => {
        let url = "/food/detail?name=" + props.detail.url;
        url += props.isUserIndexes ? '&status=all' : '';
        navigate(url);
    }

    const saveListToLocal = () => {
        localStorage.setItem("list", JSON.stringify(list.foods));
        localStorage.setItem("list-count", JSON.stringify(list.foodCount));
    }

    const RibonFoodStatus = (): JSX.Element => {
        const color:SemanticCOLORS = props.detail.foodStatus === 'WAITING' ? 'yellow' : (props.detail.foodStatus === 'ACCEPT') ? 'green' : 'red';
        const text:string = props.detail.foodStatus === 'WAITING' ? 'Bekliyor' : (props.detail.foodStatus === 'ACCEPT') ? 'Kabul' : 'Ret';
        return (
            <>
                <Label as='span' color={color} ribbon style={{ top: -10 }}>
                    {text}
                </Label>
            </>
        );
    }

    return (
        <Card fluid color={glycemicRiskColor()} style={{ width: 250 + "px" }}>

            <CldImageComponent width={250} height={250} src={props.detail.image!} wrapped={true} />
            <Card.Content>
                {props.isUserIndexes && <RibonFoodStatus />}
                <Card.Header>{props.detail.name}</Card.Header>
                <Card.Meta>{new Date(props.detail.createdDate).toLocaleDateString()}</Card.Meta>
                <Card.Description>Glisemik Oran??:
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

const mapDispatchToProps = { setListAdd, setListUpdate };

export default connect(mapStateToProps, mapDispatchToProps)(FoodListCellComponent);
