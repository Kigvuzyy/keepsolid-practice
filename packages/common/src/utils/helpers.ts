export const omit = <TObj extends object, TKeys extends keyof TObj>(
	obj: TObj,
	keys: TKeys[],
): Omit<TObj, TKeys> => {
	const entries = Object.entries(obj).filter(([key]) => !keys.includes(key as TKeys));
	return Object.fromEntries(entries) as Omit<TObj, TKeys>;
};

export const firstLetterUppercase = (str: string): string => {
	const valueString = str.toLowerCase();
	return valueString
		.split(" ")
		.map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
		.join(" ");
};

export const lowerCase = (str: string): string => {
	return str.toLowerCase();
};

export const toUpperCase = (str: string): string => {
	return str ? str.toUpperCase() : str;
};

export const isEmail = (email: string): boolean => {
	const regexExp =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
	return regexExp.test(email);
};
