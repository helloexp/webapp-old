import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Image from 'components/uniqlo-ui/Image';
import Drawer from 'components/Drawer';
import { toggleSection } from 'redux/modules/mySize';
import { getSections } from 'redux/modules/mySize/selectors';
import howToMeasure from 'pages/MySize/images/how-to-measure.png';

const { object, func } = PropTypes;

@connect(state => ({
  sections: getSections(state),
}), {
  toggleSection,
})
export default class HowTo extends PureComponent {
  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    sections: object,
    toggleSection: func,
  };

  onCancel = () => {
    this.props.toggleSection('howTo');
  };

  render() {
    const { props: { sections }, context: { i18n: { mySize: mySizeLabels } } } = this;

    return sections.howTo && (
      <Drawer
        onCancel={this.onCancel}
        title={mySizeLabels.measureHeading}
        variation="noFooter"
      >
        <Image source={howToMeasure} />
      </Drawer>
    );
  }
}
