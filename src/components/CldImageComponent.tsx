import React from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { Image } from 'semantic-ui-react';
import {limitPad,fit} from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
    cloud: {
        cloudName: 'imagerapp'
    }
});

interface CldPropsType {
    src: string,
    width?: number,
    height?: number,
    wrapped?: boolean
}

const CldImageComponent = (props: CldPropsType) => {
    const myImage = cld.image(process.env.REACT_APP_CLOUDINARY_IMAGE_FOLDER + props.src);
    myImage.format('jpg');
    if(props.width && props.height)
        myImage.resize(limitPad().width(props.width).height(props.height));

    return (
        <Image src={myImage.toURL()} wrapped={props.wrapped !== null ? props.wrapped : false} ui={false} />
    );
};

export default CldImageComponent;
