import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// test utils file
export default function renderWithRouter(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );

  Wrapper.propTypes = {
    children: PropTypes.instanceOf(Component).isRequired,
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}
