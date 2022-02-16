import { RouteObject, useRoutes } from 'react-router-dom';

import Home from './pages/Home';
import List from './pages/List';
import Error from './pages/Error';
import Food from './pages/Food';
import Category from './pages/Category';
import MyIndexes from './pages/MyIndexes';

interface RouteProps {
    auth: "guest" | "user" | string;
}

const Routes = (props: RouteProps) => {

    const guestRoutes: RouteObject[] = [
    ];

    const userRoutes: RouteObject[] = [
        { path: "/my-indexes",element: <MyIndexes /> },
    ];

    const defaultRoutes: RouteObject[] = props.auth === "guest" ? guestRoutes : userRoutes;

    defaultRoutes.push(
        { path: "/",element: <Home /> },
        { path: "*", element: <Error /> },
        { path: "/food/detail", element:<Food/>},
        { path: "/category/:name", element:<Category/>},
        { path: "/list", element:<List/>},
    );
    const routes = useRoutes(defaultRoutes);
    return (
        <>{routes}</>
    );
}

export default Routes;