<script>
import { GET_HIBAH_BY_ID } from "@/services/store/amanah-pusaka.module";
import { mapGetters } from "vuex";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      isMounted: false,
    };
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    trustPart() {
      if (this.$route.name == "trust-inheritance.account") {
        return 1;
      } else if (["trust-inheritance.giver"].includes(this.$route.name)) {
        return 2;
      } else if (
        [
          "trust-inheritance.caretaker",
          "trust-inheritance.caretaker.create",
          "trust-inheritance.caretaker.update",
        ].includes(this.$route.name)
      ) {
        return 3;
      } else if (["trust-inheritance.period"].includes(this.$route.name)) {
        return 4;
      } else if (
        ["trust-inheritance.heirs", "trust-inheritance.heir.update"].includes(
          this.$route.name
        )
      ) {
        return 5;
      } else if (
        [
          "trust-inheritance.receiver",
          "trust-inheritance.receiver.update",
        ].includes(this.$route.name)
      ) {
        return 6;
      } else if (
        [
          "trust-inheritance.property",
          "trust-inheritance.property.moveable",
          "trust-inheritance.property.immoveable",
          "trust-inheritance.moveable-property.create",
          "trust-inheritance.moveable-property.receiver",
          "trust-inheritance.moveable-property.details",
          "trust-inheritance.moveable-property.attachment",
          "trust-inheritance.immoveable-property.create",
          "trust-inheritance.immoveable-property.receiver",
          "trust-inheritance.immoveable-property.details",
          "trust-inheritance.immoveable-property.attachment",
        ].includes(this.$route.name)
      ) {
        return 7;
      } else if (this.$route.name == "trust-inheritance.distribution") {
        return 8;
      } else if (this.$route.name == "trust-inheritance.part-i") {
        return 9;
      } else if (this.$route.name == "trust-inheritance.part-signpenerima") {
        return 10;
      } else if (this.$route.name == "trust-inheritance.part-draft") {
        return 0;
      } else {
        return 1;
      }
    },
    hibahId() {
      return this.$route.query.hibah_id ?? null;
    },
    ...mapGetters(["user", "hibah"]),
  },
  watch: {},
  async mounted() {
    if (this.$route.query.hibah_id) {
      await this.$store.dispatch(GET_HIBAH_BY_ID, this.$route.query.hibah_id);
    }
    this.isMounted = true;
  },
  methods: {
    onNavigate() {
      window.open(this.certUrl, "_blank");
    },
  },
};
</script>

<template>
  <div>
    <Navbar :nav-light="true" />

    <section class="bg-half bg-primary d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title text-white">
                <span>Hibah Korporat</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-12">
            <div class="sidebar sticky-bar p-4 rounded shadow bg-light">
              <div class="widget mb-4 pb-4 border-bottom">
                <router-link
                  :to="{
                    name: 'trust-inheritance.account',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100"
                  :class="trustPart >= 1 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian A
                  </span>
                  <span class="d-block">Akaun</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.giver',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 2 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian B
                  </span>
                  <span class="d-block">Pemberi</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.caretaker',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 3 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian C
                  </span>
                  <span class="d-block">Penjaga</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.period',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 4 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian D
                  </span>
                  <span class="d-block">Tempoh Amanah</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.heirs',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 5 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian E
                  </span>
                  <span class="d-block">Waris</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.receiver',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 6 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian F
                  </span>
                  <span class="d-block">Penerima</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.property.immoveable',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 7 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian G
                  </span>
                  <span class="d-block">Harta</span>
                </router-link>
                <router-link
                  tag="button"
                  :event="hibahId ? 'click' : ''"
                  :disabled="!hibahId"
                  :to="{
                    name: 'trust-inheritance.distribution',
                    query: {
                      hibah_id: hibahId,
                    },
                  }"
                  class="btn w-100 mt-1"
                  :class="trustPart >= 8 ? 'btn-primary' : 'btn-secondary'"
                >
                  <span
                    class="d-block"
                    style="font-weight: 100; font-size: 8pt"
                  >
                    Bahagian H
                  </span>
                  <span class="d-block">Pengagihan</span>
                </router-link>
              </div>
            </div>
          </div>

          <router-view v-if="isMounted"> </router-view>
        </div>
      </div>
    </section>

    <Footer />
    <a
      href="javascript: void(0);"
      class="btn btn-icon btn-soft-primary back-to-top"
      id="back-to-top"
      v-scroll-to="'#topnav'"
    >
      <arrow-up-icon class="icons"></arrow-up-icon>
    </a>
  </div>
</template>
