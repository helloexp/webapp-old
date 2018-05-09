import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { spy } from 'sinon';
import Carousel, { CarouselHead, CarouselTile, NavHead } from '../Carousel';
import NavHeadStyles from '../Carousel/NavHead.scss';
import Text from '../Text';

describe('Carousel', () => {
  const positive = true;
  const negative = false;

  describe('Rendering:', () => {
    it('should render the components with CarouselTile', () => {
      const result = TestUtils.renderIntoDocument(<Carousel >
        <Text>Some Text for the carousel</Text>
        <Text>Some Text for the carousel</Text>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);

      expect(tiles.length).to.equal(2);
    });

    it('should pass style and update highlightStyle on selection to CarouselHead', () => {
      const style = {
        backgroundColor: 'red',
      };

      const highlightStyle = {
        backgroundColor: 'blue',
      };

      const result = TestUtils.renderIntoDocument(<Carousel tabPosition="bottom">
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselHead highlightStyle={highlightStyle} style={style}>
          <Text>OUTERWEAR</Text>
          <Text>OUTERWEAR</Text>
        </CarouselHead>
      </Carousel>);

      const head = TestUtils.scryRenderedComponentsWithType(result, CarouselHead);
      const headContent = ReactDOM.findDOMNode(head[0]);
      const firstChild = headContent.childNodes[0];
      const secondChild = headContent.childNodes[1];
      const firstChildStyle = firstChild.style;
      const secondChildStyle = secondChild.style;

      expect(firstChildStyle.backgroundColor).to.equal('blue');
      expect(secondChildStyle.backgroundColor).to.contains('red');
    });

    it('should render carousel head with childrens equal ot the count of CarouselTile', () => {
      const result = TestUtils.renderIntoDocument(<Carousel tabHead={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      let head = TestUtils.scryRenderedComponentsWithType(result, CarouselHead);

      head = ReactDOM.findDOMNode(head[0]);

      expect(head.childNodes.length).to.equal(3);
    });

    it('should render carousel with arrow head when navHead is true', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const nav = TestUtils.scryRenderedComponentsWithType(result, NavHead);

      expect(nav.length).to.equal(2);
    });

    it('should render carousel without arrow head when navHead is false', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={negative}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const nav = TestUtils.scryRenderedComponentsWithType(result, NavHead);

      expect(nav.length).to.equal(0);
    });

    it('should render an text passed in carouseltile', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const nav = TestUtils.scryRenderedComponentsWithType(result, Text);

      expect(nav.length).to.equal(1);
    });

    it('NavHead should render arrow based on direction prop', () => {
      const upArrow = TestUtils.renderIntoDocument(<NavHead direction="up" />);
      const rightArrow = TestUtils.renderIntoDocument(<NavHead direction="right" />);
      const downArrow = TestUtils.renderIntoDocument(<NavHead direction="down" size={5} />);
      const leftArrow = TestUtils.renderIntoDocument(<NavHead direction="left" />);
      const tempArrow = TestUtils.renderIntoDocument(<NavHead direction="none" />);

      const up = ReactDOM.findDOMNode(upArrow);
      const upStyle = up.childNodes[0].getAttribute('class');

      expect(up.getAttribute('class')).to.have.string('');
      expect(up.getAttribute('class')).to.have.string('');
      expect(upStyle).to.have.string('');

      const down = ReactDOM.findDOMNode(downArrow);
      const downStyle = down.childNodes[0].getAttribute('class');

      expect(down.getAttribute('class')).to.have.string('');
      expect(down.getAttribute('class')).to.have.string('');
      expect(downStyle).to.have.string('');

      const right = ReactDOM.findDOMNode(rightArrow);

      expect(right.getAttribute('class')).to.have.string('');
      expect(right.getAttribute('class')).to.have.string('');
      expect(right.childNodes[0].getAttribute('class')).to.have.string('');

      const left = ReactDOM.findDOMNode(leftArrow);

      expect(left.getAttribute('class')).to.have.string('');
      expect(left.getAttribute('class')).to.have.string('');
      expect(left.childNodes[0].getAttribute('class')).to.have.string('');

      const temp = ReactDOM.findDOMNode(tempArrow);
      const tempStyle = temp.getAttribute('class');

      expect(tempStyle).to.not.have.string(NavHeadStyles.left);
      expect(tempStyle).to.not.have.string(NavHeadStyles.right);
      expect(tempStyle).to.not.have.string(NavHeadStyles.top);
      expect(tempStyle).to.not.have.string(NavHeadStyles.bottom);
    });
  });

  describe('Animation:', () => {
    it('should change the tile prop current if autoScroll is set to true', (done) => {
      const result = TestUtils.renderIntoDocument(<Carousel autoScroll={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);

      expect(tiles[0].props.current).to.equal(0);
      done();
    });

    it('should have transition to left if autoScroll is set to true animation is set to scroll', () => {
      const result = TestUtils.renderIntoDocument(<Carousel animation="scroll" autoScroll={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);
      const tile = ReactDOM.findDOMNode(tiles[0]);
      const style = tile.getAttribute('class');

      expect(style).to.have.string('');
      expect(style).to.have.string('');
    });

    it('should have transition to opacity if autoScroll is set to true animation is set to fade', () => {
      const result = TestUtils.renderIntoDocument(<Carousel animation="fade" autoScroll={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);
      const tile = ReactDOM.findDOMNode(tiles[0]);
      const style = tile.getAttribute('class');

      expect(style).to.have.string('');
      expect(style).to.have.string('');
    });

    it('highlightStyle should be applied to active CarouselHead', (done) => {
      const style = {
        backgroundColor: 'red',
      };
      const highlightStyle = {
        backgroundColor: 'blue',
      };

      const result = TestUtils.renderIntoDocument(<Carousel autoScroll={positive} tabPosition="bottom">
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselHead highlightStyle={highlightStyle} style={style}>
          <Text>OUTERWEAR</Text>
          <Text>OUTERWEAR</Text>
        </CarouselHead>
      </Carousel>);

      const head = TestUtils.scryRenderedComponentsWithType(result, CarouselHead);
      const headContent = ReactDOM.findDOMNode(head[0]);
      const firstChild = headContent.childNodes[0];
      const secondChild = headContent.childNodes[1];
      const firstChildStyle = firstChild.style;
      const secondChildStyle = secondChild.style;

      expect(firstChildStyle.backgroundColor).to.equal('blue');
      expect(secondChildStyle.backgroundColor).to.contains('red');
      done();
    });
  });

  describe('Events:', () => {
    it('should change the active slide forward when the user click on navigation head', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={positive} tabHead={negative}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);
      const head = TestUtils.scryRenderedComponentsWithType(result, NavHead);
      const nextHead = ReactDOM.findDOMNode(head[1]);

      TestUtils.Simulate.click(nextHead);

      expect(tiles[0].props.current).to.equal(1);
    });

    it('should change the active slide backward when the user click on navigation head', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={positive} tabHead={negative}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);
      const head = TestUtils.scryRenderedComponentsWithType(result, NavHead);
      const prevHead = ReactDOM.findDOMNode(head[0]);

      TestUtils.Simulate.click(prevHead);

      expect(tiles[0].props.current).to.equal(2);
    });

    it('should update the style the user move the mouseover on navigation head', () => {
      const result = TestUtils.renderIntoDocument(<Carousel navHead={positive} tabHead={negative}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const head = TestUtils.scryRenderedComponentsWithType(result, NavHead);
      let prevHead = ReactDOM.findDOMNode(head[0]);
      let prevStyle = prevHead.getAttribute('class');

      expect(prevStyle).to.have.string('');
      TestUtils.Simulate.mouseOver(prevHead);
      prevHead = ReactDOM.findDOMNode(head[0]);
      prevStyle = prevHead.getAttribute('class');
      expect(prevStyle).to.have.string('');
      TestUtils.Simulate.mouseOut(prevHead);
      prevHead = ReactDOM.findDOMNode(head[0]);
      prevStyle = prevHead.getAttribute('class');
      expect(prevStyle).to.have.string('');
    });

    it('NavHead should trigger the event supplied in onTouchTap', () => {
      const onTouchTapSpy = spy();
      const upArrow = TestUtils.renderIntoDocument(<NavHead direction="up" onTouchTap={onTouchTapSpy} size={10} />);
      const up = ReactDOM.findDOMNode(upArrow);

      TestUtils.Simulate.click(up);
      expect(onTouchTapSpy.called).to.equal(true);

      const downArrow = TestUtils.renderIntoDocument(<NavHead direction="down" onTouchTap={onTouchTapSpy} value="hello" />);
      const down = ReactDOM.findDOMNode(downArrow);

      TestUtils.Simulate.click(down);
      expect(onTouchTapSpy.getCall(1).args[0]).to.be.equal('hello');
    });

    it('should render the carouseltile in view port according to the display property', (done) => {
      const onSlideSpy = spy();
      const result = TestUtils.renderIntoDocument(<Carousel autoScroll={positive} display={2} onSlide={onSlideSpy} tabHead={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      const heads = TestUtils.scryRenderedComponentsWithType(result, CarouselHead);
      let lastHead = ReactDOM.findDOMNode(heads[0]);

      lastHead = ReactDOM.findDOMNode(lastHead.childNodes[3]);
      TestUtils.Simulate.click(lastHead);

      setTimeout(() => {
        const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);

        expect(tiles[0].props.current).to.equal(3);
        expect(onSlideSpy.called).to.be.equal(true);

        done();
      }, 450);
    });

    it('should run two cycles of scrolling', (done) => {
      const result = TestUtils.renderIntoDocument(<Carousel animation="scroll" autoScroll={positive} display={2} tabHead={positive}>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
        <CarouselTile>
          <Text>Some Text for the carousel</Text>
        </CarouselTile>
      </Carousel>);

      setTimeout(() => {
        const tiles = TestUtils.scryRenderedComponentsWithType(result, CarouselTile);

        expect(tiles[0].props.current).to.equal(0);
        done();
      }, 525);
    });
  });
});
