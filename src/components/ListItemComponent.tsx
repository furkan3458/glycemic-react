import { useContext } from 'react'
import { getCookieConsentValue } from 'react-cookie-consent';
import { connect, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Grid, Header, Divider, Button, Icon, Label, List } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';


import { ResultFoods } from '../models/IFoods';
import { ResultNutritional } from '../models/INutritional';

import { setListUpdate, setListRemove } from '../states/actions/listActions';

import { StateType } from '../states/reducers';
import { ListFoods } from '../states/reducers/listReducer';

import CldImageComponent from './CldImageComponent';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

interface ListItemComponentProps {
    detail: ResultFoods;
    amount: number;
    setListUpdate?: Function;
    setListRemove?: Function;
    onCallback?: Function;
}

const ListItemComponent = ({ ...props }: ListItemComponentProps) => {

    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 992px)' });

    const list = useSelector((state: StateType) => state.list);

    const toastContext = useContext<ToastContextProvider>(ToastContext);
    
    const GetCalcGlycemicIndex = (): JSX.Element => {

        const calcGlycemic = props.detail.glycemicIndex * props.amount;

        return (
            <List.Item>
                <Label>
                    Glisemik
                    <Label.Detail>{calcGlycemic}</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetCalcInsulinIndex = (): JSX.Element => {
        const calcInsulin = props.detail.insulin * props.amount;
        return (
            <List.Item>
                <Label color='blue'>
                    Insülin
                    <Label.Detail>{calcInsulin}</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetCalcCalori = (): JSX.Element => {
        const calcCalori = props.detail.calori * props.amount;
        return (
            <List.Item>
                <Label color='brown'>
                    Kalori
                    <Label.Detail>{calcCalori}kcal</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetCalcCarbs = (): JSX.Element => {
        const calcCarbs = props.detail.carbs * props.amount;
        return (
            <List.Item>
                <Label color='green'>
                    Karbonhidrat
                    <Label.Detail>{calcCarbs.toFixed(2)}gram</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetCalcServing = (): JSX.Element => {
        const calcServing = props.detail.serving * props.amount;
        return (
            <List.Item>
                <Label color='olive'>
                    Porsiyon
                    <Label.Detail>{calcServing.toFixed(2)}gram</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetCalcAcidity = (): JSX.Element => {
        const calcAcidity = props.detail.acidity;
        return (
            <List.Item>
                <Label color='orange'>
                    Asitdiklik
                    <Label.Detail>{calcAcidity.toFixed(2)}</Label.Detail>
                </Label>
            </List.Item>
        );
    }

    const GetNutritionals = (): JSX.Element => {
        const colors: SemanticCOLORS[] = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black']

        return (
            <>
                {
                    props.detail.foodNutritional!.map((item: ResultNutritional, index: number) => (
                        <List.Item key={index}>
                            <Label color={colors[index % colors.length]}>
                                {item.nutritional.name}
                                <Label.Detail>{getCalcNutritional(item.rate)+""+item.nutritional.unit}</Label.Detail>
                            </Label>
                        </List.Item>
                    ))
                }
            </>
        );
    }

    const getCalcNutritional = (rate: number): number => {
        return props.amount * rate;
    }

    const onClickDecrease = () => {
        if (list.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        else if (props.amount === 1) {
            toastContext.toastError("Miktar sıfır veya daha altı olamaz.");
            return;
        }
        else if (!getCookieConsentValue(process.env.REACT_APP_COOKIE_NAME)) {
            toastContext.toastError("Bu işlemi gerçekleştirebilmek için lütfen çerezleri kabul ediniz.");
            return;
        }

        updateListFood(false);
    }

    const onClickIncrease = () => {
        if (list.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        else if (!getCookieConsentValue(process.env.REACT_APP_COOKIE_NAME)) {
            toastContext.toastError("Bu işlemi gerçekleştirebilmek için lütfen çerezleri kabul ediniz.");
            return;
        }

        updateListFood(true);
    }

    const onClickRemove = () => {
        const temp: ListFoods[] = list.foods;
        const index = temp.findIndex(item => { return item.detail.id === props.detail.id });

        const item: ListFoods = Object.assign({}, temp[index]);
        props.setListRemove!(item, index);
        props.onCallback!(0,0);
        
    }

    const updateListFood = (state:boolean) => {
        const temp: ListFoods[] = list.foods;
        const index = temp.findIndex(item => { return item.detail.id === props.detail.id });

        const item: ListFoods = Object.assign({}, temp[index]);
        item.amount += state ? 1 : -1;
        props.setListUpdate!(item, index);
        props.onCallback!(item.amount,item.detail.id);
    }

    return (
        <>
        <Grid>
            <Grid.Row>
                <Grid.Column width={16}><Header as={isMobileOrTablet ? "h3" : "h2"} textAlign='center'>{props.detail.name}</Header></Grid.Column>
            </Grid.Row>
            <Divider></Divider>
            <Grid.Row style={{ flexWrap: 'wrap' }}>
                <Grid.Column computer={4} mobile={6} tablet={3} textAlign="center">
                    <CldImageComponent width={128} height={128} src={props.detail.image} wrapped={true} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button.Group size={isMobileOrTablet ? 'mini' : 'medium'}>
                            <Button icon="minus" onClick={() => onClickDecrease()}></Button>
                            <Button.Or text={props.amount}></Button.Or>
                            <Button icon="plus" onClick={() => onClickIncrease()}></Button>
                            <Button icon="trash" onClick={() => onClickRemove()}></Button>
                        </Button.Group>
                    </div>
                </Grid.Column>
                <Grid.Column computer={6} mobile={10}>
                    <Header as="h4" dividing>
                        <Icon name='trophy' size='tiny' />
                        <Header.Content>Özellikleri</Header.Content>
                    </Header>
                    <List animated verticalAlign='middle' horizontal>
                        <GetCalcGlycemicIndex />
                        <GetCalcInsulinIndex />
                        <GetCalcCalori />
                        <GetCalcCarbs />
                        <GetCalcServing />
                        <GetCalcAcidity />
                    </List>
                </Grid.Column>
                <Grid.Column computer={6} mobile={16}>
                    <Header as="h4" textAlign='right' dividing>
                        <Icon name='info' size='tiny' />
                        <Header.Content>Besin değerleri</Header.Content>
                    </Header>
                    <List animated verticalAlign='middle' horizontal>
                        <GetNutritionals />
                    </List>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Divider></Divider>
        </>
    )
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { setListUpdate,setListRemove };

export default connect(mapStateToProps, mapDispatchToProps)(ListItemComponent);