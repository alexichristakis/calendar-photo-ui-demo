import { ReduxStateType } from "state";

export const selectFocused = ({ app: { focused } }: ReduxStateType) => focused;
