import React from 'react';
import LazyLoad from 'react-lazyload';
import './Gallery.scss';

interface Props {
	images?: string[];
}

const Gallery: React.FC<Props> = ({ images }) => {
	
	return (
		<div className="gallery">
			{images.map((image, idx) => (
				<div key={String(idx)} className="img-wrapper">
					<LazyLoad height={150}>
						<img src={`${process.env.REACT_APP_API_ENDPOINT}${image}`} className="img" />
					</LazyLoad>
				</div>
			))}
		</div>
	);
};

export default Gallery;
