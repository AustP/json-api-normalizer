import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import keys from 'lodash/keys';
import merge from 'lodash/merge';

function wrap(json) {
  if (isArray(json)) {
    return json;
  }

  return [json];
}

function extractRelationships(relationships, { camelizeKeys }) {
  const ret = {};
  keys(relationships).forEach((key) => {
    const relationship = relationships[key];
    const name = camelizeKeys ? camelCase(key) : key;
    ret[name] = [];

    if (typeof relationship.data !== 'undefined') {
      if (isArray(relationship.data)) {
        ret[name] = relationship.data.map(e => e.id);
      } else if (!isNull(relationship.data)) {
        ret[name] = [relationship.data.id];
      }
    }
  });
  return ret;
}

function extractEntities(json, { camelizeKeys }) {
  const ret = {};

  wrap(json).forEach((elem) => {
    const type = camelizeKeys ? camelCase(elem.type) : elem.type;

    ret[type] = ret[type] || {};
    ret[type][elem.id] = ret[type][elem.id] || {
      id: elem.id,
    };

    if (camelizeKeys) {
      ret[type][elem.id].attributes = {};

      keys(elem.attributes).forEach((key) => {
        ret[type][elem.id].attributes[camelCase(key)] = elem.attributes[key];
      });
    } else {
      ret[type][elem.id].attributes = elem.attributes;
    }

    if (elem.links) {
      ret[type][elem.id].links = {};

      keys(elem.links).forEach((key) => {
        ret[type][elem.id].links[key] = elem.links[key];
      });
    }

    ret[type][elem.id].relationships = elem.relationships ?
      extractRelationships(elem.relationships, { camelizeKeys }) :
      {};
  });

  return ret;
}

function doFilterEndpoint(endpoint) {
  return endpoint.replace(/\?.*$/, '');
}

function extractMetaData(json, endpoint, { camelizeKeys, filterEndpoint }) {
  const ret = {};

  ret.meta = {};

  let metaObject;

  if (!filterEndpoint) {
    const filteredEndpoint = doFilterEndpoint(endpoint);

    ret.meta[filteredEndpoint] = {};
    ret.meta[filteredEndpoint][endpoint.slice(filteredEndpoint.length)] = {};
    metaObject = ret.meta[filteredEndpoint][endpoint.slice(filteredEndpoint.length)];
  } else {
    ret.meta[endpoint] = {};
    metaObject = ret.meta[endpoint];
  }

  metaObject.data = {};

  if (json.data) {
    const meta = [];

    wrap(json.data).forEach((object) => {
      const pObject = { id: object.id, type: camelizeKeys ? camelCase(object.type) : object.type };

      pObject.relationships = object.relationships ?
        extractRelationships(object.relationships, { camelizeKeys }) :
        {};

      meta.push(pObject);
    });

    metaObject.data = meta;

    if (json.links) {
      metaObject.links = json.links;
      ret.meta[doFilterEndpoint(endpoint)].links = json.links;
    }

    if (json.meta) {
      metaObject.meta = json.meta;
    }
  }

  return ret;
}

export default function normalize(json, opts = {}) {
  const ret = {};
  const { endpoint } = opts;
  let { filterEndpoint, camelizeKeys } = opts;

  if (typeof filterEndpoint === 'undefined') {
    filterEndpoint = true;
  }

  if (typeof camelizeKeys === 'undefined') {
    camelizeKeys = true;
  }

  if (json.data) {
    merge(ret, extractEntities(json.data, { camelizeKeys }));
  }

  if (json.included) {
    merge(ret, extractEntities(json.included, { camelizeKeys }));
  }

  if (endpoint) {
    const endpointKey = filterEndpoint ? doFilterEndpoint(endpoint) : endpoint;

    merge(ret, extractMetaData(json, endpointKey, { camelizeKeys, filterEndpoint }));
  }

  return ret;
}
