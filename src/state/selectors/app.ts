import { ReduxState } from "state";
import { Focused } from "state/app";

export const selectFocused = ({ app: { focused } }: ReduxState): Focused => focused;
