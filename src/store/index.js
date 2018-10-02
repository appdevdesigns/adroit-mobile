import { configure } from 'mobx';
import AuthStore from './AuthStore';

configure({ enforceActions: 'always' });

export default class Store {
  auth = new AuthStore();
}
