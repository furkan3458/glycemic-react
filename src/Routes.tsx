import { RouteObject, useRoutes } from 'react-router-dom';

import Home from './pages/Home';
import List from './pages/List';
import Error from './pages/Error';
import Food from './pages/Food';
import Category from './pages/Category';
import MyIndexes from './pages/MyIndexes';
import Activation from './pages/Activation';
import ResetPassword from './pages/ResetPassword';

interface RouteProps {
    auth: "guest" | "user" | string;
}

const Routes = (props: RouteProps) => {

    const guestRoutes: RouteObject[] = [
        { path: "/reset",element: <ResetPassword /> },
    ];

    const userRoutes: RouteObject[] = [
        { path: "/my-indexes",element: <MyIndexes /> },
    ];

    const defaultRoutes: RouteObject[] = props.auth === "guest" ? guestRoutes : userRoutes;

    defaultRoutes.push(
        { path: "/",element: <Home /> },
        { path: "/activation", element: <Activation />},
        { path: "/food/detail", element:<Food/>},
        { path: "/category/:name", element:<Category/>},
        { path: "/list", element:<List/>},
        { path: "*", element: <Error /> },
    );
    const routes = useRoutes(defaultRoutes);
    return (
        <>{routes}</>
    );
}

export default Routes;