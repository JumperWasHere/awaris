<script>
/**
 * Page-aboutus component
 */
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      amendment_status: null,
    };
  },
  components: {},
  computed: {
    harta() {
      if (this.$route.name == "pindaan.part_d-tidakalih") {
        return 1;
      } else if (this.$route.name == "pindaan.part_d-alih") {
        return 2;
      }
    },

    wasiat_id() {
      return this.$route.params.wasiat_id;
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
              <h5 class="text-center mb-4 mt-4">KETERANGAN MENGENAI HARTA</h5>
              <ul class="nav nav-tabs mt-2">
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    :class="harta == 1 ? 'active' : ''"
                    :to="{
                      name: 'pindaan.part_d-tidakalih',
                      params: {
                        wasiat_id: this.wasiat_id,
                      },
                      query: {
                        pengesahan: this.pengesahan,
                      },
                    }"
                    >Harta Tidak Alih</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    :class="harta == 2 ? 'active' : ''"
                    :to="{
                      name: 'pindaan.part_d-alih',
                      params: {
                        wasiat_id: this.wasiat_id,
                      },
                      query: {
                        pengesahan: this.pengesahan,
                      },
                    }"
                    >Harta Alih</router-link
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
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <router-link
                v-if="[0, 1, 4].includes(amendment_status)"
                :to="{
                  name: 'pindaan.part_e',
                  params: { wasiat_id: this.wasiat_id },
                  query: {
                    pengesahan: pengesahan,
                  },
                }"
                class="btn btn-primary"
                >{{ $t("save-next") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
