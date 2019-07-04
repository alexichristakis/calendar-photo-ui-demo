import { Theme, defaultTheme } from "lib/themes";

export interface FocusedType {
  image: string;
  visible: boolean;
  startX: number;
  startY: number;
}

export interface AppStateType {
  theme: Theme;
  focused: FocusedType;
}

const initialState: AppStateType = {
  theme: defaultTheme,
  focused: {
    image: "",
    visible: false,
    startX: -1,
    startY: -1
  }
};

const SET_THEME = "app/SET_THEME";
const SET_FOCUS = "app/SET_FOCUS";
const FOCUS_OFF = "app/FOCUS_OFF";
export default (state = initialState, action: any) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.theme
      };

    case SET_FOCUS:
      return {
        ...state,
        focused: action.focused
      };

    case FOCUS_OFF:
      return {
        ...state,
        focused: initialState.focused
      };

    default:
      return state;
  }
};

export const setTheme = (theme: Theme) => ({
  type: SET_THEME,
  theme
});

export const setFocus = (focused: FocusedType) => ({
  type: SET_FOCUS,
  focused
});

export const focusOff = () => ({
  type: FOCUS_OFF
});
