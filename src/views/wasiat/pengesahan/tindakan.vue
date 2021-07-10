<script>
import {
  ArrowUpIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MonitorIcon,
  HeartIcon,
  EyeIcon,
  BoldIcon,
  FeatherIcon,
  CodeIcon,
  UserCheckIcon,
  GitMergeIcon,
  SettingsIcon,
} from "vue-feather-icons";
import { Carousel, Slide } from "vue-carousel";

import Navbar from "@/components/navbar";
import Switcher from "@/components/switcher";
import Footer from "@/components/footer";

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    Switcher,
    Footer,
    Carousel,
    Slide,
    ArrowUpIcon,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    LinkedinIcon,
    MonitorIcon,
    HeartIcon,
    EyeIcon,
    BoldIcon,
    FeatherIcon,
    CodeIcon,
    UserCheckIcon,
    GitMergeIcon,
    SettingsIcon,
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
              <h4 class="title text-white">Pra-Pendaftaran Wasiat Asas</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div
              class="card bg-light border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-lg-12 col-md-3 text-md-left">
                    <h4 class="title text-left">
                      KETERANGAN MENGENAI RAKAN NIAGA
                    </h4>
                    <div class="row">
                      <div class="col-md-12">
                        <div
                          class="table-responsive bg-white shadow rounded mt-4"
                        >
                          <table class="table mb-0 table-center">
                            <tbody>
                              <tr>
                                <th class="bg-light" style="width: 20%">
                                  Kod Rakan Niaga
                                </th>
                                <td>2RK-AKC</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Rakan Niaga</th>
                                <td>AL KAHFI CONSULTANT</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Cawangan</th>
                                <td>ALKAHFI CAWANGAN SELANGOR</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Nama Pegawai</th>
                                <td>SARINI BINTI AB WAHAB</td>
                              </tr>
                              <tr>
                                <th class="bg-light">No. Telefon</th>
                                <td>60133780755</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12">
            <div
              class="card bg-light border-0 rounded shadow"
              style="z-index: 1"
            >
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-lg-12 col-md-3 text-md-left">
                    <h4 class="title text-left">
                      KETERANGAN MENGENAI PEWASIAT
                    </h4>
                    <div class="row">
                      <div class="col-md-12">
                        <div
                          class="table-responsive bg-white shadow rounded mt-4"
                        >
                          <table class="table mb-0 table-center">
                            <tbody>
                              <tr>
                                <th class="bg-light" style="width: 20%">
                                  Nama Penuh
                                </th>
                                <td colspan="3">JAMBARI BINTI TOKIJO</td>
                              </tr>
                              <tr>
                                <th class="bg-light" style="width: 20%">
                                  Kad Pengenalan Baru
                                </th>
                                <td>898989898989</td>
                                <th class="bg-light" style="width: 20%">
                                  Kad Pengenalan Lama / Polis / Tentera /
                                  Passport
                                </th>
                                <td>2666774</td>
                              </tr>
                              <tr>
                                <th class="bg-light">No. Telefon Bimbit</th>
                                <td>60189714204</td>
                                <th class="bg-light">No. Telefon Rumah</th>
                                <td>603-51669904</td>
                              </tr>
                              <tr>
                                <th class="bg-light">No. Rujukan Resit</th>
                                <td></td>
                                <th class="bg-light">No. Siri Kad Wasiat</th>
                                <td>2019/001725</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Email</th>
                                <td colspan="3">jambari@bmail.com</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Alamat</th>
                                <td colspan="3">BATU CAVES</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Poskod</th>
                                <td colspan="3">40400</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Bandar</th>
                                <td colspan="3">GOMBAK</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Negeri</th>
                                <td colspan="3">SELANGOR</td>
                              </tr>
                              <tr>
                                <th class="bg-light">Harga Wasiat</th>
                                <td colspan="3">RM500.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-lg-12 col-md-3 text-md-left">
            <div class="row">
              <div class="col-md-12">
                <div class="row align-items-end">
                  <div class="col-md-12 text-center mt-4 mt-sm-0">
                    <div class="mt-md-4 mt-3 mt-sm-0">
                      <router-link
                        to="/wasiat/pengesahan/organisasi"
                        class="btn btn-outline-primary mr-2"
                      >
                        <i class="mdi mdi-arrow-left"></i> Kembali
                      </router-link>
                      <router-link to="/" class="btn btn-primary mr-2">
                        <i class="mdi mdi-file-document"></i>Pengesahan
                        Pra-Pendaftaran
                      </router-link>
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
