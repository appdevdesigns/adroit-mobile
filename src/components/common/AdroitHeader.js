import React from 'react';
import PropTypes from 'prop-types';
import { Header, Left, Body, Right, Title } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import baseStyles from 'src/assets/style';

const AdroitHeader = ({ title }) => (
  <Header>
    <Left style={baseStyles.headerLeft}>
      <BackButton />
    </Left>
    <Body style={baseStyles.headerBody}>
      <Title>{title}</Title>
    </Body>
    <Right style={baseStyles.headerRight} />
  </Header>
);

AdroitHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AdroitHeader;
