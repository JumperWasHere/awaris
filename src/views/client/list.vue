<script>
import ApiService from "@/services/api.service";
import { ArrowUpIcon } from "vue-feather-icons";
import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {
      form: {
        fullname: "",
      },
      testators: null,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
      },
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    searchQuery() {
      console.log(this.form);
      this.getClients();
    },
    // onSubmit() {
    //   this.$router.push({
    //     name: "client.list",
    //     query: {
    //       fullname: this.fullname,
    //     },
    //   });
    // },
    // query = `/wasiat?ic_number=${this.newIc}&old_ic_number=${this.oldIc}&name=${this.fullname}&branch_id=${this.userAccess.id}&load_with=userDetail,organization,agent&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`;

    getClients() {
      ApiService.get(
        `user?role=Client&with=wasiat&name=${this.form.fullname}&limit=${this.pagination.perPage}&page=${this.pagination.currentPage}`
      )
        .then((response) => {
          var temp_array = response.data.users.data ?? [];
          this.pagination.totalRows = response.data.users.total;

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
          this.testators = newobj;
        })
        .catch((error) => {});
    },
    pageClicks(page) {
      console.log("pageClicks");
      this.pagination.currentPage = page;
      this.getClients();
    },
    changePerPage() {
      console.log("changePerPage");
      this.pagination.currentPage = 1;
      this.getClients();
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    ArrowUpIcon,
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
              <h4 class="title text-white">Pelanggan Amanah Warisan Berhad</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div
          class="container card bg-light job-box rounded shadow border-0 overflow-hidden"
        >
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
                <!-- <form class="login-form" @submit.stop.prevent="onSubmit"> -->
                <!-- <div class="col-md-12"> -->
                <div class="form-group position-relative">
                  <!-- <label>Nama Penuh</label> -->
                  <input
                    type="text"
                    v-uppercase
                    class="form-control"
                    placeholder="Nama Penuh"
                    name
                    v-model="form.fullname"
                  />
                </div>
                <!-- </div> -->
                <div class="col-lg-12 text-right">
                  <div class="form-group">
                    <!-- <button class="btn btn-primary">Cari</button> -->
                    <b-button class="btn btn-primary" @click="searchQuery">{{
                      $t("search")
                    }}</b-button>
                  </div>
                </div>
                <!-- </form> -->
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div v-if="testators == null" class="text-center">
                  <h5 class="p-5">Loading...</h5>
                </div>
                <div class="table-responsive" v-if="testators">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>
                          <center>Bil</center>
                        </th>
                        <th>&nbsp;Nama Penuh</th>
                        <th>&nbsp;Kad Pengenalan</th>
                        <th>
                          <center>No. Wasiat</center>
                        </th>
                        <th>&nbsp;Peranan</th>
                        <th class="text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="testators.length == 0">
                        <td colspan="6" class="text-center">
                          <h5 class="p-5">Tiada rekod dijumpai</h5>
                        </td>
                      </tr>
                      <tr v-for="(testator, index) in testators" :key="index">
                        <td>
                          <center>{{ index }}</center>
                        </td>
                        <td>{{ testator.name }}</td>
                        <td>{{ testator.ic_number }}</td>
                        <td>
                          <center>
                            {{ testator.wasiat ? testator.wasiat.id : "-" }}
                          </center>
                        </td>
                        <td>Pelanggan</td>
                        <td class="text-right">
                          <router-link
                            :to="{
                              name: 'client.info',
                              params: { client_id: testator.id },
                            }"
                            class="btn btn-primary btn-sm"
                          >
                            <img
                              src="/images/icon/view.svg"
                              height="22px"
                              alt
                            />
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card-body">
                  <div class="row">
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
              </div>
            </div>
          </div>
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
