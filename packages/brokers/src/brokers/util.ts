export const getBackoffDelay = (attempt: number, base: number, max: number) => {
	const expDelay = base * 2 ** (attempt - 1);
	return Math.min(expDelay, max);
};
