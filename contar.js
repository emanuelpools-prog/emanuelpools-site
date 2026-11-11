(function(){"use strict";
function origemDe(busca, referrer) {
  var u = "", h = "";
  try { u = (new URLSearchParams(busca || "").get("utm_source") || "").toLowerCase().trim(); } catch (e) {}
  try { h = referrer ? new URL(referrer).hostname.toLowerCase().replace(/^www\./, "") : ""; } catch (e) {}
  if (!u && (h === "emanuelpools.com" || h === "localhost")) return "";
  if (!u && !h) return "direto";
  if (/^(ig|instagram)$/.test(u) || /(^|\.)instagram\.com$/.test(h)) return "instagram";
  if (/^(tt|tiktok)$/.test(u) || /(^|\.)tiktok\.com$/.test(h)) return "tiktok";
  if (/^(fb|facebook)$/.test(u) || /(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(h)) return "facebook";
  if (/^(yt|youtube)$/.test(u) || /(^|\.)youtube\.com$|^youtu\.be$/.test(h)) return "youtube";
  if (!u && /^(apps\.apple\.com|itunes\.apple\.com|play\.google\.com)$/.test(h)) return "lojas";
  if (/^(google|gbp|gmb)$/.test(u) || (!u && /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h))) return "google";
  if (!u && /(^|\.)(bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org|brave\.com)$/.test(h)) return "busca";
  if (!u && /^(zaprouteapp\.com|viavista\.pages\.dev|emanuelpool\.com)$/.test(h)) return "nossos-sites";
  return "outro";
}
function linkDoPlay(href, origem, pagina) {
  if (!/^https:\/\/play\.google\.com\/store\/apps\/details\?id=[\w.]+$/.test(href)) return href;
  return href + "&referrer=" + encodeURIComponent("utm_source=" + origem + "&utm_medium=site&utm_campaign=" + pagina);
}
function linkDaApple(href, pt, origem, pagina) {
  if (!pt || !/^https:\/\/apps\.apple\.com\/app\/id\d+$/.test(href)) return href;
  return href + "?pt=" + pt + "&ct=" + (origem + "-" + pagina).slice(0, 30) + "&mt=8";
}
function ligar(w, urlContagem, applePt) {
  var d = w.document, pagina = d.body && d.body.getAttribute("data-pagina");
  if (!pagina || !urlContagem) return;
  if (/bot|crawl|spider|headless|lighthouse/i.test(w.navigator.userAgent || "")) return;
  var conferindo = false;
  try { conferindo = new URLSearchParams(w.location.search).has("eu"); } catch (e) {}
  var origem = origemDe(w.location.search, d.referrer);
  try {
    if (origem === "") origem = w.sessionStorage.getItem("origem") || "direto";
    else w.sessionStorage.setItem("origem", origem);
  } catch (e) { if (origem === "") origem = "direto"; }
  function idioma() { return d.documentElement.className === "l-pt" ? "pt" : "en"; }
  function contar(evento, app) {
    var dados = { p: pagina, i: idioma(), o: origem, e: evento, a: app || "" };
    if (conferindo) dados.eu = 1;
    var corpo = JSON.stringify(dados);
    try {
      if (!(w.navigator.sendBeacon && w.navigator.sendBeacon(urlContagem, corpo))) w.fetch(urlContagem, { method: "POST", body: corpo, keepalive: true }).catch(function () {});
    } catch (e) { /* contar nunca pode quebrar a pagina */ }
  }
  contar("visita");
  var selos = d.querySelectorAll("a[data-loja]");
  for (var k = 0; k < selos.length; k++) (function (a) {
    var loja = a.getAttribute("data-loja"), app = a.getAttribute("data-app");
    a.href = loja === "play" ? linkDoPlay(a.href, origem, pagina) : linkDaApple(a.href, applePt, origem, pagina);
    a.addEventListener("click", function () { contar(loja, app); });
  })(selos[k]);
  var estradas = d.querySelectorAll(".vr-lista a, .vr-todas");
  for (var j = 0; j < estradas.length; j++) estradas[j].addEventListener("click", function () { contar("estrada", "viavista"); });
}
ligar(window, "https://emanuelpools-contagem.pages.dev/evento", "129389990");
})();
