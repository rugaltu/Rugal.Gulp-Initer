class GulpIniterTool {
    constructor() {
        this.Folders = {};
        this.Gulp = require('gulp');
        this.Clean = require('rimraf').rimraf;
        this.IsUseClear = true;
        this.SourceRoot = 'node_modules';
        this.TargetRoot = 'wwwroot/npm';
    }

    WithSourceRoot(_RootPath) {
        this.SourceRoot = _RootPath;
        return this;
    }

    WithTargetRoot(_RootPath) {
        this.TargetRoot = _RootPath;
        return this;
    }

    UseClearTarget(IsEnable = true) {
        this.IsUseClear = IsEnable;
        return this;
    }

    _BaseAddConfig(SourcePath, TargetPath, Type) {
        TargetPath ??= SourcePath;

        SourcePath = this._TrimPath(SourcePath);
        TargetPath = this._TrimPath(TargetPath);

        this.Folders[TargetPath] = {
            Path: SourcePath,
            Type,
        };
    }

    AddFolder(SourcePath, TargetPath = null, Type = '*') {
        this._BaseAddConfig(SourcePath, TargetPath, Type);
        return this;
    }

    AddFolder_Js(SourcePath, TargetPath = null) {
        this._BaseAddConfig(SourcePath, TargetPath, '*.js');
        return this;
    }

    AddFolder_Css(SourcePath, TargetPath = null) {
        this._BaseAddConfig(SourcePath, TargetPath, '*.css');
        return this;
    }

    AddFolder_Ts(SourcePath, TargetPath = null) {
        this._BaseAddConfig(SourcePath, TargetPath, '*.ts');
        return this;
    }

    InitTask() {
        if (this.IsUseClear)
            this._NewClearTask();

        let TaskNames = Object.keys(this.Folders)
            .map(Target => {
                let Source = this.Folders[Target];
                return {
                    Target,
                    ...Source,
                };
            })
            .map(Item => {
                let TaskName = `copy-${Item.Path}`;
                this.Gulp.task(TaskName, done => {
                    let SourcePath = `${this.SourceRoot}/${Item.Path}/**/${Item.Type}`;
                    let TargetPath = `${this.TargetRoot}/${Item.Target}`;
                    this.Gulp
                        .src(SourcePath)
                        .pipe(this.Gulp.dest(TargetPath));
                    done();
                });
                return TaskName;
            });

        let RootTaskName = `copy-${this.TargetRoot}`;
        this.Gulp.task(RootTaskName, this.Gulp.parallel(TaskNames));
        return this;
    }

    //#region Private Process
    _NewClearTask() {
        let TaskName = `clean-${this.TargetRoot}`;
        this.Gulp.task(TaskName, async (done) => {
            await this.Clean(this.TargetRoot);
            done();
        });
        return this;
    }

    _TrimPath(Path) {
        let TrimPattern = /^[\/\\]+/;
        Path = Path.replace(TrimPattern, '');
        return Path;
    }
    //#endregion
}
const GulpIniter = new GulpIniterTool();

module.exports = GulpIniter;
