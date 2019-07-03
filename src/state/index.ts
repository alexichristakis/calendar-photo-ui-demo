import { filterActions } from "redux-ignore";

import app, { AppStateType } from "./app";

interface ReduxStateType {
  app: AppStateType;
}

export { ReduxStateType };

export default {
  app: filterActions(app, action => action.type.match(/app\//))
};
