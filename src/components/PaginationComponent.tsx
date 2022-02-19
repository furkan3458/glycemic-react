import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Pagination, PaginationProps } from 'semantic-ui-react';

import { startSearch, startUserSearch, setSearchTotal, setSearchPage } from '../states/actions/searchActions';

import { StateType } from '../states/reducers';

interface PaginationComponentProps {
  only?: 'mobile' | 'computer' | 'tablet mobile' | 'tablet';
  totalPages: number;
  siblingRange?: number;
  startSearch?: Function;
  setSearchTotal?: Function;
  setSearchPage?: Function;
  startUserSearch?:Function;
}

const PaginationComponent = ({ ...props }: PaginationComponentProps) => {

  const [totalPages, setTotalPages] = useState(props.totalPages);
  const [activePage, setActivePage] = useState(1);

  const search = useSelector((state: StateType) => state.search);

  useEffect(() => {
    if (search.isResulted && search.info.page !== activePage) {
      setActivePage(search.info.page);
    }

    if (search.isResulted && search.info.totalPage !== totalPages) {
      setTotalPages(search.info.totalPage);
    }
  }, [search.isResulted,search.info.page, search.info.totalPage]);

  const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    if (search.isLoading) {
      return;
    }
    const total: any = data.totalPages;
    const active: any = data.activePage;

    props.setSearchPage!(active);
    props.setSearchTotal!(total);
    search.searchDB === 'user' ? props.startUserSearch!(search.info) : props.startSearch!(search.info);
  }

  const MeasuredPagination = (): JSX.Element => {
    if (props.only) {
      if (props.only === 'computer' || props.only === 'tablet')
        return (<Pagination onPageChange={(event, data) => handlePaginationChange(event, data)} pointing secondary  activePage={activePage} siblingRange={props.siblingRange ? props.siblingRange : 0} totalPages={totalPages} />);
      else if (props.only === 'mobile' || props.only === "tablet mobile")
        return (<Pagination onPageChange={(event, data) => handlePaginationChange(event, data)} pointing secondary activePage={activePage} siblingRange={0} ellipsisItem={null} totalPages={totalPages} />);
    }
    return (<Pagination onPageChange={(event, data) => handlePaginationChange(event, data)} pointing secondary  activePage={activePage} totalPages={totalPages} />);
  }

  return (
    <MeasuredPagination />
  )
}
const mapStateToProps = () => ({});

const mapDispatchToProps = { startSearch, setSearchTotal, setSearchPage, startUserSearch };

export default connect(mapStateToProps, mapDispatchToProps)(PaginationComponent);