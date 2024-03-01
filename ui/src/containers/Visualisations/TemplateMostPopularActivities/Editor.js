import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { Tab } from 'react-toolbox/lib/tabs';
import Tabs from 'ui/components/Material/Tabs';
import BarAxesEditor from 'ui/containers/VisualiseForm/StatementsForm/AxesEditor/BarAxesEditor';
import AddQueryButton from '../components/AddQueryButton';
import BarChartGroupingLimitForm from '../components/BarChartGroupingLimitForm';
import DescriptionForm from '../components/DescriptionForm';
import FiltersForm from '../components/FiltersForm';
import PreviewPeriodPicker from '../components/PreviewPeriodPicker';
import StatsTopOrBottomSwitch from '../components/StatsTopOrBottomSwitch';
import ShowStatsSwitch from '../components/ShowStatsSwitch';
import SourceViewForm from '../components/SourceViewForm';
import StackedSwitch from '../components/StackedSwitch';
import TimezoneForm from '../components/TimezoneForm';
import Viewer from './Viewer';

/**
 * @param {immutable.Map} props.model - visualisation model
 * @param {string} props.orgTimezone
 * @param {(args: object) => void} props.updateModel
 * @param {(args: object) => void} props.setInMetadata
 */
const Editor = ({ model, orgTimezone, updateModel, setInMetadata }) => {
  const id = model.get('_id');
  const [tabIndex, setTabIndex] = useState(0);

  const onChangeDescription = useCallback(
    (description) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'description',
        value: description
      });
    },
    [id]
  );

  const onClickAddQueryButton = useCallback(() => {
    updateModel({
      schema: 'visualisation',
      id,
      path: 'filters',
      value: model.get('filters').push(new Map())
    });
  }, [id, model.get('filters').hashCode()]);

  const onChangeStacked = useCallback(
    (stacked) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'stacked',
        value: stacked
      });
    },
    [id]
  );

  const onChangeSourceView = useCallback(
    (checked) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'sourceView',
        value: checked
      });
    },
    [id]
  );

  const onChangeShowStats = useCallback(
    (checked) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'showStats',
        value: checked
      });
    },
    [id]
  );

  const onChangeStatsAtBottom = useCallback(
    (checked) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'statsAtBottom',
        value: checked
      });
    },
    [id]
  );

  const onChangeBarChartGroupingLimit = useCallback(
    (limit) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'barChartGroupingLimit',
        value: limit
      });

      setInMetadata({
        schema: 'visualisation',
        id,
        path: ['activePage'],
        value: 0
      });
    },
    [id]
  );

  const onChangeFilters = useCallback(
    (filters) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'filters',
        value: filters
      });
    },
    [id]
  );

  const onChangeTimezone = useCallback(
    (timezone) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'timezone',
        value: timezone
      });
    },
    [id]
  );

  const onChangePreviewPeriod = useCallback(
    (previewPeriod) => {
      updateModel({
        schema: 'visualisation',
        id,
        path: 'previewPeriod',
        value: previewPeriod
      });
    },
    [id]
  );

  return (
    <div className="row">
      <div className="col-md-6 left-border">
        <div>
          <DescriptionForm
            visualisationId={id}
            description={model.get('description', '')}
            onChange={onChangeDescription}
          />

          <Tabs index={tabIndex} onChange={setTabIndex}>
            <Tab key="axes" label="Axes">
              <BarAxesEditor model={model} />
            </Tab>

            <Tab key="series" label="Series">
              {model.get('filters').count() < 5 && <AddQueryButton onClick={onClickAddQueryButton} />}

              <StackedSwitch visualisationId={id} stacked={model.get('stacked', true)} onChange={onChangeStacked} />

              <FiltersForm
                visualisationId={id}
                filters={model.get('filters', new List())}
                canEditLabel={false}
                timezone={model.get('timezone')}
                orgTimezone={orgTimezone}
                onChange={onChangeFilters}
              />
            </Tab>

            <Tab key="options" label="Options">
              <SourceViewForm sourceView={model.get('sourceView')} onChange={onChangeSourceView} />

              {model.get('sourceView') && (
                <ShowStatsSwitch showStats={model.get('showStats')} onChange={onChangeShowStats} />
              )}

              {model.get('sourceView') && model.get('showStats') && (
                <StatsTopOrBottomSwitch statsAtBottom={model.get('statsAtBottom')} onChange={onChangeStatsAtBottom} />
              )}

              <BarChartGroupingLimitForm
                barChartGroupingLimit={model.get('barChartGroupingLimit')}
                onChange={onChangeBarChartGroupingLimit}
              />

              <TimezoneForm
                visualisationId={id}
                timezone={model.get('timezone', null)}
                orgTimezone={orgTimezone}
                onChange={onChangeTimezone}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-group form-inline" style={{ textAlign: 'right' }}>
          <PreviewPeriodPicker
            visualisationId={id}
            previewPeriod={model.get('previewPeriod')}
            onChange={onChangePreviewPeriod}
          />
        </div>

        <div style={{ height: '400px', paddingTop: 5 }}>
          <Viewer visualisationId={id} showSourceView={model.get('sourceView')} />
        </div>
      </div>
    </div>
  );
};

Editor.propTypes = {
  model: PropTypes.instanceOf(Map).isRequired,
  orgTimezone: PropTypes.string.isRequired,
  updateModel: PropTypes.func.isRequired,
  setInMetadata: PropTypes.func.isRequired
};

export default Editor;
