webpackJsonp([4],{CYaw:function(e,t){},zPSQ:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("Xxa5"),a=n.n(r),c=n("exGp"),s=n.n(c),i=n("//Fk"),o=n.n(i),u=n("PJh5"),l=n("Uq/N");n("ORgI"),u.locale("ja");var h={data:function(){return{langArray:["ja","en"],currentLangIndex:0,locale:{tourNumber:{ja:"ツアーNo",en:"Tour No."},entranceTime:{ja:"入場受付時間",en:"Entrance Time"},pleasePrepare:{ja:"入場用QRコードを準備してお待ち下さい",en:"Please prepare to show your QR code for entrance."}},currentPerformanceArray:[],timeoutInstance_IntervalFetch:null,timeoutInstance_changeLang:null}},computed:{currentLang:function(){return this.langArray[this.currentLangIndex]}},methods:{fetchScheduleStatus:l.a,getNextTickUnixtime:l.b,manipulateScheduleData:l.d,getCurrentPerformance:function(){var e,t=this;return new o.a((e=s()(a.a.mark(function e(n){var r,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r=u().minute(0).second(0).milliseconds(0),e.next=4,t.fetchScheduleStatus({startFrom:r.toISOString(),startThrough:r.minute(59).second(59).toISOString()});case 4:c=e.sent,t.currentPerformanceArray=t.manipulateScheduleData(c,{setGateEndTime:!0}).filter(function(e){return u().isBetween(u(e.startDate),u(e.endDate).add(5,"minute"))}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log(e.t0);case 11:return e.abrupt("return",n());case 12:case"end":return e.stop()}},e,t,[[0,8]])})),function(t){return e.apply(this,arguments)}))},setFetchStatusDataInterval:function(){var e=this;clearTimeout(this.timeoutInstance_IntervalFetch),this.timeoutInstance_IntervalFetch=setTimeout(function(){e.getCurrentPerformance().then(function(){e.setFetchStatusDataInterval()})},this.getNextTickUnixtime())},setChangeLangTimeout:function(e){var t=this;clearTimeout(this.timeoutInstance_changeLang),this.timeoutInstance_changeLang=setTimeout(function(){t.currentLangIndex++,t.currentLangIndex>t.langArray.length-1?(t.currentLangIndex=0,t.setChangeLangTimeout(1e4)):t.setChangeLangTimeout(),t.$emit("langChanged")},e||5e3)}},created:function(){var e=this;this.$store.commit("SET_LOADINGMSG","読み込み中"),this.getCurrentPerformance().then(function(){e.$store.commit("CLEAR_LOADINGMSG"),e.setFetchStatusDataInterval(),e.setChangeLangTimeout(1e4)})},beforeDestroy:function(){clearTimeout(this.timeoutInstance_IntervalFetch),clearTimeout(this.timeoutInstance_changeLang)}},m={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"fadeup"}},[n("div",{class:["container","container-checkintime","lang-"+e.currentLang,{onerror:e.$store.state.errorMsgStr}]},[e.$store.state.errorMsgStr?n("errorOneline",{attrs:{errorMsgStr:"データ取得エラーが発生しています "+e.$store.state.errorMsgStr}}):e._e(),e._v(" "),e._m(0),e._v(" "),n("table",{staticClass:"table-tours"},[n("thead",[n("tr",[n("th",[e._v(e._s(e.locale.tourNumber[e.currentLang]))]),n("th",[e._v(e._s(e.locale.entranceTime[e.currentLang]))])])]),e._v(" "),n("tbody",[e.currentPerformanceArray.length?e._e():n("tr",[n("td"),n("td")]),e._v(" "),e._l(e.currentPerformanceArray,function(t){return t.id?n("tr",{key:t.id},[n("td",[e._v(e._s(t.tour_number))]),n("td",[e._v(e._s(t.start_time)+" ～ "+e._s(t.end_time))])]):e._e()})],2),e._v(" "),n("tfoot",[n("tr",[n("td",{attrs:{colspan:"2"}},[e._v(e._s(e.locale.pleasePrepare[e.currentLang]))])])])])],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("header",[t("div",{staticClass:"inner"},[t("div",{staticClass:"iconwrapper"},[t("shine-icon",{staticClass:"logo",attrs:{targetEvent:"langChanged"}})],1),this._v(" "),t("div",{staticClass:"clockwrapper"},[t("clock",{staticClass:"icon-clock"})],1)])])}]};var g=n("VU/8")(h,m,!1,function(e){n("CYaw")},"data-v-6335e298",null);t.default=g.exports}});