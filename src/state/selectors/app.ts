import { ReduxState } from "state";

export const selectFocused = ({ app: { focused } }: ReduxState) => focused;
