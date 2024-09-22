class GulpIniter {
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

    _BaseAddConfig(SourcePath, Option) {
        Option.TargetPath ??= SourcePath;
        Option.TargetPath = this._TrimPath(Option.TargetPath);
        SourcePath = this._TrimPath(SourcePath);
        this.Folders[SourcePath] = Option;
    }

    AddFolder(SourcePath, Option = {
        TargetPath: null,
        Type: '*',
    }) {
        this._BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Js(SourcePath, Option = {
        TargetPath: null,
        Type: '*.js',
    }) {
        this._BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Css(SourcePath, Option = {
        TargetPath: null,
        Type: '*.css',
    }) {
        this._BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Ts(SourcePath, Option = {
        TargetPath: null,
        Type: '*.ts',
    }) {
        this._BaseAddConfig(SourcePath, Option);
        return this;
    }

    InitTask() {
        if (this.IsUseClear)
            this._NewClearTask();

        let TaskNames = Object.keys(this.Folders)
            .map(SourcePath => {
                let Item = this.Folders[SourcePath];
                let TaskName = `copy-${SourcePath}`;
                this.Gulp.task(TaskName, done => {
                    let SourcePath = `${this.SourceRoot}/${SourcePath}/**/${Item.Type}`;
                    let TargetPath = `${this.TargetRoot}/${Item.TargetPath}`;
                    this.Gulp
                        .src(SourcePath, {
                            ...Item
                        })
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
const Initer = new GulpIniter();

module.exports = Initer;
