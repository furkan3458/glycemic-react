import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useMediaQuery } from 'react-responsive';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import States from '../utils/states';

import isEmpty from '../utils/isEmpty';

import FooterComponent from '../components/FooterComponent';
import NavbarComponent from '../components/NavbarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import ListItemComponent from '../components/ListItemComponent';

import { StateType } from '../states/reducers';

import { ListFoods } from '../states/reducers/listReducer';
import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';

const List = () => {
  const [pageState, setPageState] = useState<States>(States.INIT);
  const [updateClick, setUpdateClick] = useState(false);
  const [updatedId, setupdatedId] = useState(0);
  const [updatedCount, setupdatedCount] = useState(0);

  const toastContext = useContext<ToastContextProvider>(ToastContext);

  const list = useSelector((state: StateType) => state.list);

  const isMobileOrTablet = useMediaQuery({ query: '(max-width: 992px)' });

  useEffect(() => {
    if (list.isInitialize)
      setPageState(States.FINISH);
  }, [list.isInitialize]);

  useEffect(() => {
    if (!list.isLoading && updateClick) {
      checkFoodAdd();
      saveListToLocal();
      setUpdateClick(false);
    }

  }, [list.isLoading]);

  const saveListToLocal = () => {
    localStorage.setItem("list", JSON.stringify(list.foods));
    localStorage.setItem("list-count", JSON.stringify(list.foodCount));
  }

  const checkFoodAdd = () => {
    const temp: ListFoods[] = list.foods;
    const index = temp.findIndex(value => { return value.detail.id === updatedId });

    if (index === -1 && updatedId === 0 && updatedCount === 0)
      toastContext.toastSuccess!("Listenizdeki besin başarıyla kaldırıldı.");
    else if (index !== -1 && updatedCount === temp[index].amount)
      toastContext.toastSuccess!("Listenizdeki besin güncellendi.");
    else
      toastContext.toastError!("Besin listenize eklenemedi.");
  }

  const onClickListItemCallback = (amount: number, id: number) => {
    setUpdateClick(true);
    setupdatedCount(amount);
    setupdatedId(id);
  }

  const ListItems = (): JSX.Element => {
    return (
      list.foods.map((item: ListFoods, index: number) => (
        <ListItemComponent key={index} detail={item.detail} amount={item.amount} onCallback={onClickListItemCallback} />
      ))
    );
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Glycemic Indexer - Kütüphanem
        </title>
      </Helmet>
      <NavbarComponent />
      {
        (pageState === States.PENDING || pageState === States.INIT) &&
        <SpinnerComponent />
      }
      {
        (pageState === States.FINISH && !isEmpty(list.foods)) &&
        <>
          <Container fluid>
            <BreadcrumbComponent size={"large"}
              links={[
                { name: 'Ana Sayfa', url: "/", active: false },
                { name: 'Kütüphanem', url: "", active: true }
              ]
              }
            />
          </Container>
          <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
            <Segment>
              <Grid>
                <Grid.Row divided={!isMobileOrTablet}>
                  <Grid.Column computer={13} mobile={16} style={{ height: '50vh', overflow: 'auto' }}>
                    <ListItems />
                  </Grid.Column>
                  <Grid.Column computer={3} mobile={16}>
                    2
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Container>
        </>
      }
      {
        (pageState === States.FINISH && isEmpty(list.foods)) &&
        <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
          <BreadcrumbComponent size={"large"}
            links={[
              { name: 'Ana Sayfa', url: "/", active: false },
              { name: 'Kütüphanem', url: "", active: true }
            ]
            }
          />
          <Segment placeholder>
            <Header as='h2' textAlign='center' icon>
              <Icon name='search' />
              Listenizde ürün bulunamadı.
            </Header>
            <Segment.Inline>
              <Link to="/">Ana sayfa'</Link>ya dönün ve birkaç ürün ekleyin.
            </Segment.Inline>
          </Segment>
        </Container>
      }
      <FooterComponent />
    </>
  );
}

export default List