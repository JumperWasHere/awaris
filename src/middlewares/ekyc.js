import store from "./../services/store";
import ApiService from "@/services/api.service";
import {
  FACE_VERIFICATION
} from "./../services/store/auth.module";
export default function ekyc({ next, router }) {
  if (store.getters.userRole == 'Client') {
    Promise.all([store.dispatch(FACE_VERIFICATION)]).then(response => {
      var faceVerification = response[0].face_verification;
      var user = response[0].user;
      if (user.face_verified == 1) {
        next;
      } else if (faceVerification == null) {
        router.push({ name: 'ekyc' })
      } else if (faceVerification.verification_score > 70) {
        next;
      } else {
        router.push({ name: 'ekyc' })
      }
    }).catch(error => {
      next;
    })
  } else {
    next;
  }

}