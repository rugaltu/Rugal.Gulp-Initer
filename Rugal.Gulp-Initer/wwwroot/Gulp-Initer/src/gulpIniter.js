
const gulp = require('gulp');
const { rimraf } = require('rimraf');
class GulpIniter {
    Folders = {};
    IsUseClear = true;
    SourceRoot = 'node_modules';
    TargetRoot = 'wwwroot/npm'
    constructor() {

    }

    WithSourceRoot(RootPath) {
        this.SourceRoot = RootPath;
        return this;
    }

    WithTargetRoot(RootPath) {
        this.TargetRoot = RootPath;
        return this;
    }

    UseClearTarget(IsEnable = true) {
        this.IsUseClear = IsEnable;
        return this;
    }

    $BaseAddConfig(SourcePath, Option) {
        Option.TargetPath ??= SourcePath;
        Option.TargetPath = this.$TrimPath(Option.TargetPath);
        Option.Type ??= '*';
        SourcePath = this.$TrimPath(SourcePath);
        this.Folders[SourcePath] = Option;
    }

    AddFolder(SourcePath, Option = {
        TargetPath: null,
        Type: '*',
    }) {
        this.$BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Js(SourcePath, Option = {
        TargetPath: null,
        Type: '*.js',
    }) {
        this.$BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Css(SourcePath, Option = {
        TargetPath: null,
        Type: '*.css',
    }) {
        this.$BaseAddConfig(SourcePath, Option);
        return this;
    }

    AddFolder_Ts(SourcePath, Option = {
        TargetPath: null,
        Type: '*.ts',
    }) {
        this.$BaseAddConfig(SourcePath, Option);
        return this;
    }

    InitTask() {
        if (this.IsUseClear)
            this.$NewClearTask();

        let TaskNames = Object.keys(this.Folders)
            .map(SourcePath => {
                let Item = this.Folders[SourcePath];
                let TaskName = `copy-${SourcePath}`;
                gulp.task(TaskName, done => {
                    let RootSourcePath = `${this.SourceRoot}/${SourcePath}/**/${Item.Type}`;
                    let RootTargetPath = `${this.TargetRoot}/${Item.TargetPath}`;
                    gulp.src(RootSourcePath, {
                        ...Item
                    }).pipe(gulp.dest(RootTargetPath));
                    done();
                });
                return TaskName;
            });

        let RootTaskName = `copy-${this.TargetRoot}`;
        gulp.task(RootTaskName, gulp.parallel(TaskNames));
        return this;
    }

    //#region Private Process
    $NewClearTask() {
        let TaskName = `clean-${this.TargetRoot}`;
        gulp.task(TaskName, async (done) => {
            await rimraf(this.TargetRoot);
            done();
        });
        return this;
    }

    $TrimPath(Path) {
        let TrimPattern = /^[\/\\]+/;
        Path = Path.replace(TrimPattern, '');
        return Path;
    }
    //#endregion
}
const Initer = new GulpIniter();
module.exports = Initer;
