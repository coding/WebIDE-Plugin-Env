import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// const onClickHandler = (props) => {
//   props.dispatch({ type: 'ADD' });
//   if (props.onClickDebug) return props.onClickDebug();
// };

const CountApp = props => (
  <div
    onClick={() => {
      props.dispatch({ type: 'ADD' });
      if (props.onClickDebug) return props.onClickDebug();
    }}
  >feature1 welcome {props.name} {props.counts}</div>);

CountApp.propTypes = {
  name: PropTypes.string,
  dispatch: PropTypes.func,
  counts: PropTypes.number,
  onClickDebug: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
    ExtensionState: { feature1Counts = 0 } = {},
  } = state;
  return ({ counts: feature1Counts });
};
export default connect(mapStateToProps)(CountApp);
