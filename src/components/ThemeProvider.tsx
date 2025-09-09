import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import * as React from 'react';

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider attribute="class" enableSystem defaultTheme="dark" {...props}>{children}</NextThemesProvider>;
};

const useTheme = () => {
  return useNextTheme();
};

export { ThemeProvider, useTheme };