import { filterActions } from "redux-ignore";

import app, { AppStateType } from "./app";

export interface ReduxStateType {
  app: AppStateType;
}

export default {
  app: filterActions(app, action => action.type.match(/app\//))
};
