import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import { StateType } from '../states/reducers';

import { setSearchResulted,setSearchClear,setSearchDB } from '../states/actions/searchActions';
import { getCategoryByUrl } from '../states/actions/categoryActions';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import FoodListComponent from '../components/FoodListComponent';
import PaginationComponent from '../components/PaginationComponent';

import States from '../utils/states';
import isEmpty from '../utils/isEmpty';

interface CategoryProps {
  getCategoryByUrl?: Function;
  setSearchResulted?: Function;
  setSearchClear?: Function;
  setSearchDB?: Function;
}

const Category = ({ ...props }: CategoryProps) => {

  const [pageState, setPageState] = useState<States>(States.INIT);

  const { name } = useParams();

  const food = useSelector((state: StateType) => state.food);
  const list = useSelector((state: StateType) => state.list);
  const category = useSelector((state: StateType) => state.category);

  useEffect(() => {
    fetchCategoryAndFoods();
  }, []);

  useEffect(() => {
    setPageState(States.INIT);
    props.setSearchResulted!(false);
    props.setSearchClear!();
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
    props.setSearchDB!('guest');
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
            <FoodListComponent header={category.single.name} foods={category.single.foods} category={[category.single]} specialCategory />
            <Grid>
              <Grid.Row only='computer'>
                <Grid.Column textAlign='center'>
                  <PaginationComponent only="computer" totalPages={category.pages.totalPage} siblingRange={2} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row only='tablet mobile'>
                <Grid.Column textAlign='center'>
                  <PaginationComponent only="mobile" totalPages={category.pages.totalPage} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </>
      }
      {
        (pageState === States.FINISH && isEmpty(category.single)) &&
        <Container style={{ paddingTop: 10, paddingBottom: 50 }}>
          <Segment placeholder>
            <Header as='h2' textAlign='center' icon>
              <Icon name='search' />
              Kategori bulunamadı.
            </Header>
            <Segment.Inline>
              <Link to="/">Ana sayfa'</Link>ya dönün ve aramaya başlayın.
            </Segment.Inline>
          </Segment>
        </Container>
      }
      <FooterComponent />
    </>
  );
}
const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = { getCategoryByUrl, setSearchResulted,setSearchClear,setSearchDB }

export default connect(mapStateToProps, mapDispatchToProps)(Category);