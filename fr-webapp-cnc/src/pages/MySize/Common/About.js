import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Drawer from 'components/Drawer';
import Text from 'components/Atoms/Text';
import { toggleSection } from 'redux/modules/mySize';
import { getSections } from 'redux/modules/mySize/selectors';

const { object, func } = PropTypes;

@connect(state => ({
  sections: getSections(state),
}), {
  toggleSection,
})
export default class About extends PureComponent {
  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    sections: object,
    toggleSection: func,
  };

  toggleAboutSection = () => {
    this.props.toggleSection('about');
  };

  render() {
    const { props: { sections }, context: { i18n: { mySize: mySizeLabels } } } = this;

    return sections.about && (
      <Drawer
        onCancel={this.toggleAboutSection}
        title={mySizeLabels.aboutHeading}
        variation="noFooter"
      >
        <Text type={Text.type.paragraph}>{mySizeLabels.aboutMySize.explanation}</Text>
      </Drawer>
    );
  }
}
