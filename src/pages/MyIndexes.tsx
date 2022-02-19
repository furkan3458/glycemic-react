import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import { StateType } from '../states/reducers';

import { setSearchResulted, setSearchClear, setSearchDB } from '../states/actions/searchActions';
import { getUserFoodList } from '../states/actions/foodActions';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import FoodListComponent from '../components/FoodListComponent';
import PaginationComponent from '../components/PaginationComponent';

import States from '../utils/states';
import isEmpty from '../utils/isEmpty';

interface MyIndexesProps {
  getUserFoodList?: Function;
  setSearchResulted?: Function;
  setSearchClear?: Function;
  setSearchDB?: Function;
}

const MyIndexes = ({ ...props }: MyIndexesProps) => {
  const [pageState, setPageState] = useState<States>(States.INIT);

  const food = useSelector((state: StateType) => state.food);
  const category = useSelector((state: StateType) => state.category);

  const { name } = useParams();

  useEffect(() => {
    fetchUserFoods();
  }, []);

  useEffect(() => {
    setPageState(States.INIT);
    props.setSearchResulted!(false);
    props.setSearchClear!();
    fetchUserFoods();
  }, [name]);

  useEffect(() => {
    if (food.isLoading && pageState === States.INIT) {
      setPageState(States.PENDING);
    } else if (!food.isLoading && pageState === States.PENDING) {
      setPageState(States.FINISH);
    }
  }, [food.isLoading]);

  const fetchUserFoods = () => {
    props.setSearchDB!('user');
    props.getUserFoodList!();
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Glycemic Indexer - Eklediklerim
        </title>
      </Helmet>
      <NavbarComponent />
      {
        (pageState === States.PENDING || pageState === States.INIT) &&
        <SpinnerComponent />
      }
      {
        (pageState === States.FINISH && !isEmpty(food.foods)) &&
        <>
          <Container fluid>
            <BreadcrumbComponent size={"large"}
              links={[
                { name: 'Ana Sayfa', url: "/", active: false },
                { name: 'Eklediklerim', url: "", active: true }
              ]
              }
            />
          </Container>
          <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
            <FoodListComponent header={'Eklediklerim'} foods={food.foods} category={category.categories} isUserIndexes={true}/>
            <Grid>
              <Grid.Row only='computer'>
                <Grid.Column textAlign='center'>
                  <PaginationComponent only="computer" totalPages={food.pages.totalPage} siblingRange={2} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row only='tablet mobile'>
                <Grid.Column textAlign='center'>
                  <PaginationComponent only="mobile" totalPages={food.pages.totalPage} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </>
      }
      {
        (pageState === States.FINISH && isEmpty(food.foods)) &&
        <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
          <Segment placeholder>
            <Header as='h2' textAlign='center' icon>
              <Icon name='search' />
              Kategori bulunamadı.
            </Header>
            <Segment.Inline>
              <Link to="/insert">Ürün ekle'</Link>sayfasına gidin ve ürün eklemeye başlayın.
            </Segment.Inline>
          </Segment>
        </Container>
      }
      <FooterComponent />
    </>
  )
}
const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = { getUserFoodList, setSearchResulted,setSearchClear,setSearchDB }

export default connect(mapStateToProps, mapDispatchToProps)(MyIndexes);