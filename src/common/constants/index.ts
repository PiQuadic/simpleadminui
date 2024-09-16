
const url = import.meta.env?.[`VITE_${import.meta.env.MODE?.toUpperCase()}_API_URL`] || 'http://localhost';
//const url = 'http://localhost';
const port = null; //import.meta.env?.[`VITE_${import.meta.env.MODE?.toUpperCase()}_API_PORT`] || null;
const version = 'v1';

// api calls are re-rerouted to localhost:3000/api/ with nginx reverse proxy
export const apiUrl = port === null ? `${url}/api/${version}` : `${url}:${port}/api/${version}`;
const defaultOn = "on"
const defaultOff = "off"

export default { apiUrl, defaultOff, defaultOn };
