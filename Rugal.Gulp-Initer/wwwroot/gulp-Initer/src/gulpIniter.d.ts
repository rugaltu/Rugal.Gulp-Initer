import { SrcOptions } from 'vinyl-fs';
type TargetConfig = {
    target?: string;
    source?: string;
    option?: SrcOptions;
};
declare class GulpIniter {
    private folders;
    private deletes;
    private source;
    private target;
    private useClear;
    constructor();
    withSource(path: string): this;
    withTarget(path: string): this;
    useClearTarget(useClear?: boolean): this;
    add(path: string, config?: TargetConfig | string): this;
    addFolder(path: string, config?: TargetConfig | string): this;
    addJs(path: string, config?: TargetConfig | string): this;
    addCss(path: string, config?: TargetConfig | string): this;
    addTs(path: string, config?: TargetConfig | string): this;
    addDelete(path: string, pattern?: string): this;
    initTask(): this;
    private baseAddConfig;
    private clearStartPath;
    private clearEndPath;
    private combinePath;
}
declare const initer: GulpIniter;
export { initer, };
