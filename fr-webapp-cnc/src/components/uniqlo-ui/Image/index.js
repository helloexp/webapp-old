import React, { PureComponent, PropTypes } from 'react';
import events from 'utils/events';
import device from 'utils/device';
import { BUTTON_DISABLE_DURATION } from 'config/site/default';
import { mergeStyles, mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import styles from './Image.scss';

const { string, func, object, bool, oneOfType, number } = PropTypes;

const dampattern = /^res\w+fr/g;

// Returns actual image / icons
// URLs validated
//  https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr_medium_HERO-L.png - [1]
//  https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr.png - [2]
//  https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr_custom_187x204.png - [3]
function isDamImage(source, type) {
  // imageURL -> ["https:", "", "abc.com", "...", "resb853cd45da62d5671960480d729d95b2fr_medium_HERO-L.png"]
  const imageURL = (source || '').split('/');

  // key -> "resb853cd45da62d5671960480d729d95b2fr_medium_HERO-L.png"
  // imageURL -> ["https:", "", "abc.com", "..."]
  let key = imageURL.pop();
  let assetsource;

  // test the pattern match of key
  if (dampattern.test(key)) {
    // Split the key
    // [1] -> key = ["resb853cd45da62d5671960480d729d95b2fr", "medium", "HERO-L.png"]
    // [2] -> key = ["resb853cd45da62d5671960480d729d95b2fr.png"]
    // [3] -> key = ["resb853cd45da62d5671960480d729d95b2fr", "custom", "187x204.png"]
    key = key.split('_');

    if (key.length === 1) {
      imageURL.push(key[0].split('.').shift());
    } else {
      imageURL.push(key.shift());
    }

    // After the above loop
    // imageURL -> ["https:", "", "abc.com", "...", "resb853cd45da62d5671960480d729d95b2fr"]
    switch (type) {
      case 'icon':

        // ext - calculation
        // last item in key is expected to contain the extention.
        // taking last item from key and split it with '.' and take last item from that array
        const ext = key.pop().split('.').pop();

        // assetsource -> https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr_all_icon.png
        assetsource = `${imageURL.join('/')}_all_icon.${ext}`;
        break;
      default:

        // deviceSize -> small || medium || large
        const deviceSize = device.getDeviceSize();

        // DAM send the medium images by default when the user select variations
        // that has to be replaced according to deviceSize
        // specific for [1]
        if (key.shift() === 'medium') {
          // category -> HERO-L.png
          const category = key.pop();

          // assetsource -> https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr_small_HERO-L.png
          assetsource = `${imageURL.join('/')}_${deviceSize}_${category}`;
        } else {
          // for [2] & [3]
          // assetsource -> https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr.png
          // assetsource -> https://abc.com/.../resb853cd45da62d5671960480d729d95b2fr_custom_187x204.png
          assetsource = source;
        }
    }

    // return the source for DAM images
    return assetsource;
  }

  // return false for other images (i.e) don't update anything.
  return false;
}

const getMarkup = (comp) => {
  const imageComp = comp;
  const {
    alternateText,
    className,
    source,
    style,
    useImgTag,
    imageclassName,
    tileclassName,
    fireClickOnTouchEnd,
    width,
    height,
  } = comp.props;

  const {
    assetsource,
  } = comp.state;

  const imageClass = stylePropsParser(imageclassName, styles);
  const clickSate = (comp.state.clicked ? 'disabledMarker' : 'enabledMarker');

  const classNames = {
    classWithImageTag: styles && mergeClasses(styles.image, stylePropsParser(className, styles),
                       styles.withImageTag, tileclassName, imageClass, stylePropsParser(clickSate, styles)),
    classWithoutImageTag: styles && mergeClasses(styles.image,
                         styles.withoutImageTag, tileclassName, imageClass),
  };

  let imageSource = assetsource && assetsource !== '' ? assetsource : source;

  if (events && !comp.subscription && assetsource !== '') {
    imageSource = assetsource;
    imageComp.subscription = events.subscribe('scroll', comp.handleScroll);
  }

  const computedImageStyle = {
    backgroundImage: `url('${imageSource}')`,
    width,
    height,

    // Will remove the style property after completing all the parent component.
    ...style,
  };
  let markup;

  const imageReference = currentcomp => (imageComp.domnode = currentcomp);

  const dataAttributes = {};

  if (source !== imageSource) {
    dataAttributes['data-fullimg'] = source;
  }

  // 'google-map-react' on touch devices are not firing onClick events, added an onTouchEnd event-handler to use instead
  const eventHandlerProps = {
    [fireClickOnTouchEnd ? 'onTouchEnd' : 'onClick']: comp.handleOnClick,
  };

  if (useImgTag) {
    const mergedStyle = mergeStyles({ width, height }, style);

    markup =
      (<img
        alt={alternateText}
        className={classNames.classWithImageTag}
        onError={comp.handleOnError}
        onLoad={comp.handleOnLoad}
        {...eventHandlerProps}
        ref={imageReference}
        src={imageSource}
        style={mergedStyle}
        {...dataAttributes}
      />)
    ;
  } else {
    markup =
      (<div
        className={classNames.classWithoutImageTag}
        onClick={comp.handleOnClick}
        ref={imageReference}
        style={computedImageStyle}
      />)
    ;
  }

  return markup;
};

export default class Image extends PureComponent {
  static displayName = 'Image';
  static propTypes = {
    alternateText: string,
    className: string,
    onLoad: func,
    onClick: func,
    source: string,
    style: object,
    useImgTag: bool,
    preventMultipleClicks: bool,
    width: oneOfType([string, number]),
    height: oneOfType([string, number]),
    imageclassName: string,
    tileclassName: string,
    fireClickOnTouchEnd: bool,
  };

  static contextTypes = {
    events: object,
  };

  static defaultProps = {
    source: '',
    onLoad: () => null,
    useImgTag: true,
    imageclassName: '',
  };

  // TODO: fill this with the default loader
  state = {
    assetsource: '',
    clicked: false,
  };

  componentWillMount() {
    this.initLazy();
  }

  componentDidMount() {
    this.handleScroll();
  }

  componentWillUnmount() {
    const { subscription } = this;

    // Required as it could fail the test
    events.unsubscribe(subscription);

    if (this.props.preventMultipleClicks) {
      clearTimeout(this.resetClick);
    }
  }

  subscription = undefined;

  initLazy = () => {
    const { source } = this.props;
    const lazySource = isDamImage(source, 'icon');

    if (lazySource) {
      this.setState({
        assetsource: lazySource,
      });
    }
  };

  handleScroll = () => {
    const { subscription } = this;
    const { source } = this.props;
    const updatedSource = isDamImage(source);

    if (events.isvisible(this.domnode) && updatedSource) {
      events.unsubscribe(subscription);
      if (updatedSource) {
        this.setState({
          assetsource: updatedSource,
        });
      }
    }

    if (subscription && !this.domnode) {
      events.unsubscribe(subscription);
    }
  };

  handleOnLoad = (event) => {
    if (this.props.onLoad) this.props.onLoad(event);
  };

  handleOnClick = (event) => {
    const { preventMultipleClicks } = this.props;

    if (preventMultipleClicks) {
      this.setState({ clicked: true });
      this.resetClick = setTimeout(() => this.setState({ clicked: false }), BUTTON_DISABLE_DURATION);
    }

    if (this.props.onClick) this.props.onClick(event);
  };

  handleOnError = () => {
    this.setState({
      assetsource: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=',
    });
  };

  render() {
    return getMarkup(this);
  }
}
