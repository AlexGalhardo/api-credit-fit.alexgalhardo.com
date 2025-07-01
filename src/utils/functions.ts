export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

export function getErrorStack(error: unknown): string {
	if (error instanceof Error && error.stack) {
		return error.stack;
	}
	return getErrorMessage(error);
}
