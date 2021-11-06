import {
	Raleway_300Light,
	Raleway_400Regular,
	Raleway_400Regular_Italic,
	Raleway_700Bold,
	Raleway_700Bold_Italic,
} from '@expo-google-fonts/raleway';

export { useFonts } from 'expo-font';

export const useFontsArg = {
	Raleway_300Light,
	Raleway_400Regular,
	Raleway_400Regular_Italic,
	Raleway_700Bold,
	Raleway_700Bold_Italic,
};

type PropsToString<Obj> = {
	[K in keyof Obj]: string;
};

export const fonts = ({ ...useFontsArg } as unknown) as PropsToString<typeof useFontsArg>;
Object.keys(fonts).forEach((e: any) => ((fonts as any)[e] = e));
