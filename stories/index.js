import React from 'react';
import { storiesOf } from '@kadira/storybook';
import {
  CountApp,
} from '../src/CountApp';

storiesOf('Form', module)
  .add('Basic', () => (
    <div>
      <CountApp></CountApp>
    </div>
  ));
