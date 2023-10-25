import { readFileSync } from 'fs'
import { Checker } from '../checker'
import { MALICIOUS_SITE_DATABASE } from '../data'

export class MaliciousSiteChecker implements Checker {
  sites: string[]
  linkRegex: RegExp

  constructor() {
    this.sites = readFileSync(MALICIOUS_SITE_DATABASE)
      .toString()
      .split('\n')
      .map((value) => value.trim())
    this.linkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  }

  test(to_check: string): boolean {
    while (true) {
      const match = to_check.match(this.linkRegex)
      if (!match) {
        return false
      }

      const link = match[0]
      if (this.sites.includes(link)) {
        return true
      }
      to_check = to_check.slice(link.length + (match.index || 0))
    }
  }
}