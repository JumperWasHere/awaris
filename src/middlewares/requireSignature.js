import store from "./../services/store";
import {
  VERIFY_AUTH
} from "./../services/store/auth.module";
export default function log({ next, router }) {

  if (store.getters.signature == null) {
    Promise.all([store.dispatch(VERIFY_AUTH)]).then((response) => {
      var user = response[0].user;
      if (store.getters.userRole == 'Client') {
        next;
      } else if (user.signature == null) {
        router.push({ name: 'signature' })
      } else {
        next;
      }
    })

  } else {
    next();
  }
}