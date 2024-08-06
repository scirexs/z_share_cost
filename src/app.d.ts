// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type Primitive = boolean | number | string;
	type MapKey = string | number | symbol;
	type MapLike<K extends MapKey, V> = {[key in K]: V};
	type IdentHandler = { id: string, handler: (id: string) => void }
	type StyleParts = {
		size: EStyleSize,
		mergin: string,
		bgcolor: string,
		border: string,
		bdwidth: string,
		bdcolor: string,
		bdround: string,
		txtcolor: string,
		txtbold: string,
		txtitalic: string,
		others: string,
	};
	type StyleLayout = {
		direction: EStyleFlexDirection,
		flexibility: EStyleFlexibility,
		wrap: EStyleFlexWrap,
		mainpos: EStyleFlexAlignMainAxis,
		crosspos: EStyleFlexAlignCrossAxis,
		gap: string,
		others: string,
	};
	type StylePartsPartial = Partial<StyleParts>;
	type StyleLayoutPartial = Partial<StyleLayout>;
}

export {};
