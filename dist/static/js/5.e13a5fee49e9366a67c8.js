webpackJsonp([5],{"I8/t":function(t,e){},K2Tl:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("Xxa5"),a=n.n(r),c=n("exGp"),s=n.n(c),o=n("//Fk"),i=n.n(o),u=n("PJh5"),l=n("msXN");n("ORgI"),u.locale("ja");var h={data:function(){return{langArray:["ja","en"],currentLangIndex:0,locale:{tourNumber:{ja:"ツアーNo",en:"Tour No."},entranceTime:{ja:"入場受付時間",en:"Entrance Time"},pleasePrepare:{ja:"入場用QRコードを準備してお待ち下さい",en:"Please prepare to show your QR code for entrance."}},currentPerformanceArray:[],timeoutInstance_IntervalFetch:null,timeoutInstance_changeLang:null}},computed:{currentLang:function(){return this.langArray[this.currentLangIndex]}},methods:{fetchScheduleStatus:l.a,getNextTickUnixtime:l.b,manipulateScheduleData:l.d,getCurrentPerformance:function(){var t,e=this;return new i.a((t=s()(a.a.mark(function t(n){var r,c;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,r=u().minute(0).second(0),t.next=4,e.fetchScheduleStatus({startFrom:r.toISOString(),startThrough:r.minute(59).second(59).toISOString()});case 4:c=t.sent,e.currentPerformanceArray=e.manipulateScheduleData(c,{setGateEndTime:!0}).filter(function(t){return u().isBetween(u(t.startDate),u(t.endDate).add(5,"minute"))}),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),console.log(t.t0);case 11:return t.abrupt("return",n());case 12:case"end":return t.stop()}},t,e,[[0,8]])})),function(e){return t.apply(this,arguments)}))},setFetchStatusDataInterval:function(){var t=this;this.timeoutInstance_IntervalFetch=setTimeout(function(){t.getCurrentPerformance().then(function(){t.setFetchStatusDataInterval()})},this.getNextTickUnixtime())},setChangeLangTimeout:function(t){var e=this;this.timeoutInstance_changeLang=setTimeout(function(){e.currentLangIndex++,e.currentLangIndex>e.langArray.length-1?(e.currentLangIndex=0,e.setChangeLangTimeout(1e4)):e.setChangeLangTimeout()},t||5e3)}},created:function(){var t=this;this.$store.commit("SET_LOADINGMSG","初期化中(トップデッキゲート)"),this.getCurrentPerformance().then(function(){t.$store.commit("CLEAR_LOADINGMSG"),t.setFetchStatusDataInterval(),t.setChangeLangTimeout(1e4)})},beforeDestroy:function(){clearTimeout(this.timeoutInstance_IntervalFetch),clearTimeout(this.timeoutInstance_changeLang)}},m={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"fadeup"}},[n("div",{class:["container","container-checkintime","lang-"+t.currentLang,{onerror:t.$store.state.errorMsgStr}]},[t.$store.state.errorMsgStr?n("errorOneline",{attrs:{errorMsgStr:"データ取得エラーが発生しています "+t.$store.state.errorMsgStr}}):t._e(),t._v(" "),t._m(0),t._v(" "),n("table",{staticClass:"table-tours"},[n("thead",[n("tr",[n("th",[t._v(t._s(t.locale.tourNumber[t.currentLang]))]),n("th",[t._v(t._s(t.locale.entranceTime[t.currentLang]))])])]),t._v(" "),n("tbody",t._l(t.currentPerformanceArray,function(e){return e.id?n("tr",{key:e.id},[n("td",[t._v(t._s(e.tour_number))]),n("td",[t._v(t._s(e.start_time)+" ～ "+t._s(e.end_time))])]):t._e()})),t._v(" "),n("tfoot",[n("tr",[n("td",{attrs:{colspan:"2"}},[t._v(t._s(t.locale.pleasePrepare[t.currentLang]))])])])])],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("header",[e("div",{staticClass:"inner"},[e("div",{staticClass:"iconwrapper"},[e("shine-icon",{staticClass:"logo"})],1),this._v(" "),e("div",{staticClass:"clockwrapper"},[e("clock",{staticClass:"icon-clock"})],1)])])}]};var g=n("VU/8")(h,m,!1,function(t){n("I8/t")},"data-v-1b26fd75",null);e.default=g.exports}});