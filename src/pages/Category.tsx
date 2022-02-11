import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Grid} from 'semantic-ui-react';

import { StateType } from '../states/reducers';
import { DrawerFoods } from '../states/reducers/drawerReducer';

import { getCategoryByUrl } from '../states/actions/categoryActions';
import { setDrawerAdd, setDrawerUpdate } from '../states/actions/drawerActions';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import FoodListComponent from '../components/FoodListComponent';
import PaginationComponent from '../components/PaginationComponent';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

import States from '../utils/states';
import isEmpty from '../utils/isEmpty';

interface CategoryProps {
  getCategoryByUrl?: Function;
  setDrawerAdd?: Function,
  setDrawerUpdate?: Function
}

const Category = ({ ...props }: CategoryProps) => {

  const [pageState, setPageState] = useState<States>(States.INIT);

  const { name } = useParams();

  const food = useSelector((state: StateType) => state.food);
  const drawer = useSelector((state: StateType) => state.drawer);
  const category = useSelector((state: StateType) => state.category);

  useEffect(() => {
    fetchCategoryAndFoods();
  }, []);

  useEffect(() => {
    setPageState(States.INIT);
    fetchCategoryAndFoods();
  }, [name]);

  useEffect(() => {
    if (category.isLoading && pageState === States.INIT) {
      setPageState(States.PENDING);
    } else if (!category.isLoading && pageState === States.PENDING) {
      setPageState(States.FINISH);
    }
  }, [category.isLoading]);

  const fetchCategoryAndFoods = () => {
    props.getCategoryByUrl!(name);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {(pageState === States.FINISH && !isEmpty(category.single)) ? 'Glycemic Indexer - ' + category.single.name : 'Glycemic Indexer - Sayfa bulunamadı.'}
        </title>
      </Helmet>
      <NavbarComponent />
      {
        (pageState === States.PENDING || pageState === States.INIT) &&
        <SpinnerComponent />
      }
      {
        (pageState === States.FINISH && !isEmpty(category.single)) &&
        <>
          <Container fluid>
            <BreadcrumbComponent size={"large"}
              links={[
                { name: 'Ana Sayfa', url: "/", active: false },
                { name: category.single.name, url: "", active: true }
              ]
              }
            />
          </Container>
          <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
              <FoodListComponent header="Ürünler" foods={category.single.foods} category={[category.single]} specialCategory/>
              <Grid>
                <Grid.Row only='computer'>
                  <Grid.Column textAlign='center'>
                  <PaginationComponent only="computer" totalPages={category.pages.totalPage} siblingRange={2}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row only='tablet mobile'>
                  <Grid.Column textAlign='center'>
                  <PaginationComponent only="mobile" totalPages={category.pages.totalPage}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
          </Container>
        </>
      }
      {
        (pageState === States.FINISH && isEmpty(category.single)) && <div>Ürün bulunamadı.</div>
      }
      <FooterComponent />
    </>
  );
}
const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = { getCategoryByUrl, setDrawerAdd, setDrawerUpdate }

export default connect(mapStateToProps, mapDispatchToProps)(Category);