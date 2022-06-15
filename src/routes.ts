/* eslint-disable import/no-mutable-exports */
let socketURL: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  socketURL = "https://localhost:9000";
} else {
  socketURL = "https://api.zed-sharing.com";
}

const getSlugRoute = `${socketURL}/slug`;

export { getSlugRoute, socketURL };
