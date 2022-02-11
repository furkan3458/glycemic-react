import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

interface BreadcrumbProps {
    size: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';
    links: BreadcrumbLink[];
}

interface BreadcrumbLink {
    name: string;
    url: string;
    active: boolean;
}

const BreadcrumbComponent = ({ ...props }: BreadcrumbProps) => {

    return (
        <Breadcrumb size={props.size} style={{ padding: 10 }}>
            {
                props.links.map((item, index, array) => (
                    <span key={"breadcrumb_"+index}>
                        <Breadcrumb.Section  active={item.active}>
                            {(index+1) < array.length ? <Link to={item.url}>{item.name}</Link>: item.name}
                        </Breadcrumb.Section>
                        {(index+1) < array.length && <Breadcrumb.Divider icon='right chevron'/>}
                    </span>
                ))
            }
        </Breadcrumb>
    )
}

export default BreadcrumbComponent;