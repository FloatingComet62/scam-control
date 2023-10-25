import exp from 'constants'
import { Checker, CheckApplyer } from '../src/checker'
import { MaliciousSiteChecker, TopSiteMangleChecker } from '../src/links'

describe('MaliciousSiteChecker', () => {
  let checker: Checker
  beforeAll(() => {
    checker = new MaliciousSiteChecker()
  })

  test('Finding a malicious site', () => {
    const maliciousSiteEntityMessage = 'Shop new shoes at 95% off on shoepublic.com!'
    expect(checker.test(maliciousSiteEntityMessage)).toBeTruthy()
  })
  test('Not flagging safe websites', () => {
    const safeWebsiteMessage = `
Upgrade to Fireship PRO at https://fireship.io/pro
Use code lORhwXd2 for 25% off your first payment. 
    `
    expect(checker.test(safeWebsiteMessage)).toBeFalsy()
  })
})

describe('TopSiteMangleChecker', () => {
  let checker: Checker
  beforeAll(() => {
    checker = new TopSiteMangleChecker()
  })

  test('Testing fake site', () => {
    const maliciousSiteEntityMessage = 'Get free nitro on dlscord.com'
    expect(checker.test(maliciousSiteEntityMessage)).toBeTruthy()
  })

  test('Testing official site', () => {
    const safeWebsiteMessages = [
      'Halloween sale on discord nitro, head over to discord.com',
      'Discord also has another site, discordapp.com'
    ]
    for (const safeWebsiteMessage of safeWebsiteMessages) {
      expect(checker.test(safeWebsiteMessage)).toBeFalsy()
    }
  })
})

describe('Integration testing', () => {
  let checker: CheckApplyer
  beforeAll(() => {
    checker = new CheckApplyer()
      .addChecker(new MaliciousSiteChecker())
      .addChecker(new TopSiteMangleChecker())
  })

  test('dlscordnitros.com', () => {
    const maliciousSiteEntityMessage = 'Get free nitro on dlscordnitros.com'
    expect(checker.apply(maliciousSiteEntityMessage)).toBeTruthy()
  })

  test('steamfree.com', () => {
    const maliciousSiteEntityMessage = 'Get free games on steamfree.com'
    expect(checker.apply(maliciousSiteEntityMessage)).toBeTruthy()
  })

  test('youtube.com', () => {
    const safeWebsiteMessage = 'Buy Youtube Premium on https://www.youtube.com/premium'
    expect(checker.apply(safeWebsiteMessage)).toBeFalsy()
  })
})