'use strict'

const semver = require('semver')
const { RouteVersionUnmatchedError } = require('./errors')

class versionRouter {
  static route (versionsMap = new Map(), options = new Map()) {
    return (req, res, next) => {
      for (let [versionKey, versionRouter] of versionsMap) {
        if (this.checkVersionMatch(req.version, versionKey)) {
          return versionRouter(req, res, next)
        }
      }

      const defaultRoute = this.getDefaultRoute(versionsMap)
      if (defaultRoute) {
        return defaultRoute(req, res, next)
      }

      return next(new RouteVersionUnmatchedError(`${req.version} doesn't match any versions`))
    }
  }

  static checkVersionMatch (requestedVersion, routeVersion) {
    return semver.valid(requestedVersion) && semver.satisfies(requestedVersion, routeVersion)
  }

  static getDefaultRoute (options = new Map()) {
    return options.get('default')
  }
}

module.exports = versionRouter
