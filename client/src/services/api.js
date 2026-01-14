import localAPI from './local';
import remoteAPI from './remote';

const useLocal = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true';

const api = useLocal ? localAPI : remoteAPI;

export default api;
