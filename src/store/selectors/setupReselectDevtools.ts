// @ts-ignore
import { registerSelectors } from 'reselect-tools';
import * as selectors from './index';

export function setupReselectDevTools() {
  registerSelectors(selectors);
}
