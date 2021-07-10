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
  mounted() {
    if (!this.trustId) {
      this.$router.push({
        name: "trust-onecent.part-a",
      });
    }
    this.getCaretakers();
  },
  methods: {
    submitForm() {},
    getCaretakers() {
      ApiService.get(`hibah/${this.trustId}/caretaker`)
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
    ...mapGetters(["trust", "preference", "amendment"]),

    trustId() {
      return this.$route.query.trust_id;
    },
    AddCaretaker() {
      if (this.trust && this.preference) {
        return this.caretakers;
      }
    },
    amendmentId() {
      return this.$route.query.amendment_id;
    },
    caretakerBtnStatus() {
      if (this.allowAddCaretaker && this.allow_caretaker) {
        if (
          this.amendmentId &&
          this.amendment &&
          ![0, 1].includes(this.amendment.status)
        ) {
          return false;
        } else if (
          this.trust &&
          ![0, 1].includes(this.trust.status) &&
          !this.amendmentId
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
  },
  watch: {
    AddCaretaker: {
      handler: function () {
        if (this.preference.allow_caretaker) {
          this.allow_caretaker = true;
          if (this.trust && ["1", "2"].includes(this.trust.hibah_type)) {
            if (
              this.preference &&
              this.preference.hibah_single_caretaker == 1
            ) {
              if (this.caretakers && this.caretakers.length >= 1) {
                this.allowAddCaretaker = false;
                console.log(this.allowAddCaretaker);
              } else {
                this.allowAddCaretaker = true;
              }
            }
          } else {
            this.allowAddCaretaker = true;
          }
        } else {
          console.log("aloow caretaker", this.preference);
          this.allow_caretaker = false;
        }
      },
    },
    trust: {
      handler: function (val) {
        if (val) {
          this.hibah = val;
          if (val.status == -1) {
            this.$router.push({
              name: "trust-onecent.part-c",
              query: {
                trust_id: this.trustId,
                amendment_id: this.amendmentId,
              },
            });
          }
        }
      },
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
                v-if="caretakerBtnStatus"
                :to="{
                  name: 'trust-onecent.caretaker.create',
                  query: { trust_id: this.trustId, amendment_id: amendmentId },
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
                            v-if="caretakerBtnStatus"
                            class="btn-group-vertical"
                            role="group"
                            aria-label="Vertical button group"
                          >
                            <router-link
                              class="btn btn-secondary btn-sm"
                              :to="{
                                name: 'trust-onecent.caretaker.update',
                                query: {
                                  trust_id: trustId,
                                  caretaker_id: caretaker.id,
                                  amendment_id: amendmentId,
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
                  name: 'trust-onecent.part-h',
                  query: { trust_id: trustId, amendment_id: amendmentId },
                }"
                class="btn btn-primary"
              >
                {{ $t("next") }}
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
