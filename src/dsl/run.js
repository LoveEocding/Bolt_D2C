

import prettier from 'prettier';
import dsl_vue from './vue.js';
import dsl_react from './react.js';

var result = {};

export default function (data, type) {
    switch (type) {
        case 'vue':
            result = dsl_vue(data);
            return result;
        case 'react':
            result = dsl_react(data);
            return result;
    }
}
