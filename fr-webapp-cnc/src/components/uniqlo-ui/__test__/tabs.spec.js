import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import Tabs from '../Tabs/Tabs';
import Tab from '../Tabs/Tab';

describe('Tabs', () => {
  it('should render Tab components as children.', () => {
    const wrapper = testHelpers.mountWithStore(
      <Tabs cols={2} defaultTabIndex={0} type="bordered">
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women_o.gif"
        />
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men_o.gif"
        />
      </Tabs>
    );

    expect(wrapper.find(Tab).length).to.be.equal(2);
    expect(wrapper.props().defaultTabIndex).to.equal(0);
    expect(wrapper.props().cols).to.equal(2);
    expect(wrapper.props().type).to.equal('bordered');
  });

  it('Tabs should render genderTab variation when props type genderTab passed.', () => {
    const wrapper = testHelpers.shallowWithStore(
      <Tabs cols={3} padding={0} type="genderTab">
        <Tab text="text test1" />
        <Tab text="text test2" />
      </Tabs>
    );

    expect(wrapper.find({ type: 'genderTab' })).to.have.length(2);
  });

  it('Tabs should render borderLess tab when  props type borderLess passed.', () => {
    const wrapper = testHelpers.shallowWithStore(
      <Tabs cols={3} padding={0} type="borderLess">
        <Tab text="text test1" />
        <Tab text="text test2" />
      </Tabs>
    );

    expect(wrapper.find({ type: 'borderLess' })).to.have.length(2);
  });

  it('Tabs should render bordered tab when  props type bordered passed.', () => {
    const wrapper = testHelpers.shallowWithStore(
      <Tabs cols={3} padding={0} type="bordered">
        <Tab text="text test1" />
        <Tab text="text test2" />
      </Tabs>
    );

    expect(wrapper.find({ type: 'bordered' })).to.have.length(2);
  });

  it('Tabs should render text with given props.', () => {
    const wrapper = testHelpers.mountWithStore(
      <Tab
        link="https://google.com"
        target="_blank"
        text="some text"
      />
    );

    expect(wrapper.find('[href="https://google.com"]')).to.have.length(1);
    expect(wrapper.find('[target="_blank"]')).to.have.length(1);
    expect(wrapper.find('[href="https://google.com"]').text()).to.equal('some text');
  });

  it('should trigger onTabChange callback on clicking a tab.', () => {
    const onTabChangeSpy = spy();
    const wrapper = testHelpers.mountWithStore(
      <Tabs
        cols={3}
        onTabChange={onTabChangeSpy}
      >
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women_o.gif"
        />
      </Tabs>
    );

    wrapper.find(Tab).simulate('click');
    expect(onTabChangeSpy.called).to.equal(true);
  });

  it('should trigger onPress callback on clicking a tab.', () => {
    const onPressSpy = spy();
    const wrapper = testHelpers.mountWithStore(
      <Tabs
        cols={3}
      >
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women_o.gif"
          onPress={onPressSpy}
        />
      </Tabs>
    );

    wrapper.find(Tab).simulate('click');
    expect(onPressSpy.called).to.equal(true);
  });

  it('should display content according to tab selection', () => {
    const wrapper = testHelpers.mountWithStore(
      <Tabs defaultTabIndex={0}>
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women_o.gif"
        >
          ONE
        </Tab>
        <Tab
          defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men.gif"
          hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men_o.gif"
        >
          TWO
        </Tab>
      </Tabs>
    );

    expect(wrapper.find(Tabs).text()).to.equal('ONE');
    wrapper.find(Tab).last().simulate('click');
    expect(wrapper.find(Tabs).text()).to.equal('TWO');
  });

  it('should change content when the defaultTabIndex changes', () => {
    const TestComp = React.createClass({ // eslint-disable-line react/prefer-es6-class
      changeIndex() {
        this.setState({
          defaultIndex: 1,
        });
      },

      render() {
        let openIndex = 0;

        if (this.state && this.state.defaultIndex) {
          openIndex = this.state.defaultIndex;
        }

        return (
          <div onClick={this.changeIndex}>
            <Tabs defaultTabIndex={openIndex}>
              <Tab
                defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women.gif"
                hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_women_o.gif"
              >
                ONE
              </Tab>
              <Tab
                defaultImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men.gif"
                hoverImage="http://im.uniqlo.com/images/jp/pc/img/feature/uq/limited/women/150206-anc-btn_men_o.gif"
              >
                TWO
              </Tab>
            </Tabs>
          </div>
        );
      },
    });

    const wrapper = testHelpers.mountWithStore(<TestComp />);

    expect(wrapper.find(Tabs).props().defaultTabIndex).to.equal(0);
    expect(wrapper.find(Tabs).text()).to.equal('ONE');
    wrapper.find(Tab).last().simulate('click');
    expect(wrapper.find(Tabs).props().defaultTabIndex).to.equal(1);
    expect(wrapper.find(Tabs).text()).to.equal('TWO');
  });
});
