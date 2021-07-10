var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
    var u = "https://stg-analytics.aj.my/";
    var setCookie = function (value) {
        var expiresAttr = '';
        var date = new Date();
        date.setTime(date.getTime() + 5184000000);
        expiresAttr = '; expires=' + date.toGMTString();
        document.cookie = 'ajreferral=' + value + expiresAttr + '; path=/';
    };
    var getCookie = function (name) {
        var cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0;
        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookieName = parts[0].replace(/^\s+|\s+$/gm, '');
            if (cookieName === name) {
                var value = parts.slice(1).join('=');
                if (value.charAt(0) === '"') {
                    value = value.slice(1, -1);
                }
                return value;
            }
        }
        return undefined;
    };
    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    var param = getParameterByName("aj_kwd");
    if (param) {
        setCookie(param);
    } _paq.push(['setTrackerUrl', u + 'aj.php']);
    _paq.push(['setSiteId', '8Q0LMw5pKRJo']);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript'; g.async = true; g.src = u + 'aj.js'; s.parentNode.insertBefore(g, s);
})();