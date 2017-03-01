import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import CountApp from '../src/app';

storiesOf('Form', module)
  .add('Basic', () => (
    <div>
      <CountApp onClickDebug={action('button clicked')} />
    </div>
  ));
