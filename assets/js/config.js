// Configuration for frontend API base URL
// This attempts to choose a sensible default based on runtime environment.
// - If `window.API_BASE_URL` is set (by a CI/build step), it will be used.
// - If running on localhost, it defaults to local backend dev URL.
// - Otherwise it returns a production placeholder which MUST be replaced
//   with your real API URL (HTTPS) before deploying to GitHub Pages.
export const API_BASE_URL = (() => {
	if (typeof window !== 'undefined' && window.API_BASE_URL) {
		return window.API_BASE_URL;
	}

	if (typeof window !== 'undefined') {
		const host = window.location.hostname;
		if (host === 'localhost' || host === '127.0.0.1') {
			return 'http://localhost:8000/api';
		}
	}

	// Production placeholder (must be updated)
	return 'https://api.example.com/api';
})();
