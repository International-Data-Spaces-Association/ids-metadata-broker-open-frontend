export const mongodb_handlerURL = (window._env_ !== undefined && window._env_.REACT_APP_BROKER_URL)? window._env_.REACT_APP_BROKER_URL + '/users' : '';
export const elasticsearchURL = (window._env_ !== undefined && window._env_.REACT_APP_BROKER_URL)? window._env_.REACT_APP_BROKER_URL + '/es' : 'http://localhost:9200';
