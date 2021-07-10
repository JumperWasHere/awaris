import Vue from 'vue'
import VueRouter from 'vue-router'
import log from './../middlewares/log';
import ekyc from './../middlewares/ekyc';
import requireSignature from './../middlewares/requireSignature';
import redirectIfAuthenticated from './../middlewares/redirectIfAuthenticated';
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/dashboard/agent',
  component: () => import("@/views/layout/layout"),
  children: [{
    path: '/',
    name: 'Home',
    component: () => import('../views/index')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/login'),
    meta: {
      middleware: [redirectIfAuthenticated]
    }
  },
  {
    path: '/password-create',
    name: 'password-create',
    component: () => import('../views/auth/password-create'),
    meta: {
      middleware: [redirectIfAuthenticated]
    }
  },
  {
    path: '/password/reset',
    name: 'password-reset',
    component: () => import('../views/auth/password-reset'),
    meta: {
      middleware: [redirectIfAuthenticated]
    }
  },
  {
    path: '/dashboard/agent',
    name: 'dashboard.agent',
    component: () => import('../views/dashboard/agent'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/report',
    name: 'dashboard.report',
    component: () => import('../views/wasiat/report/report-list'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/graph-report',
    name: 'dashboard.graph',
    component: () => import('../views/wasiat/report/wasiatGraphReport'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/report-yearly',
    name: 'dashboard.report-yearly',
    component: () => import('../views/wasiat/report/yearly'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/detailed-yearly-report',
    name: 'dashboard.detailed-yearly-report',
    component: () => import('../views/wasiat/report/detailed-yearly'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/report-monthly',
    name: 'dashboard.report-monthly',
    component: () => import('../views/wasiat/report/monthly'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/detailed-monthly-report',
    name: 'dashboard.detailed-monthly-report',
    component: () => import('../views/wasiat/report/detailed-monthly'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/approved-monthly-report',
    name: 'dashboard.approved-monthly-report',
    component: () => import('../views/wasiat/report/approved-monthly'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/loan-bmmb',
    name: 'dashboard.loan-bmmb',
    component: () => import('../views/wasiat/report/loan-bmmb'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/report-daily',
    name: 'dashboard.report-daily',
    component: () => import('../views/wasiat/report/daily'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/report-soa',
    name: 'dashboard.report-soa',
    component: () => import('../views/wasiat/report/soa'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard/dashboard'),
    meta: {
      requiresAuth: true,
      middleware: [log, requireSignature],
    }
  },
  {
    path: '/wasiat/MohonPindaan',
    name: 'pindaan',
    component: () => import('../views/pindaan/mohon-pindaan'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/:wasiat_id/pindaanPayVerified',
    name: 'pindaan.Pay-Verified',
    component: () => import('../views/pindaan/pg-redirect'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/pindaan/pindaan',
    name: 'pindaan.part',
    component: () => import('../views/pindaan/sidebar-pindaan'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/wasiat/:wasiat_id/pindaan-a',
      name: 'pindaan.part_a',
      component: () => import('../views/pindaan/pindaan-a')
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-b',
      name: 'pindaan.part_b',
      component: () => import('../views/pindaan/pindaan-b')
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-c',
      name: 'pindaan.part_c',
      component: () => import('../views/pindaan/pindaan-c')
    },

    {
      path: '/wasiat/:wasiat_id/pindaan-d',
      name: 'pindaan.part_d',
      component: () => import('../views/pindaan/pindaan-d-hartanav'),
      children: [{
        path: '/wasiat/:wasiat_id/pindaan-d-hartaTakAlih',
        name: 'pindaan.part_d-tidakalih',
        component: () => import('../views/pindaan/pindaan-d-harta_tidakalih'),
      },
      {
        path: '/wasiat/:wasiat_id/pindaan-d-hartaalih',
        name: 'pindaan.part_d-alih',
        component: () => import('../views/pindaan/pindaan-d-harta_alih'),
      },
      ]
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-e',
      name: 'pindaan.part_e',
      component: () => import('../views/pindaan/pindaan-e')
    },
    {
      path: '/wasiat/:wasiat_id/tab-pindaan-harta-tidakalih',
      name: 'pindaan.pindaan-harta-tidak-alih',
      component: () => import('../views/pindaan/pindaanHarta/tabbar-harta-tidakalih'),
      children: [{
        path: '/wasiat/:wasiat_id/pindaan-harta-tidakalih',
        name: 'pindaan.form-pindaan-harta-tidak-alih',
        component: () => import('../views/pindaan/pindaanHarta/form-pindaan-harta_tidakalih')
      },
      {
        path: '/wasiat/:wasiat_id/pindaan-dokumen-tidakalih',
        name: 'pindaan.form-pindaan-dokumen-tidak-alih',
        component: () => import('../views/pindaan/pindaanHarta/doc-pindaan-harta_tidakalih')
      },
      {
        path: '/wasiat/:wasiat_id/receiver-harta',
        name: 'pindaan.receiver-harta-tidak-alih',
        component: () => import('../views/pindaan/pindaanHarta/receiver-harta-tidak-alih')
      }
      ]
    },
    {
      path: '/wasiat/tab-pindaan-harta-alih',
      name: 'pindaan.form-harta-alih',
      component: () => import('../views/pindaan/pindaanHarta/tabbar-harta-alih'),
      children: [{
        path: '/wasiat/:wasiat_id/pindaan-harta-alih',
        name: 'pindaan.form-pindaan-harta-alih',
        component: () => import('../views/pindaan/pindaanHarta/form-pindaan-harta_alih'),
      }, {
        path: '/wasiat/:wasiat_id/pindaan-dokumen-alih',
        name: 'pindaan.form-pindaan-dokumen-alih',
        component: () => import('../views/pindaan/pindaanHarta/doc-pindaan-harta_alih')
      },
      {
        path: '/wasiat/:wasiat_id/receiver-hartaAlih',
        name: 'pindaan.receiver-harta-alih',
        component: () => import('../views/pindaan/pindaanHarta/receiver-harta-alih')
      }]
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-f',
      name: 'pindaan.part_f',
      component: () => import('../views/pindaan/pindaan-f')
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-g',
      name: 'pindaan.part_g',
      component: () => import('../views/pindaan/pindaan-g')
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-h',
      name: 'pindaan.part_h',
      component: () => import('../views/pindaan/pindaan-h')
    },
    {
      path: '/wasiat/:wasiat_id/pindaan-i',
      name: 'pindaan.part_i',
      component: () => import('../views/pindaan/pindaan-i')
    },
    {
      path: '/wasiat/:wasiat_id/draft-wasiat',
      name: 'pindaan.draft-wasiat',
      component: () => import('../views/pindaan/draftWasiat')
    },
    ]
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/auth/sign-up'),
    meta: {
      middleware: [redirectIfAuthenticated]
    }
  },
  {
    path: '/dashboard/staff',
    name: 'dashboard.staff',
    component: () => import('../views/dashboard/staff'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/public/wasiat/:wasiat_id',
    name: 'wasiat-verification.auth',
    component: () => import('../views/wasiat/asas_user/Auth-public'),
  },
  {
    path: '/wasiat-verification/:wasiat_id/details',
    name: 'wasiat-verification.details',
    component: () => import('../views/wasiat/asas_user/wasiat-details'),
  },
  {
    path: '/wasiat-verification/:wasiat_id/ekyc',
    name: 'wasiat-verification.ekyc',
    component: () => import('../views/wasiat/asas_user/wasiat-ekyc'),
  },
  {
    path: '/wasiat-verification/:wasiat_id/pdpa',
    name: 'wasiat-verification.pdpa',
    component: () => import('../views/wasiat/asas_user/wasiat-pdpa'),
  },
  {
    path: '/verification/:wasiat_id/success',
    name: 'verification.success',
    component: () => import('../views/wasiat/asas_user/verification-success'),
  },
  {
    path: '/payment-status',
    name: 'payment-status',
    component: () => import('../views/wasiat/asas/payment-status')
  },
  {
    path: '/wasiat/part-a',
    name: 'wasiat.sidebar',
    component: () => import('../views/wasiat/asas/sidebar'),
    meta: {
      requiresAuth: true,
      middleware: [log],
    },
    children: [{
      path: '/wasiat/part-a',
      name: 'wasiat.part_a',
      component: () => import('../views/wasiat/asas/part-a')
    },
    {
      path: '/wasiat/part-payment',
      name: 'wasiat.part_payment',
      component: () => import('../views/wasiat/asas/part-payment')
    },
    {
      path: '/wasiat/part-b',
      name: 'wasiat.part_b',
      component: () => import('../views/wasiat/asas/part-b')
    },
    {
      path: '/wasiat/part-c',
      name: 'wasiat.part_c',
      component: () => import('../views/wasiat/asas/part-c')
    },
    {
      path: '/wasiat/part-d',
      name: 'wasiat.part_d',
      component: () => import('../views/wasiat/asas/part-d')
    },
    {
      path: '/wasiat/part-e',
      name: 'wasiat.part_e',
      component: () => import('../views/wasiat/asas/part-e')
    },
    {
      path: '/wasiat/part-f',
      name: 'wasiat.part_f',
      component: () => import('../views/wasiat/asas/part-f')
    },
    {
      path: '/wasiat/part-g',
      name: 'wasiat.part_g',
      component: () => import('../views/wasiat/asas/part-g')
    },
    ],

  },
  {
    path: '/wasiat/:wasiat_id/receipt',
    name: 'wasiat.receipt',
    component: () => import('../views/wasiat/asas/wasiat-asas-receipt'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/:wasiat_id/IC',
    name: 'wasiat.viewIc',
    component: () => import('../views/wasiat/pengesahan/view-ic'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/:wasiat_id/details',
    name: 'wasiat.details',
    component: () => import('../views/wasiat/details')
  },
  {
    path: '/carian/semak',
    name: 'carian.semak',
    component: () => import('../views/carian/semak'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/carian/senarai',
    name: 'carian.senarai',
    component: () => import('../views/carian/senarai'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/carian/status-a',
    name: 'carian.status-sidebar',
    component: () => import('../views/carian/status-sidebar'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/carian/status-a',
      name: 'carian.status-a',
      component: () => import('../views/carian/status-a')
    }, {
      path: '/carian/status-b',
      name: 'carian.status-b',
      component: () => import('../views/carian/status-b')
    }, {
      path: '/carian/status-c',
      name: 'carian.status-c',
      component: () => import('../views/carian/status-c')
    }, {
      path: '/carian/status-d',
      name: 'carian.status-d',
      component: () => import('../views/carian/status-d')
    }, {
      path: '/carian/status-e',
      name: 'carian.status-e',
      component: () => import('../views/carian/status-e')
    }]
  },
  {
    path: '/wasiat/pengesahan/pendaftaran',
    name: 'wasiat.pengesahan.pendaftaran',
    component: () => import('../views/wasiat/pengesahan/pendaftaran'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/hibah/list-client',
    name: 'hibah.list-client',
    component: () => import('../views/trust/approval/list-hibah-client'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/trust/pengesahan/tabpendaftaran',
    name: 'trust.pengesahan.tabpendaftaran',
    component: () => import('../views/trust/approval/tab-hibah-client'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/trust/pengesahan/pendaftaran',
      name: 'trust.pengesahan.pendaftaran',
      component: () => import('../views/trust/approval/pendaftaran'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/trust/pengesahan/pendaftaran-saksi',
      name: 'trust.pengesahan.pendaftaran-saksi',
      component: () => import('../views/trust/approval/pendaftaran_saksi'),
      meta: {
        requiresAuth: true
      }
    }]
  },
  // {
  //   path: '/trust/pengesahan/pendaftaran',
  //   name: 'trust.pengesahan.pendaftaran',
  //   component: () => import('../views/trust/approval/pendaftaran'),
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/wasiat/pengesahan/list-pendaftaran',
    name: 'wasiat.pengesahan.list-pendaftaran',
    component: () => import('../views/wasiat/pengesahan/list-pendaftaran'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/trust/pengesahan/list-pendaftaran',
    name: 'trust.pengesahan.list-pendaftaran',
    component: () => import('../views/trust/approval/list-pendaftaran'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/trust/pengesahan/list-pendaftaran-witness',
    name: 'trust.pengesahan.list-pendaftaran-witness',
    component: () => import('../views/trust/approval/list-hibah-saksi'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/wasiat/pengesahan/pindaan',
    name: 'wasiat.pengesahan.pindaan',
    component: () => import('../views/wasiat/pengesahan/pindaanPengesahanTab'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/wasiat/pengesahan/list-pindaan',
      name: 'wasiat.pengesahan.list-pindaan',
      component: () => import('../views/wasiat/pengesahan/pindaanPengesahanList'),
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/wasiat/pengesahan/list-pindaan-saksi',
      name: 'wasiat.pengesahan.list-pindaan-saksi',
      component: () => import('../views/wasiat/pengesahan/pindaanPengesahanSaksi'),
      meta: {
        requiresAuth: true
      }
    }]
  },
  // {
  //   path: '/wasiat/pengesahan/list-pindaan',
  //   name: 'wasiat.pengesahan.list-pindaan',
  //   component: () => import('../views/wasiat/pengesahan/pindaanPengesahanList'),
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/trust/pengesahan/list-pindaan-hibah',
    name: 'wasiat.pengesahan.list-pindaan-hibah',
    component: () => import('../views/trust/approval/pindaanPengesahanList-hibah'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/pindaan/senarai-pindaan',
    name: 'wasiat.pindaan.senarai-pindaan',
    component: () => import('../views/wasiat/pindaan/senarai-pindaan'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wasiat/pindaan/search',
    name: 'wasiat.pindaan.search',
    component: () => import('../views/wasiat/pindaan/search'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/template',
    name: 'template',
    component: () => import('../views/dashboard/template'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/organization/type/:type',
    name: 'organization.list',
    component: () => import('../views/organization/list'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/organization/rakan/',
    name: 'organization-rakan.list',
    component: () => import('../views/organization/rakan-niaga-list'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/organization/:type/register',
    name: 'organization.register',
    component: () => import('../views/organization/register'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/organization/create',
    name: 'organization.create',
    component: () => import('../views/organization/create'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/organization/:organization_id',
    name: 'organization.master.details',
    component: () => import('../views/organization/details/master'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/organization/:organization_id',
      name: 'organization.info',
      component: () => import('../views/organization/details/info'),
    }, {
      path: '/organization/:organization_id/Individu/',
      name: 'organization.info-individual',
      component: () => import('../views/organization/details/info-individual'),
    }, {
      path: '/organization/:organization_id/edit',
      name: 'organization.edit',
      component: () => import('../views/organization/details/edit'),
    }, {
      path: '/organization/:organization_id/branch',
      name: 'organization.branch',
      component: () => import('../views/organization/details/branch/list'),
    }, {
      path: '/organization/:organization_id/branch/create',
      name: 'organization.branch.create',
      component: () => import('../views/organization/details/branch/create'),
    }, {
      path: '/organization/:organization_id/branch/:branch_id',
      name: 'organization.branch.info',
      component: () => import('../views/organization/details/branch/info'),
    }, {
      path: '/organization/:organization_id/branch/:branch_id/edit',
      name: 'organization.branch.edit',
      component: () => import('../views/organization/details/branch/edit'),
    }, {
      path: '/organization/:organization_id/user',
      name: 'organization.user',
      component: () => import('../views/organization/details/user/list'),
    }, {
      path: '/organization/:organization_id/user/create',
      name: 'organization.user.create',
      component: () => import('../views/organization/details/user/create'),
    }, {
      path: '/organization/:organization_id/user/:user_id',
      name: 'organization.user.info',
      component: () => import('../views/organization/details/user/info'),
    }, {
      path: '/organization/:organization_id/user/:user_id/edit',
      name: 'organization.user.edit',
      component: () => import('../views/organization/details/user/edit'),
    }, {
      path: '/organization/:organization_id/pricing',
      name: 'organization.pricing',
      component: () => import('../views/organization/details/pricing/list'),
    }, {
      path: '/organization/:organization_id/pricing/create',
      name: 'organization.pricing.create',
      component: () => import('../views/organization/details/pricing/create'),
    }, {
      path: '/organization/:organization_id/pricing/:pricing_id',
      name: 'organization.pricing.info',
      component: () => import('../views/organization/details/pricing/info'),
    }, {
      path: '/organization/:organization_id/pricing/:pricing_id/edit',
      name: 'organization.pricing.edit',
      component: () => import('../views/organization/details/pricing/edit'),
    }, {
      path: '/organization/:organization_id/preference',
      name: 'organization.preference.info',
      component: () => import('../views/organization/details/preference/info'),
    }, {
      path: '/organization/:organization_id/preference/edit',
      name: 'organization.preference.edit',
      component: () => import('../views/organization/details/preference/edit'),
    }]
  },
  {
    path: '/client',
    name: 'client.list',
    component: () => import('../views/client/list'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/client/pending',
    name: 'client.pending',
    component: () => import('../views/client/userlist-waitapproval'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/client/:client_id',
    name: 'client.info',
    component: () => import('../views/client/info'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/client/:client_id/edit',
    name: 'client.edit',
    component: () => import('../views/client/edit'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/change-password',
    name: 'change-password',
    component: () => import('../views/user/change-password'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile.base',
    component: () => import('../views/user/profile'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/user-details'),
    }, {
      path: '/profile/signature',
      name: 'profile.signature',
      component: () => import('../views/user/signature'),
    }]
  }, {
    path: '/profile-create',
    name: 'profile-create',
    component: () => import('../views/user/profile-create'),
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/profile-edit',
    name: 'profile-edit',
    component: () => import('../views/user/profile-edit'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ekyc',
    name: 'ekyc',
    component: () => import('../views/ekyc/index'),
    meta: {
      requiresAuth: true
    },
  }, {
    path: '/ekyc/validation',
    name: 'ekyc.validation',
    component: () => import('../views/ekyc/ocr'),
    meta: {
      requiresAuth: true
    },
  }, {
    path: '/signature',
    name: 'signature',
    component: () => import('../views/ekyc/signature'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/wasiat/list',
    name: 'wasiat.list',
    component: () => import('../views/wasiat/list'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/pindaan/list',
    name: 'pindaan.list',
    component: () => import('../views/pindaan/list'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/trust/list',
    name: 'trust.list',
    component: () => import('../views/trust/list'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/trust/product-list',
    name: 'trust.product-list',
    component: () => import('../views/trust/product-list'),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/trust/part-listpindaan',
    name: 'trust.part-listpindaan',
    component: () => import('../views/trust/form/part-listpindaan'),
  },
  {
    path: '/trust/',
    name: 'trust.sidebar',
    component: () => import('../views/trust/form/sidebar'),
    meta: {
      requiresAuth: true
    },
    children: [

      {
        path: '/trust/part-signpenerima',
        name: 'trust.part-signpenerima',
        component: () => import('../views/trust/form/part-penerima'),
      },
      {
        path: '/trust/part-draft',
        name: 'trust.part-draft',
        component: () => import('../views/trust/form/part-draft'),
      },
      {
        path: '/trust/part-a',
        name: 'trust.part-a',
        component: () => import('../views/trust/form/part-a'),
      }, {
        path: '/trust/part-b',
        name: 'trust.part-b',
        component: () => import('../views/trust/form/part-b'),
      }, {
        path: '/trust/add-heir',
        name: 'trust.add-heir',
        component: () => import('../views/trust/form/heir/add-heir'),
      }, {
        path: '/trust/heir/update',
        name: 'trust.heir.update',
        component: () => import('../views/trust/form/heir/update'),
      }, {
        path: '/trust/part-c',
        name: 'trust.part-c',
        component: () => import('../views/trust/form/part-c'),
      }, {
        path: '/trust/part-d',
        name: 'trust.part-d',
        component: () => import('../views/trust/form/part-d'),
      }, {
        path: '/trust/receiver/update',
        name: 'trust.receiver.update',
        component: () => import('../views/trust/form/receiver/update'),
      }, {
        path: '/trust/part-f',
        name: 'trust.part-f',
        component: () => import('../views/trust/form/part-f'),
        children: [
          {
            path: '/trust/part-f/moveable',
            name: 'trust.part-f.moveable',
            component: () => import('../views/trust/form/asset/moveable/list'),
          }, {
            path: '/trust/part-f/immoveable',
            name: 'trust.part-f.immoveable',
            component: () => import('../views/trust/form/asset/immoveable/list'),
          },
        ]
      }, {
        path: '/trust/part-e/create',
        name: 'trust.caretaker.create',
        component: () => import('../views/trust/form/caretaker/create'),
      }, {
        path: '/trust/part-e/update',
        name: 'trust.caretaker.update',
        component: () => import('../views/trust/form/caretaker/update'),
      }, {
        path: '/trust/part-e',
        name: 'trust.part-e',
        component: () => import('../views/trust/form/part-e'),
      }, {
        path: '/trust/part-g',
        name: 'trust.part-g',
        component: () => import('../views/trust/form/part-g'),
      },
      {
        path: '/trust/part-h',
        name: 'trust.part-h',
        component: () => import('../views/trust/form/part-h'),
      },
      {
        path: '/trust/part-i',
        name: 'trust.part-i',
        component: () => import('../views/trust/form/part-i'),
      }, {
        path: '/trust/moveable-property/create',
        name: 'trust.moveable-property.create',
        component: () => import('../views/trust/form/asset/moveable/add-property'),
      }, {
        path: '/trust/moveable-property/show',
        name: 'trust.moveable-property.show',
        component: () => import('../views/trust/form/asset/moveable/show/navigation'),
        children: [
          {
            path: '/trust/moveable-property/details',
            name: 'trust.moveable-property.details',
            component: () => import('../views/trust/form/asset/moveable/show/details'),
          }, {
            path: '/trust/moveable-property/receiver',
            name: 'trust.moveable-property.receiver',
            component: () => import('../views/trust/form/asset/moveable/show/receiver/list'),
          }, {
            path: '/trust/moveable-property/attachment',
            name: 'trust.moveable-property.attachment',
            component: () => import('../views/trust/form/asset/moveable/show/attachment'),
          }
        ]
      }, {
        path: '/trust/immoveable-property/create',
        name: 'trust.immoveable-property.create',
        component: () => import('../views/trust/form/asset/immoveable/add-property'),
      }, {
        path: '/trust/immoveable-property/show',
        name: 'trust.immoveable-property.show',
        component: () => import('../views/trust/form/asset/immoveable/show/navigation'),
        children: [
          {
            path: '/trust/immoveable-property/details',
            name: 'trust.immoveable-property.details',
            component: () => import('../views/trust/form/asset/immoveable/show/details'),
          }, {
            path: '/trust/immoveable-property/receiver',
            name: 'trust.immoveable-property.receiver',
            component: () => import('../views/trust/form/asset/immoveable/show/receiver'),
          }, {
            path: '/trust/immoveable-property/attachment',
            name: 'trust.immoveable-property.attachment',
            component: () => import('../views/trust/form/asset/immoveable/show/attachment'),
          }
        ]
      }
    ]
  },

  {
    path: '/amanah/harta-pusaka',
    name: 'trust-inheritance.sidebar',
    component: () => import('../views/trust-inheritance/form/sidebar'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/amanah/harta-pusaka/part-signpenerima',
        name: 'trust-inheritance.part-signpenerima',
        component: () => import('../views/trust-inheritance/form/part-penerima'),
      },
      {
        path: '/amanah/harta-pusaka/part-draft',
        name: 'trust-inheritance.part-draft',
        component: () => import('../views/trust-inheritance/form/part-draft'),
      },
      {
        path: '/amanah/harta-pusaka/part-a',
        name: 'trust-inheritance.account',
        component: () => import('../views/trust-inheritance/form/part-a'),
      },
      {
        path: '/amanah/harta-pusaka/part-b',
        name: 'trust-inheritance.giver',
        component: () => import('../views/trust-inheritance/form/part-b'),
      }, {
        path: '/amanah/harta-pusaka/part-c',
        name: 'trust-inheritance.caretaker',
        component: () => import('../views/trust-inheritance/form/part-c'),
      }, {
        path: '/amanah/harta-pusaka/part-c/create',
        name: 'trust-inheritance.caretaker.create',
        component: () => import('../views/trust-inheritance/form/caretaker/create'),
      }, {
        path: '/amanah/harta-pusaka/part-c/update',
        name: 'trust-inheritance.caretaker.update',
        component: () => import('../views/trust-inheritance/form/caretaker/update'),
      }, {
        path: '/amanah/harta-pusaka/part-d',
        name: 'trust-inheritance.period',
        component: () => import('../views/trust-inheritance/form/part-d'),
      }, {
        path: '/amanah/harta-pusaka/part-e',
        name: 'trust-inheritance.heirs',
        component: () => import('../views/trust-inheritance/form/part-e'),
      },
      // {
      //   path: '/amanah/harta-pusaka/add-heir',
      //   name: 'trust-inheritance.add-heir',
      //   component: () => import('../views/trust-inheritance/form/heir/add-heir'),
      // }, 
      {
        path: '/amanah/harta-pusaka/heir/update',
        name: 'trust-inheritance.heir.update',
        component: () => import('../views/trust-inheritance/form/heir/update'),
      }, {
        path: '/amanah/harta-pusaka/part-f',
        name: 'trust-inheritance.receiver',
        component: () => import('../views/trust-inheritance/form/part-f'),
      }, {
        path: '/amanah/harta-pusaka/receiver/update',
        name: 'trust-inheritance.receiver.update',
        component: () => import('../views/trust-inheritance/form/receiver/update'),
      }, {
        path: '/amanah/harta-pusaka/part-g',
        name: 'trust-inheritance.property',
        component: () => import('../views/trust-inheritance/form/part-g'),
        children: [
          {
            path: '/amanah/harta-pusaka/part-g/moveable',
            name: 'trust-inheritance.property.moveable',
            component: () => import('../views/trust-inheritance/form/asset/moveable/list'),
          }, {
            path: '/amanah/harta-pusaka/part-g/immoveable',
            name: 'trust-inheritance.property.immoveable',
            component: () => import('../views/trust-inheritance/form/asset/immoveable/list'),
          },
        ]
      }, {
        path: '/amanah/harta-pusaka/moveable-property/transaction',
        name: 'trust-inheritance.moveable-property.transaction',
        component: () => import('../views/trust-inheritance/form/asset/moveable/transaction-list'),
      }, {
        path: '/amanah/harta-pusaka/moveable-property/create',
        name: 'trust-inheritance.moveable-property.create',
        component: () => import('../views/trust-inheritance/form/asset/moveable/add-property'),
      }, {
        path: '/amanah/harta-pusaka/moveable-property/show',
        name: 'trust-inheritance.moveable-property.show',
        component: () => import('../views/trust-inheritance/form/asset/moveable/show/navigation'),
        children: [
          {
            path: '/amanah/harta-pusaka/moveable-property/details',
            name: 'trust-inheritance.moveable-property.details',
            component: () => import('../views/trust-inheritance/form/asset/moveable/show/details'),
          }, {
            path: '/amanah/harta-pusaka/moveable-property/receiver',
            name: 'trust-inheritance.moveable-property.receiver',
            component: () => import('../views/trust-inheritance/form/asset/moveable/show/receiver/list'),
          }, {
            path: '/amanah/harta-pusaka/moveable-property/attachment',
            name: 'trust-inheritance.moveable-property.attachment',
            component: () => import('../views/trust-inheritance/form/asset/moveable/show/attachment'),
          }
        ]
      }, {
        path: '/amanah/harta-pusaka/immoveable-property/transaction',
        name: 'trust-inheritance.immoveable-property.transaction',
        component: () => import('../views/trust-inheritance/form/asset/immoveable/transaction-list'),
      }, {
        path: '/amanah/harta-pusaka/immoveable-property/create',
        name: 'trust-inheritance.immoveable-property.create',
        component: () => import('../views/trust-inheritance/form/asset/immoveable/add-property'),
      }, {
        path: '/amanah/harta-pusaka/immoveable-property/show',
        name: 'trust-inheritance.immoveable-property.show',
        component: () => import('../views/trust-inheritance/form/asset/immoveable/show/navigation'),
        children: [
          {
            path: '/amanah/harta-pusaka/immoveable-property/details',
            name: 'trust-inheritance.immoveable-property.details',
            component: () => import('../views/trust-inheritance/form/asset/immoveable/show/details'),
          }, {
            path: '/amanah/harta-pusaka/immoveable-property/receiver',
            name: 'trust-inheritance.immoveable-property.receiver',
            component: () => import('../views/trust-inheritance/form/asset/immoveable/show/receiver'),
          }, {
            path: '/amanah/harta-pusaka/immoveable-property/attachment',
            name: 'trust-inheritance.immoveable-property.attachment',
            component: () => import('../views/trust-inheritance/form/asset/immoveable/show/attachment'),
          }
        ]
      }, {
        path: '/amanah/harta-pusaka/part-h',
        name: 'trust-inheritance.distribution',
        component: () => import('../views/trust-inheritance/form/part-h'),
      },
      // {
      //   path: '/amanah/harta-pusaka/part-h',
      //   name: 'trust-inheritance.part-h',
      //   component: () => import('../views/trust-inheritance/form/part-h'),
      // },
      {
        path: '/amanah/harta-pusaka/part-i',
        name: 'trust-inheritance.part-i',
        component: () => import('../views/trust-inheritance/form/part-i'),
      },
    ]
  },

  {
    path: '/trust-onecent/redeem',
    name: 'trust-onecent.redeem',
    component: () => import('../views/trust-onecent/redeem'),
  },
  {
    path: '/trust-onecent/',
    name: 'trust-onecent.sidebar',
    component: () => import('../views/trust-onecent/form/sidebar'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/trust-onecent/part-signpenerima',
        name: 'trust-onecent.part-signpenerima',
        component: () => import('../views/trust-onecent/form/part-penerima'),
      },
      {
        path: '/trust-onecent/part-draft',
        name: 'trust-onecent.part-draft',
        component: () => import('../views/trust-onecent/form/part-draft'),
      },
      {
        path: '/trust-onecent/part-a',
        name: 'trust-onecent.part-a',
        component: () => import('../views/trust-onecent/form/part-a'),
      }, {
        path: '/trust-onecent/part-b',
        name: 'trust-onecent.part-b',
        component: () => import('../views/trust-onecent/form/part-b'),
      }, {
        path: '/trust-onecent/add-heir',
        name: 'trust-onecent.add-heir',
        component: () => import('../views/trust-onecent/form/heir/add-heir'),
      }, {
        path: '/trust-onecent/heir/update',
        name: 'trust-onecent.heir.update',
        component: () => import('../views/trust-onecent/form/heir/update'),
      }, {
        path: '/trust-onecent/part-c',
        name: 'trust-onecent.part-c',
        component: () => import('../views/trust-onecent/form/part-c'),
      }, {
        path: '/trust-onecent/part-d',
        name: 'trust-onecent.part-d',
        component: () => import('../views/trust-onecent/form/part-d'),
      }, {
        path: '/trust-onecent/receiver/update',
        name: 'trust-onecent.receiver.update',
        component: () => import('../views/trust-onecent/form/receiver/update'),
      }, {
        path: '/trust-onecent/part-f',
        name: 'trust-onecent.part-f',
        component: () => import('../views/trust-onecent/form/part-f'),
        children: [
          {
            path: '/trust-onecent/part-f/moveable',
            name: 'trust-onecent.part-f.moveable',
            component: () => import('../views/trust-onecent/form/asset/moveable/list'),
          }, {
            path: '/trust-onecent/part-f/immoveable',
            name: 'trust-onecent.part-f.immoveable',
            component: () => import('../views/trust-onecent/form/asset/immoveable/list'),
          },
        ]
      }, {
        path: '/trust-onecent/part-e/create',
        name: 'trust-onecent.caretaker.create',
        component: () => import('../views/trust-onecent/form/caretaker/create'),
      }, {
        path: '/trust-onecent/part-e/update',
        name: 'trust-onecent.caretaker.update',
        component: () => import('../views/trust-onecent/form/caretaker/update'),
      }, {
        path: '/trust-onecent/part-e',
        name: 'trust-onecent.part-e',
        component: () => import('../views/trust-onecent/form/part-e'),
      }, {
        path: '/trust-onecent/part-g',
        name: 'trust-onecent.part-g',
        component: () => import('../views/trust-onecent/form/part-g'),
      },
      {
        path: '/trust-onecent/part-h',
        name: 'trust-onecent.part-h',
        component: () => import('../views/trust-onecent/form/part-h'),
      },
      {
        path: '/trust-onecent/part-i',
        name: 'trust-onecent.part-i',
        component: () => import('../views/trust-onecent/form/part-i'),
      }, {
        path: '/trust-onecent/moveable-property/create',
        name: 'trust-onecent.moveable-property.create',
        component: () => import('../views/trust-onecent/form/asset/moveable/add-property'),
      }, {
        path: '/trust-onecent/moveable-property/show',
        name: 'trust-onecent.moveable-property.show',
        component: () => import('../views/trust-onecent/form/asset/moveable/show/navigation'),
        children: [
          {
            path: '/trust-onecent/moveable-property/details',
            name: 'trust-onecent.moveable-property.details',
            component: () => import('../views/trust-onecent/form/asset/moveable/show/details'),
          }, {
            path: '/trust-onecent/moveable-property/receiver',
            name: 'trust-onecent.moveable-property.receiver',
            component: () => import('../views/trust-onecent/form/asset/moveable/show/receiver/list'),
          }, {
            path: '/trust-onecent/moveable-property/attachment',
            name: 'trust-onecent.moveable-property.attachment',
            component: () => import('../views/trust-onecent/form/asset/moveable/show/attachment'),
          }
        ]
      }, {
        path: '/trust-onecent/immoveable-property/create',
        name: 'trust-onecent.immoveable-property.create',
        component: () => import('../views/trust-onecent/form/asset/immoveable/add-property'),
      }, {
        path: '/trust-onecent/immoveable-property/show',
        name: 'trust-onecent.immoveable-property.show',
        component: () => import('../views/trust-onecent/form/asset/immoveable/show/navigation'),
        children: [
          {
            path: '/trust-onecent/immoveable-property/details',
            name: 'trust-onecent.immoveable-property.details',
            component: () => import('../views/trust-onecent/form/asset/immoveable/show/details'),
          }, {
            path: '/trust-onecent/immoveable-property/receiver',
            name: 'trust-onecent.immoveable-property.receiver',
            component: () => import('../views/trust-onecent/form/asset/immoveable/show/receiver'),
          }, {
            path: '/trust-onecent/immoveable-property/attachment',
            name: 'trust-onecent.immoveable-property.attachment',
            component: () => import('../views/trust-onecent/form/asset/immoveable/show/attachment'),
          }
        ]
      }
    ]
  },
  {
    path: '/ezqurban/transaction/list',
    name: 'ezqurban.transaction.list',
    component: () => import('../views/ezqurban/transaction/list'),
    meta: {
      requiresAuth: true
    },
  }, {
    path: '/ezqurban/fund-transfer/list',
    name: 'ezqurban.fund-transfer.list',
    component: () => import('../views/ezqurban/fund-transfer/list'),
    meta: {
      requiresAuth: true
    },
  }, {
    path: '/ezqurban/report/monthly',
    name: 'ezqurban.report.monthly',
    component: () => import('../views/ezqurban/report/monthly'),
    meta: {
      requiresAuth: true
    },
  },]
}]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return window.scrollTo({ top: document.querySelector(to.hash).offsetTop, behavior: 'smooth' });
    }
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  },
})

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({
      ...context,
      next: nextMiddleware
    });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware) ?
      to.meta.middleware : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({
      ...context,
      next: nextMiddleware
    });
  }

  return next();
});

export default router
