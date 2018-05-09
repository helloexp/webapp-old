import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import cx from 'classnames';
import Grid from '../core/Grid';
import GridCell from '../core/GridCell';
import gridStyles from '../core/Grid/Grid.scss';

describe('Grid', () => {
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

    expect(cell.getAttribute('class')).to.equal(cx(gridStyles.grid));
  });

  it('should span cell to rowSpan provided', () => {
    const render = TestUtils.renderIntoDocument(
      <Grid cellHeight={100}>
        <GridCell rowSpan={2}>
          <p>TestData2</p>
        </GridCell>
      </Grid>
    );

    const renNode = TestUtils.scryRenderedComponentsWithType(render, Grid);
    const cellWrapper = TestUtils.scryRenderedDOMComponentsWithTag(renNode[0], 'div');
    const cell = ReactDOM.findDOMNode(cellWrapper[0]);

    expect(cell.getAttribute('class')).to.equal(cx(gridStyles.grid));
  });

  it('should have tag name for the tile root element of the tile when rootClass prop passed', () => {
    const render = TestUtils.renderIntoDocument(
      <Grid maxCols={1}>
        <GridCell colSpan={1} rootClass="section">
          <p>TestData2</p>
        </GridCell>
      </Grid>
    );

    const renNode = TestUtils.findRenderedComponentWithType(render, Grid);
    const cellWrapper = TestUtils.scryRenderedDOMComponentsWithTag(renNode, 'section');

    expect(cellWrapper.length).to.equal(1);
  });
});
