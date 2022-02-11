import { RouteObject, useRoutes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Error from './pages/Error';
import Food from './pages/Food';
import Category from './pages/Category';

interface RouteProps {
    auth: "guest" | "user" | string;
}

const Routes = (props: RouteProps) => {

    const guestRoutes: RouteObject[] = [
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/signup",
            element: <Signup />
        }
    ];

    const userRoutes: RouteObject[] = [
    ];

    const defaultRoutes: RouteObject[] = props.auth === "guest" ? guestRoutes : userRoutes;

    defaultRoutes.push(
        { path: "/",element: <Home /> },
        { path: "*", element: <Error /> },
        { path: "/food/detail", element:<Food/>},
        { path: "/category/:name", element:<Category/>},
    );
    const routes = useRoutes(defaultRoutes);
    return (
        <>{routes}</>
    );
}

export default Routes;