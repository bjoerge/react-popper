// @flow
import React, { Fragment } from 'react';
import { mount } from 'enzyme';
import Popper from '.';

const mountPopper = (PopperComponent = Popper) =>
  mount(
    <PopperComponent placement="right">
      {({ referenceProps, popperProps, arrowProps }) => (
        <Fragment>
          <div ref={referenceProps.getRef}>Reference</div>
          <div
            data-placement={popperProps.placement}
            ref={popperProps.getRef}
            style={popperProps.style}
          >
            Popper
            <div ref={arrowProps.getRef} style={arrowProps.style} />
          </div>
        </Fragment>
      )}
    </PopperComponent>,
  );

it('renders the expected markup', () => {
  const wrapper = mountPopper();
  expect(wrapper).toMatchSnapshot();
});

it('initializes Popper.js on first update', () => {
  const wrapper = mountPopper();
  expect(wrapper.state('popperInstance')).toBeDefined();
});

it('updates Popper.js on explicitly listed props change', () => {
  const wrapper = mountPopper();
  const instance = wrapper.state('popperInstance');
  wrapper.setProps({ placement: 'bottom' });
  wrapper.update();
  expect(wrapper.state('popperInstance')).not.toBe(instance);
});

it('does not update Popper.js on generic props change', () => {
  const wrapper = mountPopper();
  const instance = wrapper.state('popperInstance');
  wrapper.setProps({ foo: 'bar' });
  wrapper.update();
  expect(wrapper.state('popperInstance')).toBe(instance);
});

it('destroys Popper.js instance on `destroyPopperInstance` call', done => {
  const wrapper = mountPopper();
  wrapper.instance().destroyPopperInstance(() => {
    expect(wrapper.state('popperInstance')).not.toBeDefined();
    done();
    return false;
  });
});

it('destroys Popper.js instance on unmount', () => {
  const wrapper = mountPopper();
  const instance = wrapper.state('popperInstance');
  wrapper.unmount();
  expect(instance.state.isDestroyed).toBe(true);
});
