const ID_TOKEN_KEY = "id_token";
const ID_TOKEN_KEY_PUBLIC = "id_token_public";


export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};
export const getPublicToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY_PUBLIC);
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};
export const savePublicToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY_PUBLIC, token);
};

export const destroyToken = () => {
  window.localStorage.setItem(ID_TOKEN_KEY, null);
  window.localStorage.removeItem(ID_TOKEN_KEY);
};
export const destroyPublicToken = () => {
  window.localStorage.setItem(ID_TOKEN_KEY_PUBLIC, null);
  window.localStorage.removeItem(ID_TOKEN_KEY_PUBLIC);
};

export default { getToken, saveToken, destroyToken, getPublicToken, savePublicToken, destroyPublicToken };
