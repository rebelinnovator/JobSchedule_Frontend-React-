import React from 'react';
import Helmet from 'react-helmet';

const AppTitle = ({ title }: { title: any }) => {
  const defaultTitle = 'CE Solution';
  return (
        <Helmet>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
  );
};

export { AppTitle };
