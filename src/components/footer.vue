<script>
import { mapGetters } from "vuex";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
} from "vue-feather-icons";
export default {
  data() {
    return {};
  },
  components: {
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    MailIcon,
  },
  computed: {
    environment() {
      return process.env.VUE_APP_ENVI;
    },
    ...mapGetters(["userRole"]),
  },
};
</script>

<template>
  <div>
    <footer class="footer" style="background: #101527">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
            <div class="row">
              <div class="col-sm-12">
                <a href="#" class="logo-footer">
                  <img
                    src="/images/logo-awaris-white.png"
                    height="50"
                    alt
                    class="right"
                  />
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <p
                  class="footer-title"
                  style="text-align: right; font-weight: 700"
                >
                  GATEWAY FOR PRIVATE <br />
                  INSTITUTIONAL TRUSTEES
                </p>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-12 mb-0 mb-md-4 pb-0 pb-md-2"></div>

          <div class="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
            <h5 class="footer-title text-white">CONNECT WITH US</h5>
            <span class="footer-title text-white">PHONE</span>
            <p class="text-secondary">+603 6263 9990</p>
            <span class="footer-title text-white">{{ $t("address") }}</span>
            <p class="text-secondary">
              M2-12-03, 8trium, Menara 2<br />
              Jalan Cempaka SD 12/5<br />
              Bandar Sri Damansara<br />
              52200 Kuala Lumpur
            </p>
            <span class="footer-title text-white">{{ $t("email") }}</span>
            <p class="text-secondary">admin@awarisgroup.com</p>
            <ul class="list-unstyled social-icon social mb-0 mt-4">
              <li class="list-inline-item">
                <a href="javascript:void(0)" class="rounded">
                  <facebook-icon class="fea icon-sm fea-social"></facebook-icon>
                </a>
              </li>
              <li class="list-inline-item ml-1">
                <a href="javascript:void(0)" class="rounded">
                  <twitter-icon class="fea icon-sm fea-social"></twitter-icon>
                </a>
              </li>
              <li class="list-inline-item ml-1">
                <a href="javascript:void(0)" class="rounded">
                  <linkedin-icon class="fea icon-sm fea-social"></linkedin-icon>
                </a>
              </li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
            <h4 class="footer-title text-white">USEFUL LINKS</h4>
            <ul class="list-unstyled footer-list mt-4">
              <li>
                <a
                  href="https://awarisgroup.com/wp-content/uploads/2021/01/Terms-Conditions.pdf"
                  class="text-foot"
                  target="_blank"
                  >Terms and Conditions</a
                >
              </li>
              <li>
                <a
                  href="https://awarisgroup.com/wp-content/uploads/2021/02/AWARIS-PRIVACY-POLICY.pdf"
                  class="text-foot"
                  target="_blank"
                  >Privacy Policy</a
                >
              </li>
            </ul>
            <h4 class="footer-title text-white" style="margin-top: 30px">
              USER MANUAL
            </h4>
            <ul class="list-unstyled footer-list mt-4">
              <li
                v-if="
                  ['Staff', 'Super Admin', 'Admin', 'Agent'].includes(userRole)
                "
              >
                <a
                  href="/files/Manual_Pendaftaran_Wasiat_Asas_(V2).pdf"
                  class="text-foot"
                  target="_blank"
                  >Pendaftaran Wasiat Asas (Agent)</a
                >
              </li>
              <li
                v-if="
                  ['Staff', 'Super Admin', 'Admin', 'Agent'].includes(userRole)
                "
              >
                <a
                  href="/files/Independent_Flow_Manual_Customer.pdf"
                  class="text-foot"
                  target="_blank"
                  >Independent Flow (Customer)</a
                >
              </li>
              <li v-if="['Staff', 'Client'].includes(userRole)">
                <a
                  href="/files/Manual_Pindaan_Wasiat.pdf"
                  class="text-foot"
                  target="_blank"
                  >Pindaan Wasiat (Direct User)</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    <footer class="footer footer-bar">
      <div class="container text-center">
        <div class="row align-items-center">
          <div class="col-sm-12">
            <div class="text-sm-center">
              <p class="mb-0 footer-copyright">
                <strong>©2021 AWARIS. {{ $t("copyright") }}.</strong>
                {{ $t("poweredby") }} <strong>PROOFFICE.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
