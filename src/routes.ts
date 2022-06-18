/* eslint-disable import/no-mutable-exports */
const socketURL = `${process.env.REACT_APP_SOCKET_URL_PROD}`;

// You can test a route here: https://lucky-zed.xyz/test or https://lucky-zed.xyz/slug

const getSlugRoute = `${socketURL}/slug`;

export { getSlugRoute, socketURL };
