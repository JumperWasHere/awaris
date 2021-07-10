<script>
import ApiService from "@/services/api.service";
export default {
  data() {
    return {
      wasiat: {},
    };
  },
  methods: {
    getWasiat() {
      ApiService.get(`/wasiat/${this.wasiatId}`).then((response) => {
        var wasiat = response.data.wasiat;
        if (wasiat) {
          this.wasiat = wasiat;
        }
      });
    },
  },
  mounted() {
    this.getWasiat();
  },
  computed: {
    wasiatId() {
      return this.$route.params.wasiat_id;
    },
  },
};
</script>
<template>
  <html>
    <head>
      <meta charset="utf-8" />
    </head>

    <body>
      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="2">
              <table>
                <tr>
                  <td class="title">
                    <img
                      alt="Logo"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAU0AAACXCAMAAACm/PkLAAAAwFBMVEX///8ner74+Ph5eXivr67FxcWTlZj7+/uQkpWEhIP09PQfd70VdLvr6+vv7+/Y2NiAgH/k5OT1+fy5ubmSkpF1dXQFcbrO4PBso9Iwf8CdnZyIiIebvd691uvP0NGQttqlp6m+v8G1trjd3t/s8/m5zeWZmZiur7GeoKOpyuaxsbCJi4/Ly8rm7vY8iMUAbLh8rNZZmMzZ6PQ8hsRPkMiAsNh2pNGkwd+WudzH2OvS4/JqnM1Xlcudw+K90eeFtNqbWASaAAAcYElEQVR4nO1diXriOLo1IraMd2FCWBLjhWAHDCGQrZJK6v3f6v6SvAEmVtXXd1I94/PNdBNjazn6d8mNJLWoIArQdw/hvweWv0q/ewz/dhCcfwr9QCH5H6b5PcP5d0OL/YxBD6gME43/ISutmP4BIiVQQot98CwiJTGIKrYTJQxx47MtjpEmEgmTVLP8UAJFtxYpJrESIM1vVf23gcIAe1oU+7GPPEVNNDsJldDUPBxH3z22fx/MJIrU0MReQixFUdQQB0mEI1/VZPm7x/bvQ6RogaqqIZKQr1I6wfmYPlyxo7gNPgWBPNkjxLQ0OcYJl0kE5lJNAgvhRKUXLN/ULJMQT25VvgE4UGPfT3xfSZmCg70MbewFEfJCM6JXfCuGOwCxan/3aP96eImFQPRsz4oSZaUSM1HVAK6DksdIXq2U2CIpFV5EVNLY2v86bBXJceBFEAZhrJmSHSqBZHnIihOIPk0NYwmTKHV9myhtqNQE8D7ySlVXIaUvwpBH2thWV4ppmsi0JC8EC5rQG4idWN892L8ehEZGYB9TkoCJBB4DSwpURfUkK14lYDpVX4vhhhX4Ke27B/vXw/I9awVsRp7ipxYER4kphYxNmzp0FPsK8Sibkhu2kVITUBxoEFX6SEMoomyCD6L/9FBMP2u2pGFLUdUE+20U/zWwRuQkxHKkSThyIV4HHVcSBLJInTtIrA0hVEAkbHoy9v0UnNJ3D/lvhRV5oe+7ngmfZEJAQFNEFCamiRpDqkljTS1cqQryUqJJhN9OWutZA+InoQdZTiSDRK4sjxpPGdmKGmMrXUXAppqYWkhNpmmvFNuSiaaRNEzCNlA6BVZjzUpjCNktCNItQtNI8EAR5JapGSJP8xWLeiKQUOStVh5ZJUC/Zi3i7x75X4lI9UyFZuKmFxJPonSqHgTwsqSAWidIRhp2VRohYY/4VkpvjTVXbTW9FrGvMYpscEYmkuxYWfnYNTFaeVKQgF+SIW6nio0gs2QOSiFEaT17PYiSInA1ioVkBZQYa5GcWF5CUJxKcQBabtp+SpAmh0pCw09ar4uTVjTrgQNF81a+xZWc1joQkixVljDCloRDEE/4N8Sd8G2M6F1W1NaRzsKCWNNGpq/x+rCLgjiCGNQkEvgfC0k49W3Mvwuxb1kRUoI24DwH0FskeeCzbZA/gAcBEYRBEs8gTeypMo03QTZDYqpJBI5Lbtk8AzP2wSpCROlhZAdBIEdgOjVgU0ImhvwHm1H+BdLACdkW9pKwtZu1sJVQM/3IVDwui8i0bVPygC3bT3z4F4EQ3o5M/q2WxCiMEUmSNng/BbiglPppX4NwCCxjTCQSK4oGjigCPw95kKRJtqoEGj2iAHG9ReDuhOBQ8b577H8dTD+JMA0hVU+KaFKpqnGEiE31nPsdiCs1y7M021fpbb5Ey5xgFaQ0cduy8SE8SMdNticpUwnkdEJYJJk5mxAwUZ0myYp9rUi0XEdDJUg5283LQ2CwmpYJrjwxTeSvVisQTY2E7JRMyNik+hz5rql5iQrfe8jyaBSlkcRvyTyBlYCuu2qqJRbGJgEazdSVMeSQOKYiiyVioSDwQKsJ0ZDkBhCWepKntF69Fq6S4siSVV+OIBW3CT2paWkS3aS06RYm/QOZJvGIhLwAPFBEkNseQDwHOwklFEJYbtmhCuoca/bC03LRMyG3JKYCRkANiOapdOPNb7X8LHCcYEsLEpA4lZ/z8APIJy2CNSnSMA3vTcI81MJDCvBsqq1knkWkmhC7S4Q790STIFJHYYpBvyFdD2S6byQRhbtyEwW+JPttcHQGmk+3J1ehZEEkSVNGLQptU7WlAP4XSbKKPNkEKY2B7ABbiarKKAm+e9R/KzzFsiFwX9mSJdO9NhlYQ7ItaStZihUJPhJV9SHvJCnkmyxusuz2+Ew9NAVEjWoxiVJEsMX2zyXwSFghkpdgSI00WlsKMDK1QJPV7LTCd4/770SQaKZPTxiZMrh1RGVPjSB/DCXw7dhH8EGiOx2KLIHURhE7raQRpa0X18BUE9vCKJJ9iOFXmO4Aq6Fm0cIwAfcEeeeKlozoDjCJ6J6lL7NjCkq7l1EDMw0TxQ9s8ONREAOBNFEH1Qf3jeNVwE4nxJjQmgdKY9mUNNN24QnXa9msA7aiNFYSaisRBER+oIFjoidn6KE5jZ6cSYhk+r6HNY1EOFQU1yNthPQFkBW7KEl8SMshWqfGU40l6o9sdsLLs9hxWNdPfJwE7SmkJqBYtlYQoJPUD2UWxkf8jBzEm1TVfTeJ7BV8lMJ2h60RZnYa1ovo+cJQXcX5aVhwQ0qq+avEolXlFQra85uNIIpJDxiqrgUexqRhfISDFYT0mkm8FHkJ+CZwTeDYvTarbESkIneVxIGNLY3KHrF9TXMVGXsuK8tpcNkL4wRCJKVlswlegiSMId1BJPAVH6f09TW4LoM8mqaSxKlmgcsHX9S+4dIMWZHl2FdUkD16QibAgRJHmok8X7E1eqImsdyVuohDL1Db2mYDUKj4cSB7NgRKrJJpQ54exUpoWRE7CqvGmu9Fnhz6frv12wjLtFgYaSfstQFaDg7YfjpQ59LIKCU+taf0hbc2CRIF+BhI1WMNRRpL2ROL2CyvJJ7bxpm/C9Bny49QlKgBK2XSgnxMzScKWwX/fQSxpJEw8byFh301xX4YhUpgIS1uXfnvw1a0IAkgxEwVk8g4TEwJ236SkvaFwD+AmSiZFNLT2B4/HYNSRWl3gv4AOMyL6igJoyIaQm5ba/8TlJ6bJGr4jQP5b4MXtyn5Pwfc1t5atGjR4vsxG719fUOfgVZbaTmVfc6u4wrgr4P7q2gcw9XDtehwea/Q6Byw+7ydPX3crOfNXRRY7+iTczYw9mm+vmqseNA719APfRDTP890eGMYL1+3dD2iuM6wHY3eGf3z7fb1usAM7shbfB8d4rlxho/Dn+vGmzgenmh3T6OHzUa/Hw6HhmEMh+PR3Zsoodf3w/vNZvMIA3uHf2/G9/fjr5+d/7gebaCX4fD+vrN5nt3+eBh/1C/ATDe2Xzf2fm/oum5kgE/3H/RyfzQ0Khje77Nm1vdDelsOY2g0TXC918dXTTdltxrDbBi63oG2afN6Bz7ttw0qluPl3qgOTzfg2S8J+DHq0BXjXTEmhvqwXgL7D7q+2X3Z/cfzo2F0chhUEOhlfD0e6sXVzuj6M1+uj+1of599pRub2WfTBO+gAUFV320fO9lg9M7Dy9V6t3t5GNIrxqZBx/IW7u4+Rvt8QsZ4u93++oLN/mwMBD6+vO0AHyPdYBMb/qi9+WZ89qsK5tfjjJ3xU4X63XtO58fJmJ/ZV/r+RmCCWxCzR3HTN+O97gtxXm/pFV1/mos20d/yNvQGvZT6Pw0YWzkJ/LFnfdVShp8M2mRz3fmT935EPH7gnG1OH5gzpsci6rd7hFsNQUWlTY9Zp1VTO+OjGwkX0K/2XDiaBGk7hJsOdHf+TJ+rNUy7n2zOAnKxZboxPGrlM5PNmlm8UorumhuWpFtGzkjkVg42aH1UkUTM5fVeTNkB/UfWxs+vjRz4aJjE6+G1Ocj1vpZNLnJDAXXcMTaPW+4/s8t6TeOvVH1FPDWX4k6jryrxi3aqP1f1mjei70VDA4mz+f61bVjTdRsf3wO+plPHZj/TVAG56DPhPNHpG651pz4EU2N429yuJL1xj2Cc2N6z+OBsHmgUV119JtoGZ7MhePuE2Rm/Ti6/DWtdzVXuHgWWlCv1/dGdfD3095PbwYboD0KSwm1IR38QuZnhbUjZPyKOe6LHBtUtwNg0tl/fNDPqfXS94wb10M/I1gnWjLcTCfpgk9ic+JAfsKyvxxfr0N9ngUG9LarDVR2bN0PWSGN8kmGkN4vympqPY1dBsbmv6WZtdMYPjM13AT/EDP2JBM05FSfu5sUQpOd2qI+YuegIu5BaNvv3zEmLRGQUXCO+ti5MgIY1wcbDe40KzAzj+Y3LhcAguGUaH7czMmqmJs0hKzhV/zps9M4bt8nvoi6klk3pT9j8Wiff6IzrEu+60sMcJvKZi7xApMZ97/EA5kZdqLHTO0Oh8OgGWJ+vh0LBX47/FJu7jS4eut2OqTiwoQnFMswynRgFzL3jUfoIbtcQyW76sER3WQRpvAoG31+wKWw3n4xm47Lmga2QwaLZ1fU5NmrB856jxnlmclw6edTF1vRmz3KaT76kgplhLZs71oRYGCFlUVaDJM+fuYsVafNtwys3d8MaNmrB1vPYjnzwAOcwxp0PBbJ/ieUwOo1S1lSnat1nHRibx1rKg1DhePNOgE3phUc8j81ZL74ecj+x43m8wAKsjdPl73Of3hkeROofhlgZ422vs1S+PzN+I+TkbB6aZZYq6hvhuocQm6yCwOopu4bZzB91zkD/iRktgZAzS50OJAiWbzxmC1i9+qgb1yJG8MXInvvB7YVYIamGzf4v9rxQ8sUgxCaN8xgMfXb15dg+jTw1/mRs1NSB6hs/4J1GQjPm7I2KWFyNxcq/fco6b4e1IRYG1LCZkXmaBJ6FGJt4O8x0zxg/330h+DCRLK+ac48qUBK7YrzvK1L3OdY3u2vWXWV2r7pY8HhjdIbZkn90xFX9mM31xyN92Piq6nsMMTZpWUcv+Hx8Ope3wogK/hgbekPOSsGdXMW/zKGzV2nHVb0gGSILXSix2ZSen/shsQ0Nzub+/enXzefd06jDNjOMvZhgZ2AhgEh0ercpdhh0ffhYv//0rOsP+RfrsWjI+cIaLWOfHyCpIP/MnpZDowIrVCaGFS1WhgeAQqk9Z7NDd2joFhT7PH4WTvPzvgVj/d3TuNzI0YfbGgMK4lQJdVg+NBZY2zcuQbkBwU+G8SRlalNEJ+CgxbLKrV5Zwt19p7ngyMHZzLb3+CR/fv6GlrPuhNmU8I8DPvfbE32/Pqj78Mj3WWBAPLvMeaf5I6Wjz57Ps8s1hO4iWrcufBADi0aEskvG5vjj9g7wlIWEwmXigzYE89D+7qNT2VI8TmBo9fGpOE8g9fedmiynDh8H5cytkWk9E+5Olk/9gIGKSMq1ThPBYhBMwIWyS8ZEnkO+802B0W/KpqAXqnQ62uv5RuxRdYxuxTyOnl7YyYKX69GG3nRmk/gA606F97mRJ7E3jIlMuJ/1piosbwrkfPww+pUN4mkknMYdsLnj26liW1AlfptNakB/drKtzoOiNPPN5YmDLAjQfwoYLV4I4LxDxvPAH8k8MmNirncMEY/wg7vJ40EIqPoBm0WELVp15/gDNmGadzw56hjVmtsbjSjYWRCObCqGwIA+ylJk/2dhH/vMIw9Z8fVmKJRVYkgm9cogMj5FiiWHbM5HXNdFKt4l/ohNauszt1fdfjY64+3HzVWGm4+P7VhwJn3eGhU+CIQKif/k9oR+BN8iEudAWKY/zO5+5IO4u56xhR82K8ghm9JVFhEK1+4p/pDNPLuuuM/+aRKW7aA2Ly9mZVZacupDgFPQxjfmaRFoB7GfiNLdDjv60SUWzQqkh0ds8udOfMPX+FM2aS7NrGLZ0vC0ZPQqmif/YMIJJvJtr+9L2mb5jupMPzg3cBabU1/Fa91fn7GiOGZTev59XX8VYLO+uVtupou/aSn3+E5WxKkwfhZrro8f7HRdefmGp/DruWBWCSGufpIv8Wi2UWB+HLM557qui2/J852ML9ncPc9qpSI7TZH/SY+knZbaH3Ux0ecOR9/0x/rBdt5PHtffjHWh3QTIbE9F6U7kyEDmCQ96ucrCJPHDTAJs3p8xHU9VNvvvul5z+JQ766fmcXBJ1yFy31cv3/GdhFqWTvE21utOgrCmG1fjlE26x8V0Q7ha3MymdO6U5nVV00F66k4jzA+ywy+QFaSPDyX1i1RWRN9+6bXHMngE35QP1bDZf+VrLGSyi56+Lk2MjIfa1hibmST1n+onwlW9I7Db9pxnrIet/MyPeApM6G2j127hXHEr0rCk21M2pT6POjui+56PtdvZBwBtq9WS105Zid2Nz5QyuaoLLO4dZ+24SnLL62SGgLGg+cu4bt34QcCmLJHL1ZGh6GcHdsUOKfc3zWzuhofbMznoiacs+sE0mqi1rvOzhwePwU8OHW8aZ2doDIFEG0KhM9u9LE3UG8SbM3Fs1OZ8WPdCjv1t30w9TMio2VGmli7P9uj5vnGtNvTfaw8a1YAfdDk2F/Nzx+VqGzjjua+OM406MNpOTicUOZHI0QCuX19vGFNF0Tcvx2aHRdZcMfjZ6lqni2c8Bm6O4Hlh97gciq9Zri6wbXijn42DdvyA15fZFL+nphzLEzJ9f9cYVPSzY/lfBmP9EasNPV5X1XX3RM90PrEe1vz0wnOdJr1lbkQg5mQ5y4n8sKLQvjkouGMWbvxRN+frzCZ/dWZje/wWQYE5q5Hrjbbz5j3zo+PtF/3wA8DA5/7nU/aC1s12r+v6kJF5+5jVO/XhfnR7wGi/8r6KMWza7AIp1E9powXLxjMj+Nc421Q1jMdfh9H21ah4lUYfdupLMOtf+dspuvHz9vidsv4zq0AOH9bnXDuePWyGxT4k9DPcbM5pI50ml2FjOLwfP47ZC0Od7P4n+uIRZHTsBbDDBG7+Ti+OAR36zlbTGYh6+0hz/SZF749Z7/RVJmN4f6hpd6zMSQdBC3W1G/xzo3gVjL3YdUxE/+6R+7HZ1a7WlfX3By+NUdyfEWX8OjS2D/tO5WUtY7h/f8navZm93N7efn7e3r7MtqMD2erPfs1ePn8A4Nvb1wZ1nY/0upz4at98ZAdfz+7oIOD/17PRoV++Gc1eb9kg4Nu7Wt8MbD4+vM8Av97fN8OalzB2T0zAjfHjc90s8PZ5doinh3MScLV9mK+vPl9+jR42e8DjaHt3VawRLvWi358f6sK8esKzMQJ+Gd7XrHz/8f65+QXQoh98/PJnf96vPF7f0nq9Ll45Xa/rjgf1wWCASoLQ1a/H/Pil2vPvvGYksa4ofuft2N/A+q7W1lx9iJcd/l9x82v0PLoWTtpbtGjRokWLFi1a/COQW/xj8KRui38MC+mixT+GQEIt/jG0/wnuFi1atGjRokWLFi3+/fDK//I5jio/v4Ftre4zKX89xnLL3z6RixvM4ocSbDf/7WycBlkvtpnfleYPpEUrKHUpZJPlGvaS/XPh9Ko/5WcXP8OAozIlkeXioxnQJmz+XeRmSDF0yWCzkWjFE+V4JeQVHWnZY+bv/XfhybQciOZXfmiHDMrfESe94gu7V/x2GXGKR+1u+dFxs0+uk48TLy/5U9bigl+RL3M2tekkf9SadHuAbndJ18a9hH94Tm+y6E6L7tGkl3/EfvkjS4NBMVa75/R6zuWCrZHMGoS/fSTZlw79eDmlozKLJ2xnmT8albMwu/Rm5/JykP7OD7wETjkQc1F+hvmWkud2J/ka2b1Bfp1MC/maOBOruKFgs1esutflFyNnygaHLpx8rWRnmq+PNZnaAG/SpTwFwKY26XmaKXfL1qdOziz2y9VcLIqxQv/QxrJ7QUcsdwObgWBY8SX9FHTpBMqpluOVls4gXx/ToTd7aTDo/saPXFoLp5AgEMduKQSDbqlTPcfJZwxLv8iaL9mMpmUrtWySTBSWDu/B6k20cgC5jFkTfhdMVeNskgETXDlXas13nEn2GdgsOqiyyUcyZYsuX5a/Amhn6hBQCaxj0+o5xfzNfKVAXybCRQ65e9Er7o6cUlCDbqGxoLKTUjFA/jNBLdjEF92l4+eWsY5NfHHJfkgO1GfAZ5aLVQptT0k+ct4L8i8tzqZZUWHWJb07axXYdHKzc8rmgt1Wx6Z5CUOtY/OCNp59LtiEBSz1vwFoOrDcQndsZ9DLCXKmUz+7bE0Hppvrvd1bLrs+479g055OJT8X5Vo2YdVoJ0E38B3akJ+LMiw9kTMzULI56WZsVrWZAnqxuQ7T7yaus+AG44RNdF42o8slrmPT6g7Mi5yLkk1QvMMVPQ9qz6x8eFIwBUnhGhg4Sz9vRAYpjXJu7V6gTfj0czaxC5LmOYtidEijQMsKm9GUup/BgHhM5HMWYAATyRpMue3I2Ux7i0zToQ/or2iFdMHK5KIMbGpuZlEP7KaHLHvCfYvclQmDWbAJ6+cxTc9G6eVsujAyO7cjFTZBUwQdO1vBi0xf8MVAm/DF0QYDa9mVsjk6MB8/8xV0Ka2Bk1bYNKfgWmCQnCB7OphwTKclm3gABt52fIymwBS5vMisywQkCbuZcFqTnn9xceH32CAYm9QkFy5IuqBKl15yO0vZxKAnx2xC/4upM7A4mwMOEBi7u6B180WXCoy56GWjHGQWzRxMYQKTbMwVNqVlV+xX8FLWEunyuaHFRDMv2dhTJ4AIhc8iZXONuhcFm9AX7TRnc9mlP2wmO5MjNgcVNqULkKgLughUYt18rFHX15j3w9m6MUzYwnE2JXNSWEerR6M2a9HTcjapVVueskkjId9kbC74WFzKZo823ktpXyWbi4zNwKET9LpLdMqm0C804knPTdNUHnCxQlNYwQv6KEyLjiTiU+zKcJPn8MiImxkyBZnK2ERd1oqbiSKYgqz5qt2kEalJ5RMMy1Ja5FHWwvHh0XTBDT1oOiksd84miK6TLcvSWdC7OYGcTTq84NRuWsTvUrd4aDfli8KolXYz4ppuLrp0Fmk2zUM2hX64zZtmYMsiWVSFSG+AQByhLY/TYjv5TUzBMqPtgWfK2HSLG5Yl3SdsSt0LmUvBZJBOs8lHTi97lCkmtZs2s5lVNqnzYgoDTPO7ew4u2AQNhdTi1KdDnGGfeCFtkKchJ14ozWfBrU6FTex3yzzmPCB44yaa+I4lZWYajJiHJjTes6eMncXAZvdEE2pXCrJAsW3GJnh8jxt6HtefY3MxHXQtPt1BfsuFE/BHJ2zwlE3o/+KYTTxgDMnO0mS3L5nZztiEqGlKTtmElUpPfbrdm5q1bKJBL58msyMVNsnAESAThuFnn1ImnDIbBwTaHjMU5mDBxpCT4zF1LMhyu1wpXSebPZgGKr3n2JSdzLCCD8snPO1likcuudYOaPrTzaLsS6qx2Ueb6WImteZ0gUo2gbdBr4bNS68mQoJMiJnoYzbT7hLns6AqWbKJLrpF6vkFIJYrJHhBzfuSmyfX4WGSxjosTBydJqqS5Tt02pDLFLUN5hXPsWl18xgTeOX3L8u4eMLNNe3RzLwXsAnRAg+AHKa1lRQwrbAJZsc5YRPE3ayLN10eBByzOS2maS1oLFOwCUHYQiQXIoVJzvLoQWaAp5kjoKptF5LHZK9KFvIpm7krp2Dm9hybaFBmpJPs304xAEJXMIs3bR4TAZsI/A7RtJTaTW0wLRbfoqFAySYMohpvyiaJ0gGbndxNTQYrZ1PjRuWITbsQTSpNKWXTNaEZO510F0Lxke9UwkFq87rZdJeZH/AhOfedcnEhykaVEhFMXob/V1Yf5FSrrSGxLtzc12M/5Rcuy1/ohNTThue5GrqMCZdVPboDf8L8bB5mFmOvsIndag1pOhhMu90LHiFl8eYS5dksCIt9wKYTSnjRKykzp+A1zC60Muh1L6euiAuC0aaVEN9eEmmZ8uFqeY7oEi2o/kYuXKiWAyVCJMsN8GErdfVNPspiwLxaimW3Up0hrichmfeGZPokq28id+D0aEwqpUGlNXMJnaSVCVTqm6ww6VlsWAf1zSUfAFnK+Ki+aZXVVtoT9J7VN+VIq1Xz/wM6xtlIA/TS3wAAAABJRU5ErkJggg=="
                      style="width: 100%; max-width: 200px"
                    />
                  </td>

                  <td>
                    Invoice #: {{ wasiat.id }}<br />
                    Created: {{ wasiat.created_at }}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="information">
            <td colspan="2">
              <table>
                <tr>
                  <td>
                    <strong>AWARIS Group</strong><br />
                    M2-12-03, 8 TRIUM, Menara 2, <br />
                    Jalan Cempaka SD 12/5, Bandar Sri Damansara<br />
                    52200 Kuala Lumpur
                  </td>

                  <td>
                    <strong>Islamic Wasiat</strong><br />
                    {{ wasiat.user.name }}<br />
                    {{ wasiat.user.email }}<br />
                    {{ wasiat.user.mobile_number }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="heading">
            <td>Item</td>

            <td>Harga</td>
          </tr>

          <tr class="item">
            <td>Wasiat</td>

            <td>RM {{ wasiat.price }}</td>
          </tr>

          <tr class="total">
            <td></td>

            <td>Jumlah: RM {{ wasiat.price }}</td>
          </tr>
        </table>
      </div>
    </body>
  </html>
</template>
 <style>
.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}
</style>