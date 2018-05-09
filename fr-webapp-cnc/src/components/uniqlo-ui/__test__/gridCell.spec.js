import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Grid from '../core/Grid';
import GridCell from '../core/GridCell';

describe('GridCell', () => {
  it('should display grid cells children when render the GridCell', () => {
    const render = TestUtils.renderIntoDocument(
      <Grid>
        <GridCell>
          <div>TestData1</div>
          <div>TestData2</div>
        </GridCell>
        <GridCell>
          <div>TestData2</div>
        </GridCell>
      </Grid>
    );

    const renNode = TestUtils.scryRenderedComponentsWithType(render, GridCell);
    const cell = ReactDOM.findDOMNode(renNode[0]);

    expect(cell.childNodes.length).to.equal(2);
  });

  it('should span to width provided according to number of columns', () => {
    const render = TestUtils.renderIntoDocument(
      <Grid maxCols={2}>
        <GridCell colSpan={1}>
          <p>TestData2</p>
        </GridCell>
      </Grid>
    );

    const renNode = TestUtils.scryRenderedComponentsWithType(render, Grid);
    const cellWrapper = TestUtils.scryRenderedDOMComponentsWithTag(renNode[0], 'div');
    const cell = ReactDOM.findDOMNode(cellWrapper[0]);

    expect(cell.getAttribute('class')).to.equal('');
  });

  it('should have tag name for the tile root element of the tile when rootClass prop passed', () => {
    const render = TestUtils.renderIntoDocument(
      <Grid maxCols={2}>
        <GridCell colSpan={1} rootClass="section">
          <p>TestData2</p>
        </GridCell>
      </Grid>
    );

    const renNode = TestUtils.findRenderedComponentWithType(render, Grid);
    const cellWrapper = TestUtils.scryRenderedDOMComponentsWithTag(renNode, 'section');

    expect(cellWrapper.length).to.equal(1);
  });

  it('should check the alignment of content', () => {
    const contentDiv = <div style={{ backgroundColor: 'black', height: '20px', width: '20px' }} />;

    const render = TestUtils.renderIntoDocument(
      <Grid horizontalSpacing="10px" verticalSpacing="10px" >
        <GridCell colSpan={3} contentAlign="left">
          {contentDiv}
        </GridCell>
        <GridCell colSpan={3} contentAlign="right">
          {contentDiv}
        </GridCell>
        <GridCell centerContentVertically colSpan={3} contentAlign="center">
          {contentDiv}
        </GridCell>
      </Grid>
    );

    const gridCells = TestUtils.scryRenderedComponentsWithType(render, GridCell);
    const div1 = TestUtils.scryRenderedDOMComponentsWithTag(gridCells[0], 'div');
    const div2 = TestUtils.scryRenderedDOMComponentsWithTag(gridCells[1], 'div');
    const div3 = TestUtils.scryRenderedDOMComponentsWithTag(gridCells[2], 'div');

    expect(div1[0].getAttribute('class')).to.equal('left');
    expect(div2[0].getAttribute('class')).to.equal('right');
    expect(div3[0].getAttribute('class')).to.equal('center');
  });
});
