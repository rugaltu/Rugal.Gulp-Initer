import { src, task, dest, parallel } from 'gulp';
import { SrcOptions } from 'vinyl-fs';
import { deleteAsync } from 'del';

type TargetConfig = {
    target?: string,
    source?: string,
    option?: SrcOptions,
};
class GulpIniter {
    private folders: TargetConfig[] = [];
    private deletes: string[] = [];
    private source: string = 'node_modules';
    private target: string = 'wwwroot/npm';
    private useClear: boolean = true;
    constructor() { }

    withSource(path: string) {
        this.source = path;
        return this;
    }
    withTarget(path: string) {
        this.target = path;
        return this;
    }
    useClearTarget(useClear = true) {
        this.useClear = useClear;
        return this;
    }

    add(path: string, config?: TargetConfig | string) {
        this.baseAddConfig(path, null, config);
        return this;
    }
    addFolder(path: string, config?: TargetConfig | string) {
        this.baseAddConfig(path, '**/*', config);
        return this;
    }

    addJs(path: string, config?: TargetConfig | string) {
        this.baseAddConfig(path, '**/*.js', config);
        return this;
    }
    addCss(path: string, config?: TargetConfig | string) {
        this.baseAddConfig(path, '**/*.css', config);
        return this;
    }
    addTs(path: string, config?: TargetConfig | string) {
        this.baseAddConfig(path, '**/*.ts', config);
        return this;
    }
    addDelete(path: string, pattern?: string) {
        const deletePath = this.combinePath(path, pattern);
        this.deletes.push(deletePath);
        return this;
    }

    initTask() {
        if (this.useClear) {
            const taskName = `clear-${this.target}`;
            task(taskName, async () => {
                await deleteAsync(this.target);
            });
        }

        let deleteCount = 0;
        for (let item of this.deletes) {
            const fullPath = this.combinePath(this.target, item);
            task(`delete[${deleteCount}]-${item}`, async () => {
                await deleteAsync(fullPath);
            });
            deleteCount++;
        }

        const taskNames: string[] = [];
        let taskIndex = 0;
        for (let config of this.folders) {
            const taskName = `copy[${taskIndex}]-${config.target}`;
            task(taskName, () => {
                const sourcePath = this.combinePath(this.source, config.source);
                const targetPath = this.combinePath(this.target, config.target);
                return src(sourcePath, {
                    allowEmpty: true,
                    ...config.option,
                }).pipe(dest(targetPath));
            });
            taskNames.push(taskName);
            taskIndex++;
        }
        if (taskNames.length > 0) {
            const targetTaskName = `copy-${this.target}`;
            task(targetTaskName, parallel(taskNames));
        }
        return this;
    }

    //#region private process
    private baseAddConfig(path: string, pattern: string, config: TargetConfig | string) {

        const paths = path
            .split('/')
            .map(path => {
                if (/[*?{}]/.test(path))
                    return null;
                return path;
            });

        const defaultTarget = this.combinePath(...paths);
        if (typeof config === 'string') {
            config = {
                target: config,
            };
        }
        config ??= {};
        config.source = this.combinePath(path, pattern);
        config.target ??= defaultTarget;
        config.option ??= {};
        this.folders.push(config);
    }
    private clearStartPath(path: string) {
        return path.replace(/^[\/\\]+/, '');
    }
    private clearEndPath(path: string) {
        return path.replace(/[/\\]+$/, '');
    }
    private combinePath(...paths: string[]) {
        const newPaths = paths
            .filter(item => item != null && item != '')
            .map(path => {
                path = this.clearStartPath(path);
                path = this.clearEndPath(path);
                return path;
            });
        const path = newPaths.join('/');
        return path;
    }
    //#endregion
}
const initer = new GulpIniter();
export {
    initer,
}