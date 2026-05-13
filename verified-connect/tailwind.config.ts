import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-native-vectoricons/lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
};

export default config;