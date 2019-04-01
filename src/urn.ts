import type from "@tleef/type-js";

type Validator = string | RegExp | ((o: string) => boolean);
interface IValidatorMap {[key: string]: Validator; }
type Default = string | (() => string);
interface IDefaultMap {[key: string]: Default; }
type Arg = string | (() => string);
interface IArgs {[key: string]: Arg; }
interface IValues {[key: string]: string; }

export default class Urn {
  private readonly _names: string[];
  private readonly _defaults: IDefaultMap;
  private readonly _validators: IValidatorMap;

  constructor(names: string[], defaults: IDefaultMap = {}, validators: IValidatorMap = {}) {
    this._names = names;
    this._defaults = defaults;
    this._validators = validators;
  }

  get names() {
    return this._names;
  }

  get defaults() {
    return this._defaults;
  }

  get validators() {
    return this._validators;
  }

  public create(args: IArgs = {}): string {
    return this.names.map((name) => {
      let arg: Arg | Default | undefined;

      if (args.hasOwnProperty(name)) {
        arg = args[name];
      } else if (this.defaults.hasOwnProperty(name)) {
        arg = this.defaults[name];
      }

      if (type.isFunction(arg)) {
        arg = (arg as () => string)();
      }

      if (arg == null) {
        arg = "";
      }

      return arg;
    }).join(":");
  }

  public parse(s: string): IValues {
    if (!type.isString(s)) {
      throw new Error("urn must be a string");
    }

    const parts = s.split(":");

    if (this.names.length !== parts.length) {
      throw new Error("urn is wrong length");
    }

    return this.names.reduce((o: IValues, name, i) => {
      o[name] = parts[i];
      return o;
    }, {});
  }

  public validate(s: string): boolean {
    let values: IValues;

    try {
      values = this.parse(s);
    } catch (e) {
      return false;
    }

    let valid = true;

    for (const name in values) {
      if (!values.hasOwnProperty(name)) {
        continue;
      }

      const validator = this.validators[name];
      const value = values[name];

      if (type.isString(validator)) {
        valid = valid && (validator === value);
      } else if (type.isRegExp(validator)) {
        valid = valid && ((validator as RegExp).test(value));
      } else if (type.isFunction(validator)) {
        valid = valid && (validator as (o: string) => boolean)(value);
      }
    }

    return valid;
  }
}
