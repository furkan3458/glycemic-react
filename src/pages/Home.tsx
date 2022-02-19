import { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { Helmet } from "react-helmet-async";
import { Container, Grid } from 'semantic-ui-react'

import { StateType } from '../states/reducers';
import { getFoodList } from '../states/actions/foodActions';
import { setSearchResulted,setSearchClear,setSearchDB } from '../states/actions/searchActions';

import NavbarComponent from '../components/NavbarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import FooterComponent from '../components/FooterComponent';
import FoodListComponent from '../components/FoodListComponent';
import PaginationComponent from '../components/PaginationComponent';

interface HomeProps {
  getFoodList: Function,
  setSearchResulted: Function,
  setSearchClear: Function,
  setSearchDB: Function,
}

const Home = ({ ...props }: HomeProps) => {

  const food = useSelector((state: StateType) => state.food);
  const category = useSelector((state: StateType) => state.category);

  useEffect(() => {
    props.getFoodList();
    props.setSearchResulted();
    props.setSearchClear();
    props.setSearchDB('guest');
  }, []);

  useEffect(() => {

  }, [food.isLoading]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Glycemic Indexer - Ana sayfa</title>
      </Helmet>
      <NavbarComponent />

      <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
        {
          (food.isLoading || category.isLoading) ?
            <SpinnerComponent /> :
            <>
              <FoodListComponent header="Ürünler" foods={food.foods} category={category.categories} />
              <Grid>
                <Grid.Row only='computer'>
                  <Grid.Column textAlign='center'>
                    <PaginationComponent only="computer" totalPages={food.pages.totalPage} siblingRange={2} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row only='mobile'>
                  <Grid.Column textAlign='center'>
                    <PaginationComponent only="mobile" totalPages={food.pages.totalPage} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
        }
      </Container>
      <FooterComponent />
    </>
  );
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { getFoodList,setSearchResulted, setSearchClear, setSearchDB };

export default connect(mapStateToProps, mapDispatchToProps)(Home);