const LOADING_STATES = {
  join: "JOIN",
  create: "CREATE",
};

const LOADING_STATE_MESSAGES = {
  [LOADING_STATES.join]: "Hang tight, we're connecting you to your friend...",
  [LOADING_STATES.create]: "Hang on, we're creating a room...",
};

const ERROR_STATES = {
  join: "JOIN",
  create: "CREATE",
};

const ERROR_STATE_MESSAGES = {
  [ERROR_STATES.join]:
    "Oh shoot! We couldn't connect you to your friend. Please try again.",
  [ERROR_STATES.create]: "Dammit! We couldn't create a room. Please try again.",
};

export {
  LOADING_STATES,
  LOADING_STATE_MESSAGES,
  ERROR_STATES,
  ERROR_STATE_MESSAGES,
};
