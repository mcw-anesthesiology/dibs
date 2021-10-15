interface ImportMetaEnv extends Readonly<Record<string, string>> {
	readonly VITE_BASE_URL: string;
	readonly VITE_API_PATH: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
