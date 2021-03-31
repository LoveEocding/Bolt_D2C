module.exports = function (plop) {
    //生成一个页面
    plop.setGenerator('class', {
        description: '生成一个页面包含less',
        prompts: [{
            type: 'input',
            name: 'name',
            message: '文件名称'
        }],
        actions: [{
            type: 'add',
            path: 'src/modules/{{name}}/index.jsx',
            templateFile: './plop-templates/class.hbs'
        }, {
            type: 'add',
            path: 'src/modules/{{name}}/index.module.scss',
            templateFile: './plop-templates/scss.hbs'
        }]
    });
    //生成一个class
    plop.setGenerator('module', {
        description: '生成一个页面包含less',
        prompts: [{
            type: 'input',
            name: 'name',
            message: '文件名称'
        }],
        actions: [{
            type: 'add',
            path: 'src/modules/{{name}}/index.jsx',
            templateFile: './plop-templates/jsx.hbs'
        }, {
            type: 'add',
            path: 'src/modules/{{name}}/index.module.scss',
            templateFile: './plop-templates/scss.hbs'
        }]
    });
    // 生成一个组件
    plop.setGenerator('components', {
        description: '生成一个组件包含less',
        prompts: [{
            type: 'input',
            name: 'parent',
            message: '父级名称'
        }, {
            type: 'input',
            name: 'name',
            message: '文件名称'
        }],
        actions: [{
            type: 'add',
            path: 'src/modules/{{ parent }}/components/{{name}}/index.jsx',
            templateFile: './plop-templates/jsx.hbs'
        }, {
            type: 'add',
            path: 'src/modules/{{ parent }}/components/{{name}}/index.module.scss',
            templateFile: './plop-templates/scss.hbs'
        }]
    });
};