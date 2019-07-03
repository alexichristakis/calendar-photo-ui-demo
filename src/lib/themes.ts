import { Colors } from "./styles";

interface Theme {
  primary: string;
  secondary: string;
  tertiary: string;
}

const defaultTheme: Theme = {
  primary: Colors.blue,
  secondary: Colors.nearWhite,
  tertiary: Colors.gray
};

export default { defaultTheme };

export { Theme, defaultTheme };
