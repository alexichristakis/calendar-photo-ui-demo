import { Theme, defaultTheme } from "lib/themes";

export interface FocusedType {
  image: string;
  startX: number;
  startY: number;
}

export interface AppStateType {
  theme: Theme;
  focused: FocusedType;
}

const SET_THEME = "app/SET_THEME";
const SET_FOCUS = "app/SET_FOCUS";
const initialState: AppStateType = {
  theme: defaultTheme,
  focused: {
    image: "",
    startX: -1,
    startY: -1
  }
};

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
