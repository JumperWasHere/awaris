<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      amendment_id: null,
      users: null,
      amendment_status: null,
      form: {
        no_wasiat: "-",
        wasiat_type: null,
        niaga_name: null,
        wasiat_date: null,
        organization_id: null,
        wasiat_data_accept: null,
        branch_name: null,
        account_type: "-",
        amendment_date: null,
        amendment_count: null,
      },
      created_at: null,
      updateAmedment: {
        _method: "PATCH",
        incharged_by_id: null,
        status: 1,
      },
    };
  },
  validations() {
    if (this.userRole == "Staff") {
      return {
        updateAmedment: {
          incharged_by_id: {
            required,
          },
        },
      };
    }
  },
  components: {},
  computed: {
    ...mapGetters(["isAuthenticated", "userAccess", "userRole"]),
    wasiat_id() {
      return this.$route.params.wasiat_id;
    },
    pengesahan() {
      return this.$route.query.pengesahan;
    },
  },
  mounted() {
    this.getlistPindaan();
    if (this.wasiat_id) {
      this.wasiatGetAmendment();
      if (this.userRole == "Staff") {
        this.getUsers();
      }
    }
  },
  methods: {
    async getlistPindaan() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var data_array = response.data.amendments.data;
          if (Array.isArray(data_array) && data_array.length > 0) {
            console.log(data_array[0]);
            this.form.amendment_date = this.getConvertDate(
              data_array[0].created_at
            );
            this.form.amendment_count = data_array[0].count;
            this.amendment_id = data_array[0].id;
            // if (data_array[0].status == 0) {
            this.getWasiatDetails();
            // }
          }
        })
        .catch((error) => {
          console.log("error");
        });
    },

    async getWasiatDetails() {
      ApiService.get(`/wasiat?id=${this.wasiat_id}&load_with=branch`)
        .then((response) => {
          var data_obj = response.data.wasiats.data[0];
          // console.log(data_obj);
          this.form.wasiat_type = data_obj.wasiat_type;
          if (data_obj.wasiat_type && data_obj.wasiat_type == 1) {
            this.form.wasiat_type = "Wasiat Islam";
          } else {
            this.form.wasiat_type = "Wasiat Konvensional";
          }
          this.form.no_wasiat = data_obj.wasiat_no ?? "-";
          this.form.wasiat_date = this.getConvertDate(data_obj.created_at);
          // console.log(this.form.wasiat_date);
          this.form.wasiat_data_accept = this.getConvertDate(
            data_obj.updated_at
          );
          console.log("data_obj", data_obj);
          if (data_obj.branch.branch_name) {
            this.form.branch_name = data_obj.branch.branch_name;
          }
          if (data_obj.account_type) {
            this.account_type = data_obj.account_type;
          }
          if (data_obj.organization_id) {
            this.form.organization_id = data_obj.organization_id;
            this.getCodeOrg(data_obj.organization_id);
          }
          console.log(data_obj);
        })
        .catch((error) => {
          console.log("error");
        });
    },
    async getCodeOrg(organization_id) {
      ApiService.get(`/organization/${organization_id}/branch`)
        .then((response) => {
          console.log(response.data.organization);
          this.form.niaga_name = response.data.organization.name;
        })
        .catch((error) => {
          console.log("error - org");
        });
    },
    getConvertDate(tempDate) {
      var date = new Date(tempDate);
      var dateConvert =
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "/" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "/" +
        date.getFullYear();
      return dateConvert;
    },
    getUsers() {
      ApiService.get(`/organization/${this.userAccess.organization_id}/user`)
        .then((response) => {
          var filter_user = response.data.user_accesses.data.filter(
            (item) => item.role == "Staff"
          );
          this.users = filter_user ?? [];

          console.log("user", this.users);
        })
        .catch((error) => {
          // hello test here
        });
    },
    wasiatGetAmendment() {
      ApiService.get(`/wasiat/${this.wasiat_id}/amendment`)
        .then((response) => {
          var data_amendment = response.data.amendments.data;
          console.log(data_amendment);
          if (Array.isArray(data_amendment) && data_amendment.length > 0) {
            this.amendment_status = data_amendment[0].status;
            this.amendment_id = data_amendment[0].id;
            this.updateAmedment.incharged_by_id =
              data_amendment[0].incharged_by_id;
            this.getdoc(data_amendment[0].id);
          }
        })
        .catch((error) => {});
    },
    async updateAmedmentIncharged() {
      return await ApiService.post(
        `/amendment/${this.amendment_id}`,
        this.updateAmedment
      )
        .then((response) => {
          console.log(response.data);
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    async updateUserDetails() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal.fire({
          icon: "error",
          html: "Sila isi ruangan yang bertanda (*)",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
        return;
      }

      const vm = this;
      let updateAmendmentIncharged = await this.updateAmedmentIncharged();
      if (this.userRole == "Staff") {
        await this.updateAmedmentIncharged();
        if (updateAmendmentIncharged) {
          vm.$router.push({
            name: "pindaan.part_b",
            params: {
              wasiat_id: this.wasiat_id,
            },
            query: { pengesahan: this.pengesahan },
          });
        }
      }
    },
  },
  filters: {
    WasiatType: function (value) {
      if (!value) return "";
      value = value.toString();
      if (value == 1) {
        return "Wasiat Islam";
      } else {
        return "Wasiat Konvensional";
      }
      // return value.charAt(0).toUpperCase() + value.slice(1);
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
          <div class="card-body">
            <h5 class="text-center" style="text-transform: uppercase">
              {{ $t("wasiatasas.will-desc") }}
            </h5>
            <form class="login-form">
              <div class="row d-flex justify-content-center">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>{{ $t("amendment.no-wasiat") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      class="form-control"
                      v-model="form.no_wasiat"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">{{ $t("wasiatasas.type") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      class="form-control"
                      v-model="form.wasiat_type"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row d-flex justify-content-center">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>{{ $t("business-partner") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      class="form-control"
                      v-model="form.niaga_name"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>{{ $t("org.nav2") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      v-model="form.branch_name"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row d-flex justify-content-center">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">{{ $t("amendment.date-wasiat") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      class="form-control"
                      v-model="form.amendment_date"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">{{ $t("amendment.no-amendment") }}</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      class="form-control"
                      v-model="form.amendment_count"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row" v-if="userRole == 'Staff'">
                <div class="col-md-6">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': $v.updateAmedment.incharged_by_id.$error,
                    }"
                  >
                    <label for="staff">{{ $t("amendment.officer") }}</label>
                    <span class="text-danger">*</span>

                    <select
                      name
                      id="staff"
                      class="form-control"
                      v-model.trim="$v.updateAmedment.incharged_by_id.$model"
                    >
                      <option value>-- Sila Pilih Pegawai --</option>
                      <option
                        :value="user.user.id"
                        v-for="user in users"
                        :key="user.id"
                      >
                        {{ user.user.name }}
                      </option>
                    </select>
                    <div
                      class="form-error"
                      v-if="
                        $v.updateAmedment.incharged_by_id.$error &&
                        !$v.updateAmedment.incharged_by_id.required
                      "
                    >
                      Pegawai Pindaan tidak boleh dibiarkan kosong.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <b-button
                v-if="[0, 1].includes(amendment_status) && userRole == 'Staff'"
                class="btn btn-primary"
                @click="updateUserDetails"
              >
                {{ $t("save-next") }}
              </b-button>
              <router-link
                v-if="[0].includes(amendment_status) && userRole == 'Client'"
                :to="{
                  name: 'pindaan.part_b',
                  params: {
                    wasiat_id: this.wasiat_id,
                  },
                  query: { pengesahan: pengesahan },
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
