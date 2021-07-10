import store from "./../services/store";
export default function redirectIfAuthenticated({ next, router }) {
  if (store.getters.isAuthenticated === true) {
    router.push({ name: 'dashboard' })
  } else {
    next();
  }
}