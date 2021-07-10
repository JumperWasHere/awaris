<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "HibahPartA",
  data() {
    return {
      allowAddCaretaker: true,
      caretakers: null,
      form: {},
      allow_caretaker: true,
      submit: false,
      mykad: {
        front: null,
        frontUrl: null,
        back: null,
        backUrl: null,
      },
    };
  },
  async mounted() {
    this.getCaretakers();
  },
  methods: {
    submitForm() {},
    getCaretakers() {
      var hibah = this.$store.getters.hibah;
      ApiService.get(`hibah/${hibah.id}/caretaker`)
        .then((response) => {
          this.caretakers = response.data.caretakers.data ?? [];
        })
        .catch(() => {
          this.caretakers = [];
        });
    },
    removeCaretaker(caretakerId) {
      ApiService.post(`caretaker/${caretakerId}`, {
        _method: "DELETE",
      }).then((response) => {
        this.getCaretakers();
      });
    },
  },
  computed: {
    ...mapGetters(["hibah"]),
  },
};
</script>

<template v-if="hibah">
  <div class="col-lg-8 col-md-8 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
    <div class="row">
      <div class="col-lg-12 col-12 mb-4 pb-2">
        <div
          class="card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-bodyz">
            <h5 class="text-center mb-5 mt-4">
              {{ $t("amendment.guardian-info") }}
              <img
                content="Penerima Hibah Dibawah Umur / OKU"
                v-tippy
                height="20"
                class="mb-1"
                src="/images/icon/info-button.png"
              />
            </h5>
            <div class="text-right mr-2">
              <router-link
                v-if="hibah"
                :to="{
                  name: 'trust-inheritance.caretaker.create',
                  query: {
                    hibah_id: hibah.id,
                  },
                }"
                class="btn btn-primary btn-sm"
              >
                {{ $t("add") }}</router-link
              >
            </div>
            <div class="row mb-2">
              <div class="col-lg-12">
                <div class="table-responsive p-2 mt-3 mb-4">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>{{ $t("name") }}</th>
                        <th>{{ $t("mykad") }}</th>
                        <th>{{ $t("relationship") }}</th>
                        <th>{{ $t("mobile-no") }}</th>
                        <th>{{ $t("action") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(caretaker, index) in caretakers" :key="index">
                        <td>{{ caretaker.name }}</td>
                        <td>{{ caretaker.ic_number }}</td>
                        <td>{{ caretaker.relationship }}</td>
                        <td>{{ caretaker.mobile_number }}</td>
                        <td>
                          <div
                            class="btn-group-vertical"
                            role="group"
                            aria-label="Vertical button group"
                          >
                            <router-link
                              class="btn btn-secondary btn-sm"
                              :to="{
                                name: 'trust-inheritance.caretaker.update',
                                query: {
                                  hibah_id: hibah.id,
                                  caretaker_id: caretaker.id,
                                },
                              }"
                              >{{ $t("update") }}</router-link
                            >
                            <button
                              @click="removeCaretaker(caretaker.id)"
                              class="btn btn-danger btn-sm"
                            >
                              {{ $t("remove") }}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          caretakers &&
                          allow_caretaker &&
                          caretakers.length == 0
                        "
                      >
                        <td colspan="5" class="text-center">
                          <h6 class="mt-5 mb-5">{{ $t("no-data") }}</h6>
                        </td>
                      </tr>
                      <tr v-if="!allow_caretaker">
                        <td colspan="5" class="text-center">
                          <h6 class="mt-5 mb-5">
                            {{ $t("trust.no-guardian") }}
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-right">
            <div class="form-group">
              <div class="d-flex justify-content-between"></div>
              <router-link
                :to="{
                  name: 'trust-inheritance.period',
                  query: {
                    hibah_id: hibah.id,
                  },
                }"
                class="btn btn-primary"
              >
                {{ $t("save-next") }}
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="submit"
                ></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
