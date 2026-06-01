import { initer } from './wwwroot/gulp-Initer/src/gulpIniter.js';

initer.addDelete('vue')
    .addFolder('gulp')
    .addTs('vue/dist')
    .addCss('bootstrap/dist', {
        option: {
            encoding: false,
        },
    })
    .addJs('bootstrap/dist', {})
    .add('@fortawesome/**/*.{js,css}')
    .initTask();
