import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Html, { stripScripts } from '../Html';

describe('<Html>', () => {
  it('should render component', () => {
    const html = '{"text":"test text<p id="test_deco">testtext</p>","created":1470229752397}';
    const wrapper = mount(<Html html={html} />);

    expect(wrapper.find(Html).length).to.be.equal(1);
  });

  it('parses script tag', () => {
    const html = '{"text":"<script type="text/javascript">\n<!--\ndocument.write("Hello World!!");\n// -->\n</script>","created":1470229752416}';
    const parsed = stripScripts(html);

    expect(parsed.toEval.length).to.equal(1);
  });
});
