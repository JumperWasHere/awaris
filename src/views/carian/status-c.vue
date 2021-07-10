<script>
import ApiService from "@/services/api.service";

export default {
  data() {
    return {
      user_id: null,
      agent_id: null,
      agentName: null,
      agentEmail: null,
      agentGender: null,
      agentMobile_phone: null,
      agentOffice_phone: null,
    };
  },
  components: {},
  mounted() {
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id;
      this.getAgentId();
    }
  },
  methods: {
    async getAgentId() {
      ApiService.get(`/wasiat?user_id=${this.user_id}`)
        .then((response) => {
          var data = response.data.wasiats.data;
          if (Array.isArray(data) && data.length) {
            this.agent_id = data[0].agent_id;
            this.getAgentDetails();
          } else {
            //user dont have wasiat
          }
        })
        .catch((error) => {});
    },
    async getAgentDetails() {
      ApiService.get(`/user/${this.agent_id}`)
        .then((response) => {
          var data = response.data.user;
          this.agentName = data.name;
          this.agentEmail = data.email;
          this.agentMobile_phone = data.mobile_number;
          this.agentOffice_phone = data.home_phone_number;
          this.agentGender = data.gender;
        })
        .catch((error) => {});
    },
  },
};
</script>

<template>
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <router-link :to="{ name: 'carian.semak' }" class="btn btn-primary"
          >Kembali</router-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <h5 class="text-center">MAKLUMAT EJEN PEWASIAT</h5>
            <form class="login-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Nama Penuh:</label>
                    <p>{{ this.agentName ? this.agentName : "-" }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Emel:</label>
                    <p>{{ this.agentEmail ? this.agentEmail : "-" }}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No. Telefon Bimbit:</label>
                    <p>
                      {{
                        this.agentMobile_phone ? this.agentMobile_phone : "-"
                      }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>No. Telefon Rumah/Pejabat:</label>
                    <p>
                      {{
                        this.agentOffice_phone ? this.agentMobile_phone : "-"
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Jantina:</label>
                    <p class="form-control-static" v-if="this.agentGender == 1">
                      {{ $t("male") }}
                    </p>
                    <p class="form-control-static" v-if="this.agentGender == 2">
                      {{ $t("female") }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
