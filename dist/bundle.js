module.exports=function(e){function t(a){if(i[a])return i[a].exports;var n=i[a]={exports:{},id:a,loaded:!1};return e[a].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t,i){e.exports=i(1)},function(e,t,i){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function n(e){return(0,p.default)(e)?e:[e]}function r(e,t){var i=t.camelizeKeys,a={};return(0,v.default)(e).forEach(function(t){var n=e[t],r=i?(0,f.default)(t):t;a[r]=[],"undefined"!=typeof n.data&&((0,p.default)(n.data)?a[r]=n.data.map(function(e){return e.id}):(0,h.default)(n.data)||(a[r]=[n.data.id]))}),a}function u(e,t){var i=t.camelizeKeys,a={};return n(e).forEach(function(e){var t=i?(0,f.default)(e.type):e.type;a[t]=a[t]||{},a[t][e.id]=a[t][e.id]||{id:e.id},i?(a[t][e.id].attributes={},(0,v.default)(e.attributes).forEach(function(i){a[t][e.id].attributes[(0,f.default)(i)]=e.attributes[i]})):a[t][e.id].attributes=e.attributes,e.links&&(a[t][e.id].links={},(0,v.default)(e.links).forEach(function(i){a[t][e.id].links[i]=e.links[i]})),e.relationships&&(a[t][e.id].relationships=r(e.relationships,{camelizeKeys:i}))}),a}function d(e){return e.replace(/\?.*$/,"")}function l(e,t,i){var a=i.camelizeKeys,u=i.filterEndpoint,l={};l.meta={};var s=void 0;if(u)l.meta[t]={},s=l.meta[t];else{var o=d(t);l.meta[o]={},l.meta[o][t.slice(o.length)]={},s=l.meta[o][t.slice(o.length)]}if(s.data={},e.data){var c=[];n(e.data).forEach(function(e){var t={id:e.id,type:a?(0,f.default)(e.type):e.type};e.relationships&&(t.relationships=r(e.relationships,{camelizeKeys:a})),c.push(t)}),s.data=c,e.links&&(s.links=e.links,l.meta[d(t)].links=e.links),e.meta&&(s.meta=e.meta)}return l}function s(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i={},a=t.endpoint,n=t.filterEndpoint,r=t.camelizeKeys;if("undefined"==typeof n&&(n=!0),"undefined"==typeof r&&(r=!0),e.data&&(0,k.default)(i,u(e.data,{camelizeKeys:r})),e.included&&(0,k.default)(i,u(e.included,{camelizeKeys:r})),a){var s=n?d(a):a;(0,k.default)(i,l(e,s,{camelizeKeys:r,filterEndpoint:n}))}return i}Object.defineProperty(t,"__esModule",{value:!0}),t.default=s;var o=i(2),f=a(o),c=i(3),p=a(c),m=i(4),h=a(m),y=i(5),v=a(y),x=i(6),k=a(x)},function(e,t){e.exports=require("lodash/camelCase")},function(e,t){e.exports=require("lodash/isArray")},function(e,t){e.exports=require("lodash/isNull")},function(e,t){e.exports=require("lodash/keys")},function(e,t){e.exports=require("lodash/merge")}]);