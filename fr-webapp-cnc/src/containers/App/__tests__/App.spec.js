import React from 'react';
import App from 'containers/App/App';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
import { shallow } from 'enzyme';

const i18n = require('../../../i18n/strings-ja');

const client = new ApiClient();

describe('App', () => {
  // const mockStore = {
  //   info: {
  //     load: () => {},
  //     loaded: true,
  //     loading: false,
  //     data: {
  //       message: 'This came from the api server',
  //       time: Date.now()
  //     }
  //   }
  // };
  const store = createStore(browserHistory, client, {});
  const wrapper = shallow(
    <Provider key="provider" store={store}>
      <App params={{ region: 'jp' }}>
        <article>Hello!</article>
      </App>
    </Provider>,
    {
      context: {
        i18n,
      },
    }
  );

  it('should render correctly', () => chai.expect(wrapper).to.be.ok);
});
