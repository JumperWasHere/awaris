<script>
/**
 * Page-aboutus component
 */
export default {
  data() {
    return {};
  },
  components: {},
  computed: {
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    property_id() {
      return this.$route.query.property_id;
    },
    amendment_path() {
      if (this.$route.name == "pindaan.form-pindaan-harta-alih") {
        return 1;
      } else if (this.$route.name == "pindaan.receiver-harta-alih") {
        return 2;
      } else if (this.$route.name == "pindaan.form-pindaan-dokumen-alih") {
        return 3;
      }
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-bodyz">
            <div class="">
              <ul class="nav nav-tabs mt-4">
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    :class="amendment_path == 1 ? 'active' : ''"
                    :to="{
                      name: 'pindaan.form-pindaan-harta-alih',
                      params: {
                        wasiat_id: this.wasiat_id,
                      },
                      query: {
                        property_id: this.property_id,
                        pengesahan: pengesahan,
                      },
                    }"
                    >{{ $t("amendment.ownership1") }}
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    :class="amendment_path == 2 ? 'active' : ''"
                    :to="{
                      name: 'pindaan.receiver-harta-alih',
                      params: {
                        wasiat_id: this.wasiat_id,
                      },
                      query: {
                        property_id: this.property_id,
                        pengesahan: pengesahan,
                      },
                    }"
                    >{{ $t("amendment.add-receiver") }}</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    :class="amendment_path == 3 ? 'active' : ''"
                    :to="{
                      name: 'pindaan.form-pindaan-dokumen-alih',
                      params: {
                        wasiat_id: this.wasiat_id,
                      },
                      query: {
                        property_id: this.property_id,
                        pengesahan: pengesahan,
                      },
                    }"
                    >{{ $t("document") }}</router-link
                  >
                </li>
              </ul>

              <div class="col-12">
                <router-view> </router-view>
              </div>
              <!-- <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
