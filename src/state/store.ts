import { createStore, applyMiddleware, compose } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
import reducers from "./index";
import thunkMiddleware from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

const config = {
  key: "root",
  storage
};

const persistReducers = persistCombineReducers(config, reducers);

export default function configureStore() {
  const middleware = [thunkMiddleware];

  let store = compose(composeWithDevTools(applyMiddleware(...middleware)))(createStore)(
    persistReducers
  );

  let persistor = persistStore(store);

  return { store, persistor };
}
