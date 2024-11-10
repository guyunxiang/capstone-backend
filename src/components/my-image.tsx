import React from 'react';
import { ActionProps } from 'adminjs'


const MyImage = (props: ActionProps) => {
  const { record } = props;
  const { title, cover_image} = record?.params || {};

  console.log(10, props);

  return (
    <div>
      <img src={cover_image} alt={title} width={100} />
    </div>
  );
};

export default MyImage;
