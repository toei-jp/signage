webpackJsonp([7],{"+/9L":function(t,e){},M93x:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={components:{Loading:n("NxGh").default},computed:{verticalClassName:function(){return this.$route.meta.vertical?this.$route.query.rightTop?"vertical-rightTop":"vertical":""}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{class:[this.verticalClassName],attrs:{id:"app"}},[this.$store.state.loadingMsg?e("loading"):this._e(),this._v(" "),e("transition",{attrs:{name:"fadeup"}},[e("router-view")],1)],1)},staticRenderFns:[]};var i=n("VU/8")(a,r,!1,function(t){n("TKXc")},null,null);e.default=i.exports},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});n("MU8w"),n("JUaF");var a=n("7+uW"),r=n("Xxa5"),i=n.n(r),o=n("fZjL"),s=n.n(o),c=n("pFYg"),u=n.n(c),l=n("exGp"),p=n.n(l),m=n("//Fk"),d=n.n(m),h=n("NYxO"),f=n("mtWM"),v=n("PJh5");a.a.use(h.a);var g=new h.a.Store({strict:!1,modules:{},state:{moment:v(),APPCONFIG:{},errorMsgStr:"",loadingMsg:"",scheduleStatus:[]},mutations:{SET_APPCONFIG:function(t,e){t.APPCONFIG=e},SET_ERRORMSG:function(t,e){t.errorMsgStr=e},CLEAR_ERRORMSG:function(t){t.errorMsgStr=""},SET_LOADINGMSG:function(t,e){t.loadingMsg=e},CLEAR_LOADINGMSG:function(t){t.loadingMsg=""},SET_SCHEDULESTATUS:function(t,e){t.scheduleStatus=e},UPDATE_MOMENTOBJ:function(t){t.moment=v()}},actions:{FETCH_APPCONFIG:function(t){var e,n=this,a=t.commit;return new d.a((e=p()(i.a.mark(function t(e,r){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:f.get("/static/config/prd.php").then(function(t){return"object"!==u()(t.data)||s()(t.data).some(function(e){return!t.data[e]||!t.data[e][0]})?r():(a("SET_APPCONFIG",t.data),e(t.data))}).catch(function(t){return console.error(t),r()});case 1:case"end":return t.stop()}},t,n)})),function(t,n){return e.apply(this,arguments)}))},QUIT:function(){var t,e=this;return new d.a((t=p()(i.a.mark(function t(n){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:window.location.href=window.location.href.split("#")[0],n();case 2:case"end":return t.stop()}},t,e)})),function(e){return t.apply(this,arguments)}))}}}),_=n("/ocq");a.a.use(_.a);var y=new _.a({routes:[{name:"home",path:"/",component:function(t){return n.e(5).then(function(){var e=[n("HXef")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"東京タワー サイネージ画面一覧"}},{name:"todaytdt",path:"/todaytdt",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"1fticket",title:"東京タワー 「トップデッキツアー 本日のチケット」",noclock:!0}},{name:"info",path:"/info",component:function(t){return Promise.all([n.e(1),n.e(2)]).then(function(){var e=[n("PdC8")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"1fticket",title:"東京タワー トップデッキツアー チケット空き状況"}},{name:"guide_lane",path:"/guide/lane",component:function(t){return Promise.all([n.e(1),n.e(3)]).then(function(){var e=[n("/FVY")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"lane",title:"東京タワー 入場案内 トップデッキレーン",vertical:!0}},{name:"guide_gate",path:"/guide/gate",component:function(t){return Promise.all([n.e(1),n.e(4)]).then(function(){var e=[n("K2Tl")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"gate",title:"東京タワー 入場案内 トップデッキゲート"}},{name:"suspend",path:"/suspend",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"suspend",title:"東京タワー トップデッキツアー休止中"}},{name:"suspend.vertical",path:"/vertical/suspend",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"suspend",title:"東京タワー トップデッキツアー休止中 (縦)",vertical:!0}},{name:"suspend.vertical",path:"/vertical/suspend?rightTop=true",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"suspend",title:"東京タワー トップデッキツアー休止中 (縦-右回転)",vertical:!0}},{name:"closed",path:"/closed",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"closed",title:"東京タワー トップデッキツアー受付終了"}},{name:"closed.vertical",path:"/vertical/closed",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"closed",title:"東京タワー トップデッキツアー受付終了 (縦)",vertical:!0}},{name:"closed.vertical",path:"/vertical/closed?rightTop=true",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"closed",title:"東京タワー トップデッキツアー受付終了 (縦-右回転)",vertical:!0}},{name:"sleep",path:"/sleep",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"sleep",title:"東京タワー 営業時間外"}},{name:"sleep.vertical",path:"/vertical/sleep",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"sleep",title:"東京タワー 営業時間外 (縦)",vertical:!0}},{name:"sleep.vertical",path:"/vertical/sleep?rightTop=true",component:function(t){return n.e(0).then(function(){var e=[n("lUU6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{group:"sleep",title:"東京タワー 営業時間外 (縦-右回転)",vertical:!0}}]});y.beforeEach(function(t,e,n){return window.document.title=t.meta.title,n()}),y.afterEach(function(){g.commit("CLEAR_LOADINGMSG")});var M=y;a.a.component("ErrorOneline",n("c4AS").default),a.a.component("Clock",n("VWS/").default),a.a.component("ShineIcon",n("WT56").default),g.dispatch("FETCH_APPCONFIG").then(function(t){console.log("APPCONFIG",t),new a.a({el:"#VueApp",router:M,store:g,render:function(t){return t(n("M93x").default)}})}).catch(function(){return alert("CONFIG LOAD ERROR")})},NxGh:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("transition",{attrs:{name:"loading"}},[e("div",{class:["loading-mask",{"loading-mask-vertical":this.$route.meta.vertical}]},[e("div",{staticClass:"loading-wrapper"},[e("div",{staticClass:"loading-container"},[e("div",{staticClass:"loading-header"},[e("h3",[this._v(this._s(this.$store.state.loadingMsg))])]),this._v(" "),this._m(0)])])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"loading-body"},[e("div",{staticClass:"v-spinner"},[e("div",{staticClass:"v-ring v-ring1"},[e("div",{staticClass:"v-ring v-ring2"}),this._v(" "),e("div",{staticClass:"v-ring v-ring3"})])])])}]};var r=n("VU/8")({},a,!1,function(t){n("bhqT")},"data-v-1524ae60",null);e.default=r.exports},TKXc:function(t,e){},"VWS/":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("PJh5"),r=n.n(a),i={data:function(){return{moment_now:r()(),timeoutInstance_updateMoment:null}},computed:{HH:function(){return this.moment_now.format("HH")},mm:function(){return this.moment_now.format("mm")}},methods:{getNextTickUnixtime:n("msXN").b,setTimeoutUpdateMoment:function(){var t=this;this.timeoutInstance_updateMoment=setTimeout(function(){t.moment_now=r()(),t.setTimeoutUpdateMoment()},this.getNextTickUnixtime())}},created:function(){this.setTimeoutUpdateMoment()},beforeDestroy:function(){clearTimeout(this.timeoutInstance_updateMoment)}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"clock"},[e("span",[this._v(this._s(this.HH)),e("span",{staticClass:"colon"},[this._v(":")]),this._v(this._s(this.mm))])])},staticRenderFns:[]};var s=n("VU/8")(i,o,!1,function(t){n("+/9L")},null,null);e.default=s.exports},WT56:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("Xxa5"),r=n.n(a),i=n("exGp"),o=n.n(i),s=n("//Fk"),c=n.n(s),u=n("mtWM"),l=n("fGqP"),p=n.n(l),m={props:{targetEvent:{type:String,required:!1,default:""},intervalMsIfNoEvent:{type:Number,required:!1,default:15e3}},data:function(){return{apng:null,ctx:null,ctxplayer:null,timeout_resize:null,timeout_play:null}},methods:{resizeCanvas:function(){var t=this;return!!this.apng&&(clearTimeout(this.timeout_resize),this.timeout_resize=setTimeout(function(){var e=window.getComputedStyle(t.$refs.image,null),n={width:parseInt(e.width.replace("px",""),10),height:parseInt(e.height.replace("px",""),10)};t.$refs.canvas.setAttribute("width",n.width),t.$refs.canvas.setAttribute("height",n.height),t.ctx.scale(n.width/t.apng.width,n.height/t.apng.height),t.playAPNG()},200),!1)},loadAPNG:function(){var t,e=this;return new c.a((t=o()(r.a.mark(function t(n,a){var i;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.get("/static/images/logo_animated.png",{responseType:"arraybuffer"});case 3:return i=t.sent,e.apng=p()(i.data),e.ctx=e.$refs.canvas.getContext("2d"),t.next=8,e.apng.getPlayer(e.ctx);case 8:return e.ctxplayer=t.sent,e.resizeCanvas(),t.abrupt("return",n());case 13:return t.prev=13,t.t0=t.catch(0),console.log(t.t0),t.abrupt("return",a());case 17:case"end":return t.stop()}},t,e,[[0,13]])})),function(e,n){return t.apply(this,arguments)}))},playAPNG:function(){this.ctxplayer.stop(),this.ctxplayer.play()},init:function(){var t=this;this.loadAPNG().then(function(){t.targetEvent?t.$parent.$on("langChanged",t.playAPNG):t.ctxplayer.on("end",function(){clearTimeout(t.timeout_play),t.timeout_play=setTimeout(t.playAPNG,t.intervalMsIfNoEvent)}),t.playAPNG()}).catch(function(){t.$refs.image.style.opacity=1,t.$refs.canvas.outerHTML=""})}},mounted:function(){window.addEventListener("resize",this.resizeCanvas,!1)},beforeDestroy:function(){window.removeEventListener("resize",this.resizeCanvas),clearTimeout(this.timeout_resize),clearTimeout(this.timeout_play),this.$parent.$off("langChanged",this.playAPNG)}},d={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{staticClass:"shineicon"},[n("img",{ref:"image",attrs:{src:"/static/images/logo-tdt.svg"},on:{"~load":function(e){return t.init(e)}}}),t._v(" "),n("canvas",{ref:"canvas"})])}]};var h=n("VU/8")(m,d,!1,function(t){n("ZXxm")},null,null);e.default=h.exports},ZXxm:function(t,e){},bhqT:function(t,e){},c4AS:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={props:{errorMsgStr:{type:String,required:!0}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"error-oneline"},[e("div",[e("p",[this._v(this._s(this.errorMsgStr))])])])},staticRenderFns:[]};var i=n("VU/8")(a,r,!1,function(t){n("dxW2")},null,null);e.default=i.exports},dxW2:function(t,e){},msXN:function(t,e,n){"use strict";e.b=function(){var t=new Date;return new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes()+1,0,0)-t},e.c=function(t,e){if(e.unavailable)return"item-unavailable";var n="",a=t.format("YYYY-MM-DD");if(!e.is_avg&&(t.isBetween(a+" "+e.start_time+":00",a+" "+e.end_time+":59")&&(n+="item-current"),t.isAfter(a+" "+e.end_time+":59")))return n+" item-soldout";var r=parseInt(e.seat_status,10)||0;if(r<s&&r>0)return n+" item-crowded";if(0===r)return n+" item-soldout";return n+" item-capable"},e.a=function(t){var e=this,n=this.$store.state.APPCONFIG;return t.now=Date.now(),new r.a(function(a){i.get(n.API_STATUS_ENDPOINT,{params:t,timeout:n.API_TIMEOUT}).then(function(t){e.$store.commit("UPDATE_MOMENTOBJ");var n="";return Array.isArray(t.data)||(n="("+e.$store.state.moment.format("HH:mm:ss")+") [取得データ異常]"),n?e.$store.commit("SET_ERRORMSG",n):e.$store.commit("CLEAR_ERRORMSG"),a(t.data.sort(function(t,e){return t.startDate<e.startDate?-1:t.startDate>e.startDate?1:0}))}).catch(function(t){return console.log(t),e.$store.commit("UPDATE_MOMENTOBJ"),e.$store.commit("SET_ERRORMSG","("+e.$store.state.moment.format("HH:mm:ss")+") [通信エラー][ステータス取得] "+t.message),a([])})})},e.d=function(t,e){if(!Array.isArray(t))return[];var n=e||{};return t.map(function(t){var e=o(t.startDate),a=o(t.endDate);return n.setGateEndTime&&a.add(5,"minute"),{id:t.id,day:e.format("YYYYMMDD"),hour:e.format("HH"),start_time:e.format("HH:mm"),end_time:a.format("HH:mm"),startDate:t.startDate,endDate:t.endDate,seat_status:t.remainingAttendeeCapacity,tour_number:t.tourNumber,unavailable:"Normal"!==t.evServiceStatus||"Normal"!==t.onlineSalesStatus}})};var a=n("//Fk"),r=n.n(a),i=n("mtWM"),o=(n.n(i),n("PJh5"));n.n(o);var s=10}},["NHnr"]);