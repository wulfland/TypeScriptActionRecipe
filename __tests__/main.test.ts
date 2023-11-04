/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance
let addHeadingMock: jest.SpyInstance
let addImageMock: jest.SpyInstance
let addTableMock: jest.SpyInstance
let addLinkMock: jest.SpyInstance
let writeMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    addHeadingMock = jest
      .spyOn(core.summary, 'addHeading')
      .mockImplementation(() => core.summary)
    addImageMock = jest
      .spyOn(core.summary, 'addImage')
      .mockImplementation(() => core.summary)
    addTableMock = jest
      .spyOn(core.summary, 'addTable')
      .mockImplementation(() => core.summary)
    addLinkMock = jest
      .spyOn(core.summary, 'addLink')
      .mockImplementation(() => core.summary)
    writeMock = jest.spyOn(core.summary, 'write').mockImplementation()
  })

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return '500'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Waiting 500 milliseconds ...')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(timeRegex)
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(timeRegex)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'time',
      expect.stringMatching(timeRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return 'this is not a number'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'milliseconds not a number'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('adds a heading', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return '500'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(addHeadingMock).toHaveBeenNthCalledWith(
      1,
      'Advanced Job Summary',
      'h2'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('adds an image', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return '500'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(addImageMock).toHaveBeenNthCalledWith(
      1,
      'https://octodex.github.com/images/yaktocat.png',
      'The Yaktocat',
      {
        width: '32',
        height: '32'
      }
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('adds a table', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return '500'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(addTableMock).toHaveBeenNthCalledWith(1, [
      [
        { data: 'File', header: true },
        { data: 'Result', header: true }
      ],
      ['foo.js', 'Pass ✅'],
      ['bar.js', 'Fail ❌'],
      ['test.js', 'Pass ✅']
    ])
    expect(errorMock).not.toHaveBeenCalled()
  })
  it('adds a link', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'milliseconds':
          return '500'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(addLinkMock).toHaveBeenNthCalledWith(
      1,
      'My custom link',
      'https://writeabout.net'
    )
    expect(errorMock).not.toHaveBeenCalled()
    expect(writeMock).toHaveBeenCalled()
  })
})
