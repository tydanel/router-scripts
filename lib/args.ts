class ArgList {
    private readonly cached: Map<string, string | boolean>;
    private readonly raw: string[];

    public getRaw() {
        return this.raw;
    }

    constructor(args: string[]) {
        this.raw = args.slice();
        this.cached = new Map();
    }

    public getAction() : string | null {
        if (this.cached.has('action')) {
            const value = this.cached.get('action');
            if (typeof value === "string") {
                return value;
            } else {
                return null;
            }
        }
        
        const value = this.raw[0] || null;
        if ( !value ) {
            return null;
        }
        this.cached.set('action', value);
        this.raw.splice(0, 1);
        return value;
    }
    public hasFlag(name: string): boolean {
        return this.getFlag(name) !== null;
    }

    public getFlag(name: string): boolean {
        if (this.cached.has(name)) {
        return this.cached.get(name) === true;
        }

        const fullName = `--${name}`;
        for (let idx = 0; idx < this.raw.length; idx++) {
        if (this.raw[idx] === fullName) {
            this.cached.set(name, true);
            this.raw.splice(idx, 1);
            return true;
        }
        }
        this.cached.set(name, false);
        return false;
    }

    public hasOpt(name: string): boolean {
        return this.getOpt(name) !== null;
    }

    public getOpt(name: string): string | null {
        if (this.cached.has(name)) {
            const value = this.cached.get(name);
            if (typeof value === "string") {
                return value;
            } else {
                return null;
            }
        }

        const fullName = `--${name}=`;
        for (let idx = 0; idx < this.raw.length; idx++) {
            if (this.raw[idx].startsWith(fullName)) {
                const value = this.raw[idx].substring(fullName.length);
                this.cached.set(name, value);
                this.raw.splice(idx, 1);
                return value;
            }
        }

        return null;
    }
}

export default new ArgList(process.argv.slice(2));;