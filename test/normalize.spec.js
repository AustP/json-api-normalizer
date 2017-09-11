import { expect } from 'chai';
import normalize from '../dist/bundle';
import isEqual from 'lodash/isEqual';

describe('data is normalized', () => {
  const json = {
    data: [
      {
        type: 'post',
        id: 3,
        attributes: {
          text: 'hello',
          number: 3,
        },
        links: {
          self: 'http://www.example.com/post/3'
        }
      },
      {
        type: 'post',
        id: 4,
        attributes: {
          text: 'hello world',
          number: 4,
        },
        links: {
          self: 'http://www.example.com/post/4'
        }
      }
    ]
  };

  const output = {
    post: {
      "3": {
        id: 3,
        attributes: {
          text: 'hello',
          number: 3
        },
        links: {
          self: 'http://www.example.com/post/3'
        },
        relationships: {}
      },
      "4": {
        id: 4,
        attributes: {
          text: 'hello world',
          number: 4
        },
        links: {
          self: 'http://www.example.com/post/4'
        },
        relationships: {}
      }
    }
  };

  it('data attributes => map: %{id => Object}', () => {
    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('data is empty shouldn\'t fail', () => {
    const result = normalize({});

    expect(isEqual(result, {})).to.be.true;
  });

  it('keys camelized', () => {
    const input = {
      data: [{
        type: 'post',
        id: 1,
        attributes: {
          'key-is-camelized': 2
        }
      }]
    }

    const camelizedOutput = {
      post: {
        "1": {
          id: 1,
          attributes: {
            keyIsCamelized: 2
          },
          relationships: {}
        }
      }
    };

    expect(isEqual(normalize(input), camelizedOutput)).to.be.true;
  });
});

describe('included is normalized', () => {
  const json = {
    included: [
      {
        type: 'post',
        id: 3,
        attributes: {
          text: 'hello',
          number: 3,
        }
      },
      {
        type: 'post',
        id: 4,
        attributes: {
          text: 'hello world',
          number: 4,
        }
      }
    ]
  };

  const json2 = {
    included: [
      {
        type: 'post',
        id: 3,
        attributes: {
          text: 'hello',
          number: 3,
        },
        relationships: {}
      }
    ],
    data: [
      {
        type: 'post',
        id: 4,
        attributes: {
          text: 'hello world',
          number: 4,
        },
        relationships: {}
      }
    ]
  };

  const output = {
    post: {
      "3": {
        id: 3,
        attributes: {
          text: 'hello',
          number: 3
        },
        relationships: {}
      },
      "4": {
        id: 4,
        attributes: {
          text: 'hello world',
          number: 4
        },
        relationships: {}
      }
    }
  };

  it('included => map: %{id => Object}', () => {
    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('data & included => map: %{id => Object}', () => {
    const result = normalize(json2);

    expect(isEqual(result, output)).to.be.true;
  });
});

describe('relationships', () => {
  it('empty to-one', () => {
    const json = {
      data: [{
        "type": "post",
        "relationships": {
          "question": {
            "data": null,
          }
        },
        "id": 2620,
        "attributes": {
          "text": "hello",
        }
      }]
    };

    const output = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            text: "hello",
          },
          relationships: {
            question: []
          }
        }
      }
    }

    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('empty to-many', () => {
    const json = {
      data: [{
        "type": "post",
        "relationships": {
          "tags": {
            "data": [],
          }
        },
        "id": 2620,
        "attributes": {
          "text": "hello",
        }
      }]
    };

    const output = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            text: "hello",
          },
          relationships: {
            tags: []
          }
        }
      }
    }

    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('non-empty to-one', () => {
    const json = {
      data: [{
        "type": "post",
        "relationships": {
          "question": {
            "data": {
              "id": 7,
              "type": "question"
            },
          }
        },
        "id": 2620,
        "attributes": {
          "text": "hello",
        }
      }]
    };

    const output = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            text: "hello",
          },
          relationships: {
            question: [7]
          }
        }
      }
    }

    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('non-empty to-many', () => {
    const json = {
      data: [{
        "type": "post",
        "relationships": {
          "tags": {
            "data": [{
              "id": 4,
              "type": "tag"
            }],
          }
        },
        "id": 2620,
        "attributes": {
          "text": "hello",
        }
      }]
    };

    const output = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            text: "hello",
          },
          relationships: {
            tags: [4]
          }
        }
      }
    }

    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });

  it('keys camelized', () => {
    const json = {
      data: [{
        "type": "post",
        "relationships": {
          "rel1-to-camelize": {
            "data": [{
              "id": 4,
              "type": "type1-to-camelize"
            }],
          },
          "rel2-to-camelize": {
            "data": [],
          },
          "rel3-to-camelize": {
            "data": {
              "id": 4,
              "type": "type3-to-camelize"
            },
          },
          "rel4-to-camelize": {
            "data": null,
          }
        },
        "id": 2620,
        "attributes": {
          "text": "hello",
        }
      }]
    };

    const output = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            text: "hello",
          },
          relationships: {
            rel1ToCamelize: [4],
            rel2ToCamelize: [],
            rel3ToCamelize: [4],
            rel4ToCamelize: []
          }
        }
      }
    }

    const result = normalize(json);

    expect(isEqual(result, output)).to.be.true;
  });
});

describe('meta', () => {
  const json = {
    data: [{
      "type": "post",
      "relationships": {
        "question": {
          "data": {
            "type": "question",
            "id": "295"
          }
        }
      },
      "id": 2620,
      "attributes": {
        "text": "hello",
      }
    }]
  };

  const output = {
    post: {
      "2620": {
        id: 2620,
        attributes: {
          "text": "hello",
        },
        relationships: {
          question: ["295"]
        }
      }
    },
    meta: {
      'posts/me': {
        data: [{
          id: 2620,
          type: 'post',
          relationships: {
            question: ['295']
          }
        }]
      }
    }
  }

  const json2 = {
    data: [{
      "type": "post",
      "relationships": {
        "question": {
          "data": {
            "type": "question",
            "id": "295"
          }
        }
      },
      "id": 2620,
      "attributes": {
        "text": "hello",
      }
    }],
    links: {
      next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
      first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
    }
  };

  const output2 = {
    post: {
      "2620": {
        "id": 2620,
        attributes: {
          "text": "hello",
        },
        relationships: {
          question: ["295"]
        }
      }
    },
    meta: {
      'posts/me': {
        data: [{
          type: 'post',
          id: 2620,
          relationships: {
            question: ['295']
          }
        }],
        links: {
          next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
          first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
        }
      }
    }
  };

  const output3 = {
    post: {
      "2620": {
        id: 2620,
        attributes: {
          "text": "hello",
        },
        relationships: {
          question: ["295"]
        }
      }
    },
    meta: {
      'posts/me': {
        '?some=query': {
          data: [{
            type: 'post',
            id: 2620,
            relationships: {
              question: ['295']
            }
          }],
          links: {
            next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
            first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
          },
        },
        links: {
          next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
          first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
        }
      }
    }
  };

  it('meta, no links', () => {
    const result = normalize(json, { endpoint: 'posts/me' });

    expect(isEqual(result, output)).to.be.true;
  });

  it('meta, with links', () => {
    const result = normalize(json2, { endpoint: 'posts/me' });

    expect(isEqual(result, output2)).to.be.true;
  });

  it('meta, filter works', () => {
    const result = normalize(json2, { endpoint: 'posts/me?some=query' });

    expect(isEqual(result, output2)).to.be.true;
  });

  it('meta, disable filter option works', () => {
    const result = normalize(json2, { endpoint: 'posts/me?some=query', filterEndpoint: false });

    expect(isEqual(result, output3)).to.be.true;
  });

  it('meta, meta is provided by JSON API service', () => {
    const json3 = {
      data: [{
        "type": "post",
        "relationships": {
          "question": {
            "data": {
              "type": "question",
              "id": "295"
            }
          }
        },
        id: 2620,
        "attributes": {
          "text": "hello",
        }
      }],
      meta: {
        next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
        first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
      }
    };

    const output3 = {
      post: {
        "2620": {
          id: 2620,
          attributes: {
            "text": "hello",
          },
          relationships: {
            question: ["295"]
          }
        }
      },
      meta: {
        'posts/me': {
          data: [{
            type: 'post',
            id: 2620,
            relationships: {
              question: ['295']
            }
          }],
          meta: {
            next: "http://example.com/api/v1/posts/friends_feed/superyuri?page[cursor]=5037",
            first: "http://api.postie.loc/v1/posts/friends_feed/superyuri?page[cursor]=0"
          }
        }
      }
    };

    expect(isEqual(normalize(json3, { endpoint: 'posts/me' }), output3)).to.be.true;
  });

  it('empty collection', () => {
    const emptyJson = {
      "data": [{
        "type": "post",
        "id": 1,
        "attributes": {
          "text": "hello"
        },
        "relationships": {
          "comments": {
            "data": []
          }
        }
      }]
    };

    const output = {
      post: {
        "1": {
          id: 1,
          attributes: {
            text: "hello"
          },
          relationships: {
            comments: []
          }
        }
      }
    };

    const result = normalize(emptyJson);

    expect(isEqual(result, output)).to.be.true;
  });
});

describe('complex', () => {
    const json = {
      data: [{
        attributes: {
          yday: 228,
          text: "Какие качества Вы больше всего цените в женщинах?",
          slug: "tbd",
        },
        id: 29,
        relationships: {
          "post-blocks": {
            data: [{
              type: "post-block",
              id: 4601
            }, {
              type: "post-block",
              id: 2454
            }]
          }
        },
        type: "question"
      }],
      included: [{
        attributes: {},
        id: 4601,
        relationships: {
          user: {
            data: {
              type: "user",
              id: 1
            }
          },
          posts: {
            data: [{
              type: "post",
              id: 4969
            }, {
              type: "post",
              id: 1606
            }
          ]}
        },
        type: "post-block"
      }, {
        attributes: {},
        id: 2454,
        relationships: {
          user: {
            data: {
              type: "user",
              id: 1
            }
          },
          posts: {
            data: [{
              type: "post",
              id: 4969
            }, {
              type: "post",
              id: 1606
            }
          ]}
        },
        type: "post-block"
      }, {
        type: "user",
        attributes: {
          slug: "superyuri",
        },
        id: 1
      }, {
        type: "post",
        id: 1606,
        attributes: {
          text: 'hello1'
        }
      }, {
        type: "post",
        id: 4969,
        attributes: {
          text: 'hello2'
        }
      }]
    };

  const output = {
    question: {
      "29": {
        id: 29,
        attributes: {
          yday: 228,
          text: "Какие качества Вы больше всего цените в женщинах?",
          slug: "tbd",
        },
        relationships: {
          "post-blocks": [4601, 2454]
        }
      }
    },
    "post-block": {
      "2454": {
        id: 2454,
        attributes: {},
        relationships: {
          user: [1],
          posts: [4969, 1606]
        }
      },
      "4601": {
        id: 4601,
        attributes: {},
        relationships: {
          user: [1],
          posts: [4969, 1606]
        }
      }
    },
    "user": {
      "1": {
        id: 1,
        attributes: {
          slug: "superyuri"
        },
        relationships: {}
      }
    },
    "post": {
      "1606": {
        id: 1606,
        attributes: {
          text: 'hello1'
        },
        relationships: {}
      },
      "4969": {
        id: 4969,
        attributes: {
          text: 'hello2'
        },
        relationships: {}
      }
    }
  };

  const output2 = {
    question: {
      "29": {
        id: 29,
        attributes: {
          yday: 228,
          text: "Какие качества Вы больше всего цените в женщинах?",
          slug: "tbd",
        },
        relationships: {
          "postBlocks": [4601, 2454]
        }
      }
    },
    "postBlock": {
      "2454": {
        id: 2454,
        attributes: {},
        relationships: {
          user: [1],
          posts: [4969, 1606]
        }
      },
      "4601": {
        id: 4601,
        attributes: {},
        relationships: {
          user: [1],
          posts: [4969, 1606]
        }
      }
    },
    "user": {
      "1": {
        id: 1,
        attributes: {
          slug: "superyuri"
        },
        relationships: {}
      }
    },
    "post": {
      "1606": {
        id: 1606,
        attributes: {
          text: 'hello1'
        },
        relationships: {}
      },
      "4969": {
        id: 4969,
        attributes: {
          text: 'hello2'
        },
        relationships: {}
      }
    }
  };

  it('test data camelizeKeys: false', () => {
    const result = normalize(json, { camelizeKeys: false });

    expect(result).to.be.eql(output);
  });

  it('test data camelizeKeys: true', () => {
    const result = normalize(json, { camelizeKeys: true });

      expect(result).to.be.eql(output2);
  });

  const outputMeta = {
    '/post': {
      data: [{
        type: 'question',
        id: 29,
        relationships: {
          'post-blocks': [4601, 2454]
        }
      }]
    }
  };

  const outputMeta2 = {
    '/post': {
      data: [{
        type: 'question',
        id: 29,
        relationships: {
          'postBlocks': [4601, 2454]
        }
      }]
    }
  };

  it('test meta, camelizeKeys: false', () => {
    const result = normalize(json, { endpoint: '/post', camelizeKeys: false });

    expect(result.meta).to.be.eql(outputMeta);
  });

  it('test meta, camelizeKeys: true', () => {
    const result = normalize(json, { endpoint: '/post', camelizeKeys: true });

    expect(result.meta).to.be.eql(outputMeta2);
  });
});
