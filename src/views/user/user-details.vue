
<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      testators: null,
      profile_picture: null,
      user_accesses: [],
    };
  },
  mounted() {
    console.log("Currentuser", this.currentUser);
    this.getOrganizationTestators();
    this.getProfilePicture();
    this.getUserAccessDetails();
  },
  methods: {
    getOrganizationTestators() {
      var org = 1;
      ApiService.get(`organization/${org}/testator`)
        .then((response) => {
          this.testators = response.data.testators.data;
        })
        .catch((error) => {});
    },

    getProfilePicture() {
      ApiService.get(
        `user/${this.currentUser.id}/profile-picture?stream=false`
      ).then((response) => {
        this.profile_picture = response.data.profile_picture
          ? response.data.profile_picture.public_path
          : "/images/logo-awaris.png";
      });
    },

    getUserAccessDetails() {
      ApiService.get(`user/${this.currentUser.id}/access`).then((response) => {
        var user_accesses = response.data.user_accesses.data[0];
        if (user_accesses) {
          this.user_accesses = user_accesses;
          console.log("user_accesses", this.user_accesses.organization.name);
        }
      });
    },
  },
  components: {
    Navbar,
    Footer,
    ArrowUpIcon,
  },
  computed: {
    ...mapGetters(["currentUser", "userRole", "userAccess"]),

    userId() {
      return this.$route.params.user_id;
    },

    fullAddress() {
      return String(
        this.currentUser.address ? this.currentUser.address.concat(", ") : ""
      )
        .concat(
          String(
            this.currentUser.postcode
              ? this.currentUser.postcode.concat(", ")
              : ""
          )
        )
        .concat(
          String(
            this.currentUser.city ? this.currentUser.city.concat(", ") : ""
          )
        )
        .concat(
          String(
            this.currentUser.state ? this.currentUser.state.concat(". ") : ""
          )
        );
    },
  },
  watch: {
    organizationType: [
      {
        handler: "setRoles",
      },
    ],
  },
  props: {
    organization: {
      type: Object,
    },
  },
};
</script>
<template>
  <div>
    <div class="row">
      <div class="col-md-6 form-group" v-if="userRole != 'Client'">
        <label>{{ $t("organization") }}</label>
        <p class="form-control-static">
          <span v-if="user_accesses && user_accesses.organization">
            {{ user_accesses.organization.name }}
            <span v-if="!user_accesses.organization.name"> - </span>
          </span>
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("email") }}</label>
        <p class="form-control-static">
          {{ currentUser.email ? currentUser.email : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("gender") }}</label>
        <p class="form-control-static" v-if="currentUser.gender == 1">
          {{ $t("male") }}
        </p>
        <p class="form-control-static" v-if="currentUser.gender == 2">
          {{ $t("female") }}
        </p>
        <p class="form-control-static" v-if="!currentUser.gender">-</p>
      </div>
      <div class="col-md-6 form-group" v-if="userRole == 'Staff'">
        <label>{{ $t("staff-no") }}</label>
        <p class="form-control-static">
          {{ currentUser.staff_number ? currentUser.staff_number : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("mykad") }}</label>
        <p class="form-control-static">
          {{ currentUser.ic_number ? currentUser.ic_number : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("mobile-no") }}</label>
        <p class="form-control-static">
          {{ currentUser.mobile_number ? currentUser.mobile_number : "-" }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("office-no") }}</label>
        <p class="form-control-static">
          {{
            currentUser.office_phone_number
              ? currentUser.office_phone_number
              : "-"
          }}
        </p>
      </div>
      <div class="col-md-6 form-group">
        <label>{{ $t("address") }}</label>
        <p class="form-control-static">
          {{ fullAddress ? fullAddress : "-" }}
        </p>
      </div>
    </div>
  </div>
</template>

