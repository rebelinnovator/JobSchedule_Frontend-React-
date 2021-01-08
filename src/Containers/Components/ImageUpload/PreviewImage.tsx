import React from 'react';
import { Close } from '../../../Utils/Icon';

interface Props {
	url: string;
	onRemove?: () => void;
}

const PreviewImage: React.FC<Props> = ({ url, onRemove }) => {
	return (
		<div className="thumb-wrapper">
			<div className="thumb">
				{onRemove && <Close className="icon-close" onClick={onRemove} />}
				<img
					src={url}
				/>
			</div>
		</div>
	);
};

export default PreviewImage;
