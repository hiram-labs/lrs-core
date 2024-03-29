import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import {
  visualisationResultsSelector,
  visualisationAllAggregationsHaveResultSelector,
  visualisationShouldFetchSelector,
  fetchVisualisation
} from 'ui/redux/modules/visualise';
import { unflattenAxes } from 'lib/helpers/visualisation';
import { VISUALISATION_COLORS } from 'ui/utils/constants';
import { getFormattedResults } from 'ui/utils/visualisationResults';
import withModel from 'ui/utils/hocs/withModel';
import Spinner from 'ui/components/Spinner';

const withStatementsVisualisation = (WrappedComponent) => {
  class WithStatementsVisualisation extends Component {
    static propTypes = {
      id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      schema: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      model: PropTypes.instanceOf(Map),
      results: PropTypes.instanceOf(List),
      hasAllResult: PropTypes.bool,
      shouldFetch: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
      fetchVisualisation: PropTypes.func // eslint-disable-line react/no-unused-prop-types
    };

    static defaultProps = {
      model: new Map(),
      results: new List(),
      shouldFetch: false
    };

    componentDidMount = () => {
      this.fetchIfRequired(this.props);
    };

    shouldComponentUpdate = ({ results, hasAllResult, model }) =>
      !(
        this.props.results.equals(results) &&
        this.props.hasAllResult === hasAllResult &&
        this.getAxes().equals(unflattenAxes(model)) &&
        this.props.model.get('stacked') === model.get('stacked') &&
        this.props.model.get('isDonut') === model.get('isDonut') &&
        this.props.model.get('barChartGroupingLimit') === model.get('barChartGroupingLimit') &&
        this.props.model.get('filters').equals(model.get('filters')) &&
        this.props.model.get('showStats') === model.get('showStats') &&
        this.props.model.get('statsAtBottom') === model.get('statsAtBottom') &&
        this.props.model.get('trendLines') === model.get('trendLines') &&
        this.props.model.get('contextLabel') === model.get('contextLabel')
      );

    componentDidUpdate = () => {
      this.fetchIfRequired(this.props);
    };

    fetchIfRequired = (props) => {
      if (props.shouldFetch) {
        props.fetchVisualisation(props.id);
      }
    };

    isLoading = () => !this.props.hasAllResult;

    getFormattedResults = (results) =>
      getFormattedResults(this.getAxes().getIn(['group', 'optionKey'], 'date'), results);

    getAxes = () => unflattenAxes(this.props.model);

    renderPreview = () => (
      <WrappedComponent
        {...this.props}
        previewPeriod={this.props.model.get('previewPeriod')}
        stacked={this.props.model.get('stacked', true)}
        trendLines={this.props.model.get('trendLines', false)}
        axes={this.getAxes()}
        model={this.props.model}
        visualisation={this.props.model}
        labels={this.props.model.get('filters', new List()).map((filter) => filter.get('label'))}
        colors={this.props.model
          .get('filters', new List())
          .map((filter, index) => filter.get('color') || VISUALISATION_COLORS[index])}
        getFormattedResults={this.getFormattedResults}
      />
    );

    renderSpinner = () => (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)'
        }}
      >
        <Spinner />
      </div>
    );

    render = () => (
      <div style={{ height: '100%' }}>{this.isLoading() ? this.renderSpinner() : this.renderPreview()}</div>
    );
  }
  return connect(
    (state, { id }) => ({
      results: visualisationResultsSelector(id)(state),
      hasAllResult: visualisationAllAggregationsHaveResultSelector(id)(state),
      shouldFetch: visualisationShouldFetchSelector(id)(state)
    }),
    { fetchVisualisation }
  )(WithStatementsVisualisation);
};

export default compose(
  withProps(() => ({
    schema: 'visualisation'
  })),
  withModel,
  withStatementsVisualisation
);
