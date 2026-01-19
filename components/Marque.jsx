import React from 'react';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';
const Marque = ({text}) => (
  <Alert
    banner
    title={
      <Marquee pauseOnHover gradient={false}>
        Kindly note that orders placed from 6:00 PM may not be processed the same day. The orders will be moved to the next business day for processing, as our bakery closes at 6:00 PM.
      </Marquee>
    }
  />
);
export default Marque;