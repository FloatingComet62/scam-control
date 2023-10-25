import { readFileSync } from 'fs'
import { Checker } from '../checker'
import { TOP_SAFE_SITES } from '../data'

function editDistance(str1: string, str2: string) {
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()

  let costs = []
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= str2.length; j++) {
      if (i == 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (str1.charAt(i - 1) != str2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) {
      costs[str2.length] = lastValue
    }
  }
  return costs[str2.length];
}

/**
 * https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
 */
export function similarity(str1: string, str2: string): number {
  let longer = str1
  let shorter = str2
  if (str1.length < str2.length) {
    longer = str2
    shorter = str1
  }
  let longerLength = longer.length
  if (longerLength == 0) {
    return 1
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength
}

export class TopSiteMangleChecker implements Checker {
  sites: string[]
  linkRegex: RegExp

  constructor() {
    this.sites = readFileSync(TOP_SAFE_SITES)
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
      for (const site of this.sites) {
        if (!this.sites.includes(link) && similarity(link, site) >= 0.7) {
          return true
        }
      }
      to_check = to_check.slice(link.length + (match.index || 0))
    }
  }
}