import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import configureStore from "state/store";
const { store, persistor } = configureStore();

import App from "./components/App";

const Unexpected = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

export default Unexpected;
