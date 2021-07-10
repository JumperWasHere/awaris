<script>
import ApiService from "@/services/api.service";
import { TheMask } from "vue-the-mask";
import { tippy } from "vue-tippy";

export default {
  name: "HibahPartA",
  data() {
    return {
      form: {},
      submit: false,
    };
  },
  mounted() {},
  methods: {
    submitForm() {},
  },
  computed: {
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    trustId() {
      return this.$route.query.trust_id;
    },
    properyId() {
      return this.$route.query.property_id;
    },
    routeName() {
      return this.$route.name;
    },
    message() {
      return this.$route.query.message;
    },
  },
  components: { TheMask },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-md-12" v-if="message == 'saved'">
        <div class="alert alert-success">Harta alih telah berjaya disimpan</div>
      </div>
      <div class="col-md-12">
        <router-link
          class="d-flex align-items-center"
          :to="{
            name: 'trust.part-f.moveable',
            query: { trust_id: this.trustId, amendment_id: amendmentId },
          }"
        >
          <img src="/images/icon/left-arrow.png" height="20" alt="" />
          <p
            class="m-0"
            style="padding-left: 10px; padding-top: 2px; display: inline-block"
          >
            Kembali ke Senarai Harta
          </p>
        </router-link>
      </div>
      <div class="col-lg-12 col-12 mb-4 pb-2 mt-3">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-bodyz">
            <h5 class="text-center mb-0 mt-4">
              Maklumat Harta
              <img
                content="Senarai penerima yang akan diagihkan dalam aset"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>

            <ul class="nav nav-tabs mt-4">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :class="
                    routeName == 'trust.moveable-property.details'
                      ? 'active'
                      : ''
                  "
                  :to="{
                    name: 'trust.moveable-property.details',
                    query: {
                      trust_id: trustId,
                      property_id: properyId,
                      amendment_id: amendmentId,
                    },
                  }"
                >
                  Maklumat Harta
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :class="
                    routeName == 'trust.moveable-property.receiver'
                      ? 'active'
                      : ''
                  "
                  :to="{
                    name: 'trust.moveable-property.receiver',
                    query: {
                      trust_id: trustId,
                      property_id: properyId,
                      amendment_id: amendmentId,
                    },
                  }"
                >
                  Penerima Harta
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :class="
                    routeName == 'trust.moveable-property.attachment'
                      ? 'active'
                      : ''
                  "
                  :to="{
                    name: 'trust.moveable-property.attachment',
                    query: {
                      trust_id: trustId,
                      property_id: properyId,
                      amendment_id: amendmentId,
                    },
                  }"
                >
                  Dokumen/Lampiran
                </router-link>
              </li>
            </ul>
            <router-view> </router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
