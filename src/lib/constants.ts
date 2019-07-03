import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BUFFER_WIDTH = 30;
const SETTINGS_WIDTH = 80;

const spring = { tension: 500, damping: 0.5 };
const NAVIGATOR_SNAP_POINTS = [
  { x: 0, ...spring },
  { x: -SETTINGS_WIDTH, ...spring },
  { x: -SETTINGS_WIDTH - (SCREEN_WIDTH - 2 * BUFFER_WIDTH), ...spring }
];

export { SCREEN_HEIGHT, SCREEN_WIDTH, NAVIGATOR_SNAP_POINTS, BUFFER_WIDTH, SETTINGS_WIDTH };
