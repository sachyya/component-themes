import React from 'react';

const FooterText = ( { text, className } ) => {
	return (
		<div className={ className }>
			{ text || <a href="/">Create a free website or blog at WordPress.com.</a> }
		</div>
	);
};

FooterText.description = 'The footer text block of a site.';
FooterText.editableProps = {
	text: {
		type: 'string',
		label: 'The text to display. Defaults to "Create a free website or blog at WordPress.com"'
	}
};

export default FooterText;