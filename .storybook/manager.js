import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import hmstheme from './theme';
addons.setConfig({
  theme: hmstheme,
});
