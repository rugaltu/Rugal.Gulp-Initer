# Gulp-Initer
## Based on gulp <br> Easy to use gulp for copy/clear npm folders/files
### How to use:

* Install Gulp-Initer from npm
* Create gulpfile.js 
* Include gulp-initer in your gulpfile.js
```js
const Initer = require('@rugal.tu/gulp-initer');
```

---

### Methods:

* #### `WithSourceRoot()`
* #### `WithTargetRoot()`

Set foloder source/target path, if not set the default root directory is used <br>
Default source/target root path is ```node_modules``` and ```wwwroot/npm```

```js
Initer
    .WithSourceRoot('node_modules')
    .WithTargetRoot('wwwroot/npm');
```

---

* #### `UseClearTarget()`

Enable/Disable clear task, if not set the default is enable ```true```

```js
Initer
    .UseClearTarget(true);
```

---

Add the folder/file that needs to be copied to the settings
You can use these to filter .js .ts .css files:
* #### `AddFolder_Js()`
* #### `AddFolder_Ts()`
* #### `AddFolder_Css()`

```js
Initer
    .AddFolder_Js('vue/dist')        //copy .js files from 'vue/dist' to 'vue/dist'
    .AddFolder_Ts('vue/dist', 'vue') //copy .ts files from 'vue/dist' to 'vue'
    .AddFolder_Css('bootstrap/dist');
```

You can also use ```AddFolder()``` to customize the file types to filter:
* #### `AddFolder()`
```js
Initer
    .AddFolder('bootstrap/dist', null, '*.+(js|css)') // copy .js .css files from 'bootstrap/dist' to 'bootstrap/dist'
    .AddFolder('vue/dist', 'vue', '*.+(js|ts)');      // copy .js .ts files from 'vue/dist' to 'vue'
```

---

* ### `InitTask()`
After completing the folder settings, just call `InitTask()` to create the task and set the task triggering time in `Task Explorer`
```js
Initer
    .AddFolder('vue/dist')
    .InitTask();
```
