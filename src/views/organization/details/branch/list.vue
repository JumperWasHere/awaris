<script>
import ApiService from "@/services/api.service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      branches: null,
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
    this.getBranches();
  },
  methods: {
    getBranches() {
      var query = `organization/${this.organizationId}/branch?&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;

      ApiService.get(query)
        .then((response) => {
          console.log(response.data.branches);
          var temp_array = response.data.branches.data;
          this.pagination.totalRows = response.data.branches.total;

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
          this.branches = newobj;
        })
        .catch((error) => {
          console.log("error fetch data from branch");
        });
    },
    pageClicks(page) {
      this.pagination.currentPage = page;
      this.getBranches();
    },
    changePerPage() {
      this.pagination.currentPage = 1;
      this.getBranches();
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organization_id;
    },
    branchId() {
      return this.$route.params.branch_id;
    },
    ...mapGetters(["isAuthenticated", "userAccess"]),
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
    <div class="text-center p-5" v-if="branches == null">
      <h5>{{ $t("org.no-branches") }}</h5>
    </div>
    <div class="table-responsive" v-if="branches">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t("index") }}</th>
            <th>{{ $t("org.branch-name") }}</th>
            <th>{{ $t("org.branch-code") }}</th>
            <th>{{ $t("state") }}</th>
            <th>{{ $t("phase") }}</th>
            <th>{{ $t("status") }}</th>
            <th>{{ $t("action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="branches.length == 0">
            <td class="text-center" colspan="7">
              <h5 class="m-5">{{ $t("org.no-branches") }}</h5>
            </td>
          </tr>
          <tr v-for="(branch, index) in branches" :key="index">
            <td>{{ index }}</td>
            <td>{{ branch.branch_name }}</td>
            <td>{{ branch.code ? branch.code : "-" }}</td>
            <td>{{ branch.state }}</td>
            <td>{{ branch.phase }}</td>
            <td>
              <span class="badge badge-success" v-if="branch.status == 1">{{
                $t("active")
              }}</span>
              <span class="badge badge-warning" v-if="branch.status != 1">{{
                $t("inactive")
              }}</span>
            </td>
            <td>
              <router-link
                :to="{
                  name: 'organization.branch.info',
                  params: {
                    organization_id: organizationId,
                    branch_id: branch.id,
                  },
                }"
                class="btn btn-primary btn-sm"
              >
                <img src="/images/icon/view.svg" height="22px" alt />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr />
    <div class="text-center mb-5">
      <router-link
        v-if="this.btnOrgFilter"
        :to="{ name: 'organization.branch.create' }"
        class="btn btn-primary"
        >{{ $t("org.add-branch") }}</router-link
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