import type from '@tleef/type-js'

export default class Urn {
  constructor (names, defaults = {}, validators = {}) {
    this.names = names
    this.defaults = defaults
    this.validators = validators
  }

  create (args = {}) {
    return this.names.map((name) => {
      let arg

      if (args.hasOwnProperty(name)) {
        arg = args[name]
      } else if (this.defaults.hasOwnProperty(name)) {
        arg = this.defaults[name]
      }

      if (type.isFunction(arg)) {
        arg = arg()
      }

      if (arg == null) {
        arg = ''
      }

      return arg
    }).join(':')
  }

  parse (s) {
    if (!type.isString(s)) {
      throw new Error('urn must be a string')
    }

    const parts = s.split(':')

    if (this.names.length !== parts.length) {
      throw new Error('urn is wrong length')
    }

    return this.names.reduce((o, name, i) => {
      o[name] = parts[i]
      return o
    }, {})
  }

  validate (s) {
    let values

    try {
      values = this.parse(s)
    } catch (e) {
      return false
    }

    let valid = true

    for (const name in values) {
      const validator = this.validators[name]
      const value = values[name]

      if (type.isString(validator)) {
        valid &= validator === value
      } else if (type.isRegExp(validator)) {
        valid &= validator.test(value)
      } else if (type.isFunction(validator)) {
        valid &= validator(value)
      }
    }

    return !!valid
  }
}
