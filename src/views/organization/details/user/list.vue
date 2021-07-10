<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      user_accesses: null,
      searchName: "",
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  props: {
    organization: {
      type: Object,
    },
    userRole: {
      type: String,
    },
  },
  mounted() {
    this.getOrganizationUsers();
  },
  methods: {
    searchByName() {
      this.pagination.currentPage = 1;
      this.getOrganizationUsers();
    },
    getOrganizationUsers() {
      var query;
      if (this.status) {
        query = `organization/${this.organizationId}/user?&status=${this.status}&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}&name=${this.searchName}`;
      } else {
        query = `organization/${this.organizationId}/user?&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}&name=${this.searchName}`;
      }
      ApiService.get(query).then((response) => {
        console.log(response.data.user_accesses.data);
        // this.user_accesses = response.data.user_accesses.data ?? [];
        var temp_array = response.data.user_accesses.data ?? [];

        this.pagination.totalRows = response.data.user_accesses.total;
        var newobj = {};
        var count;
        if (this.pagination.currentPage == 1) {
          count = this.pagination.currentPage;
        } else {
          count =
            this.pagination.currentPage * this.pagination.perPage -
            this.pagination.perPage +
            1;
        }
        console.log("count", count);
        for (const index in temp_array) {
          newobj[count] = Object.assign({}, temp_array[index]);
          count++;
        }
        this.user_accesses = newobj;
      });
    },
    pageClicks(page) {
      console.log("pageClicks");
      this.pagination.currentPage = page;
      this.getOrganizationUsers();
    },
    changePerPage() {
      console.log("changePerPage");
      this.pagination.currentPage = 1;
      this.getOrganizationUsers();
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userAccess"]),
    organizationType() {
      return this.organization.type;
    },
    organizationId() {
      return this.$route.params.organization_id;
    },
    userId() {
      return this.$route.params.user_id;
    },
    status() {
      return this.$route.query.status;
    },
    btnOrgFilter() {
      if (["Staff", "IT"].includes(this.userRole)) {
        return true;
      } else if (
        this.userRole == "Super Admin" &&
        this.userAccess.organization_id != 11
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="text-center p-5" v-if="user_accesses == null">
      <h5>{{ $t("no-records") }}</h5>
    </div>
    <div class="form-group">
      <label for="name">Search by name</label>
      <div class="input-group mb-3">
        <input
          type="text"
          name="name"
          id="name"
          class="form-control"
          v-model="searchName"
        />
        <div class="input-group-append">
          <button @click="searchByName" class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="user_accesses">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t("index") }}</th>
            <th>{{ $t("fullname") }}</th>
            <th>{{ $t("username") }}</th>
            <th v-if="organizationType == 'Awaris'">{{ $t("position") }}</th>
            <th v-if="organizationType != 'Awaris'">{{ $t("user-role") }}</th>
            <th>{{ $t("org.nav2") }}</th>
            <th>{{ $t("status") }}</th>
            <th>{{ $t("action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="user_accesses.length == 0">
            <td class="text-center" colspan="7">
              <h5 class="m-5">{{ $t("user.no-users") }}</h5>
            </td>
          </tr>
          <tr v-for="(access, index) in user_accesses" :key="index">
            <td>{{ index }}</td>
            <td>{{ access.user.name }}</td>
            <td>{{ access.user.username }}</td>
            <td>{{ access.role }}</td>
            <td>
              {{ access.accessible ? access.accessible.branch_name : " -" }}
            </td>
            <td>
              <span class="badge badge-warning" v-if="access.status == 0">{{
                $t("org.wait-confirmation")
              }}</span>
              <span class="badge badge-success" v-if="access.status == 1">{{
                $t("active")
              }}</span>
              <span class="badge badge-warning" v-if="access.status == 2">{{
                $t("inactive")
              }}</span>
            </td>
            <td>
              <router-link
                :to="{
                  name: 'organization.user.info',
                  params: {
                    organization_id: organizationId,
                    user_id: access.user.id,
                  },
                }"
                class="btn btn-primary"
              >
                <img src="/images/icon/view.svg" height="22px" alt />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr />
    <div class="text-center mt-4">
      <router-link
        v-if="this.btnOrgFilter"
        :to="{ name: 'organization.user.create' }"
        class="btn btn-primary"
        >{{ $t("org.add-user") }}</router-link
      >
    </div>
    <div class="row mt-4">
      <div class="col-md-8">
        <b-pagination
          v-model="pagination.currentPage"
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
          @change="pageClicks"
          aria-controls="my-table"
        ></b-pagination>
      </div>
      <div class="col-md-4">
        <div class="form custom-form">
          <div class="form-group mb-0">
            <select
              v-model="pagination.perPage"
              class="form-control custom-select"
              id="Sortbylist-job"
              @change="changePerPage()"
            >
              <option value="10">10 {{ $t("per-page") }}</option>
              <option value="25">25 {{ $t("per-page") }}</option>
              <option value="50">50 {{ $t("per-page") }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
