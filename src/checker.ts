export interface Checker {
  test(to_check: string): boolean
}

export class CheckApplyer {
  checkers: Checker[]

  constructor() {
    this.checkers = []
  }

  addChecker(checker: Checker) {
    this.checkers.push(checker)
    return this
  }

  apply(to_check: string): boolean {
    for (const checker of this.checkers) {
      if (checker.test(to_check)) {
        return true
      }
    }
    return false
  }
}