import { accountApi } from 'config/api';
import reducer, * as actions from '../';
import * as constants from '../constants';

describe('redux/modules/checkout/errorHandler', () => {
  describe('actions', () => {
    it('should create an action to reset all custom and page error messages', () => {
      expect(actions.resetAPIErrorMessages())
      .to.deep.equal({ type: constants.RESET_API_ERROR_MESSAGES });
    });
    it('should create an action to reset custom error messages', () => {
      expect(actions.resetAPICustomErrorMessages({ a: 'a catstrophic error' }))
      .to.deep.equal({
        type: constants.RESET_API_CUSTOM_ERROR_MESSAGES,
        specificCustomErrors: { a: 'a catstrophic error' },
      });
    });
    it('should create an action to reset all page error messages', () => {
      expect(actions.resetAPIPageErrorMessages())
      .to.deep.equal({ type: constants.RESET_API_PAGE_ERROR_MESSAGES });
    });
    it('should create an action to push an error message', () => {
      expect(actions.pushAPIErrorMessage('Catastrophic Failure', 'lethal'))
      .to.deep.equal({
        type: constants.PUSH_API_ERROR_MESSAGE,
        errorHandler: { message: 'Catastrophic Failure', customErrorKey: 'lethal' },
      });
    });
    it('should create an action to pop an error message', () => {
      expect(actions.popAPIErrorMessage('LOL1', 'no'))
      .to.deep.equal({
        type: constants.POP_API_ERROR_MESSAGE,
        errorHandler: { identifier: 'LOL1', isCustomErrorKey: 'no' },
      });
    });
    it('should create an action to push detailed error messages for a key', () => {
      expect(actions.pushDetailedErrorMessage(
        { a: 'a catstrophic error' },
        'lethalKey',
        { isEverythingISayIsALie: false }
      ))
      .to.deep.equal({
        type: constants.PUSH_DETAILED_ERROR_MESSAGE,
        errorHandler: {
          errorMessages: { a: 'a catstrophic error' },
          relatedKey: 'lethalKey',
          flags: { isEverythingISayIsALie: false },
        },
      });
    });
    it('should create an action to pop detailed error messages for a key and fieldName', () => {
      expect(actions.popDetailedErrorMessage(
        'lethalKey',
        '007'
      ))
      .to.deep.equal({
        type: constants.POP_DETAILED_ERROR_MESSAGE,
        errorHandler: {
          errorKey: 'lethalKey',
          fieldName: '007',
        },
      });
    });
    it('should create an action to reset defailed error messages for specific keys', () => {
      expect(actions.resetDetailedErrorMessages(['lethalKey', 'catastrophicKey']))
      .to.deep.equal({
        type: constants.RESET_DETAILED_ERROR_MESSAGES,
        errorHandler: {
          relatedKeys: ['lethalKey', 'catastrophicKey'],
        },
      });
    });
    it('should create an action to redirect to a specified location using redirectMiddleware', () => {
      expect(actions.errorRedirect('http://www.uniqlo.com', false, false))
      .to.deep.equal({
        type: constants.ERROR_REDIRECT,
        redirect: { location: 'http://www.uniqlo.com' },
        isReload: false,
        scrollUp: false,
      });
    });
    it('should create an action to reset \'isErrorRedirected\' flag in state', () => {
      expect(actions.resetErrorRedirectStatus())
      .to.deep.equal({ type: constants.RESET_ERROR_REDIRECT });
    });
    it('should create an action to fake a bluegate API error', () => {
      expect(actions.fakeBlueGateError('2001'))
      .to.deep.equal({
        type: constants.FAKE_BLUEGATE_ERROR,
        error: {
          resultCode: '2001',
          method: 'get',
          endpoint: `${accountApi.gdsHost}/${accountApi.region}${accountApi.gdsAccess}`,
        },
        errorHandler: {
          showMessage: true,
          enableReaction: true,
          canResolve: true,
          customErrorKey: 'blueGateCreditCardError',
          isBlueGateError: true,
        },
      });
    });
    it('should create an action to fake an error to trigger errorHandlerMiddleware', () => {
      const actionObj = actions.fakeError({
        error: 'Catastrophic Failure',
        errorHandler: { customErrorKey: 'lethalkey' },
      });

      expect(actionObj.client).to.be.an.instanceof(Function);
      expect(actionObj.client()).to.have.property('then');
      delete actionObj.client;
      expect(actionObj)
      .to.deep.equal({
        type: constants.FAKE_ERROR_RESPONSE,
        errorHandler: { customErrorKey: 'lethalkey', isFakeError: true },
        error: 'Catastrophic Failure',
      });
    });
  });
  describe('reducer', () => {
    const sampleMessage = 'Catastrophic Error';
    const sampleErrorKey = 'lethalKey';
    const anotherSampleErrorKey = 'anotherLethalKey';
    const sampleRelatedKey = 'kinKey';
    const anotherSampleRelatedKey = 'anotherKinKey';
    const sampleFieldName = 'greenField';
    const sampleFlags = { isGDSValidationError: false, isACPFValidationError: true };
    let currentState = constants.initialState;

    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal(constants.initialState);
    });
    it('should handle RESET_API_ERROR_MESSAGES', () => {
      expect(reducer(
        {
          ...currentState,
          customErrors: {
            ...currentState.customErrors,
            [sampleErrorKey]: sampleMessage,
            [anotherSampleErrorKey]: sampleMessage,
          },
          pageErrors: [sampleMessage, sampleMessage],
        },
        actions.resetAPIErrorMessages()
      )).to.deep.equal(constants.initialState);
    });
    it('should handle RESET_API_CUSTOM_ERROR_MESSAGES', () => {
      expect(reducer(
        {
          ...currentState,
          customErrors: {
            ...currentState.customErrors,
            [sampleErrorKey]: sampleMessage,
            [anotherSampleErrorKey]: sampleMessage,
          },
        },
        actions.resetAPICustomErrorMessages({ [sampleErrorKey]: sampleMessage })
      )).to.deep.equal({
        ...currentState,
        customErrors: {
          ...currentState.customErrors,
          [sampleErrorKey]: '',
          [anotherSampleErrorKey]: sampleMessage,
        },
      });
    });
    it('should handle RESET_API_PAGE_ERROR_MESSAGES', () => {
      expect(reducer(
        {
          ...currentState,
          pageErrors: [sampleMessage, sampleMessage, sampleMessage],
        },
        actions.resetAPIPageErrorMessages()
      )).to.deep.equal({
        ...currentState,
        pageErrors: [],
      });
    });
    it('should handle PUSH_API_ERROR_MESSAGE', () => {
      // customErrors
      let newState = {
        ...currentState,
        customErrors: {
          ...currentState.customErrors,
          [sampleErrorKey]: sampleMessage,
        },
      };

      expect(reducer(
        currentState,
        actions.pushAPIErrorMessage(sampleMessage, sampleErrorKey)
      )).to.deep.equal(newState);
      currentState = newState;

      // pageErrors
      newState = {
        ...currentState,
        pageErrors: [sampleMessage],
      };
      expect(reducer(
        currentState,
        actions.pushAPIErrorMessage(sampleMessage)
      )).to.deep.equal(newState);
      currentState = newState;
    });
    it('should handle POP_API_ERROR_MESSAGE', () => {
      // customErrors
      let newState = { ...currentState,
        customErrors: {
          ...currentState.customErrors,
        },
      };

      delete newState.customErrors[sampleErrorKey];
      expect(reducer(
        currentState,
        actions.popAPIErrorMessage(sampleErrorKey, true)
      )).to.deep.equal(newState);
      currentState = newState;

      // pageErrors
      newState = {
        ...currentState,
        pageErrors: [],
      };
      expect(reducer(
        currentState,
        actions.popAPIErrorMessage(0)
      )).to.deep.equal(newState);
      currentState = newState;
    });
    it('should handle PUSH_DETAILED_ERROR_MESSAGE', () => {
      expect(reducer(
        currentState,
        actions.pushDetailedErrorMessage(
          { [sampleFieldName]: sampleMessage },
          sampleRelatedKey,
          sampleFlags
        )
      )).to.deep.equal({
        ...currentState,
        ...sampleFlags,
        detailedErrors: {
          ...currentState.detailedErrors,
          [sampleRelatedKey]: { [sampleFieldName]: sampleMessage },
        },
      });
    });
    it('should handle POP_DETAILED_ERROR_MESSAGE', () => {
      expect(reducer(
        {
          ...currentState,
          detailedErrors: {
            ...currentState.detailedErrors,
            [sampleRelatedKey]: { [sampleFieldName]: sampleMessage },
            [anotherSampleRelatedKey]: { [sampleFieldName]: sampleMessage },
          },
        },
        actions.popDetailedErrorMessage(
          sampleRelatedKey,
          sampleFieldName
        )
      )).to.deep.equal({
        ...currentState,
        detailedErrors: {
          ...currentState.detailedErrors,
          [sampleRelatedKey]: { [sampleFieldName]: '' },
          [anotherSampleRelatedKey]: { [sampleFieldName]: sampleMessage },
        },
      });
    });
    it('should handle RESET_DETAILED_ERROR_MESSAGES', () => {
      expect(reducer(
        {
          ...currentState,
          isACPFValidationError: true,
          isGDSValidationError: true,
          detailedErrors: {
            ...currentState.detailedErrors,
            [sampleRelatedKey]: { [sampleFieldName]: sampleMessage },
            [anotherSampleRelatedKey]: { [sampleFieldName]: sampleMessage },
          },
        },
        actions.resetDetailedErrorMessages([sampleRelatedKey])
      )).to.deep.equal({
        ...currentState,
        isACPFValidationError: false,
        isGDSValidationError: false,
        detailedErrors: {
          ...currentState.detailedErrors,
          [sampleRelatedKey]: {},
          [anotherSampleRelatedKey]: { [sampleFieldName]: sampleMessage },
        },
      });
    });
    it('should handle ERROR_REDIRECT', () => {
      const isReload = false;

      expect(reducer(
        currentState,
        actions.errorRedirect('http://www.uniqlo.com', isReload)
      )).to.deep.equal({
        ...currentState,
        isErrorRedirected: !isReload,
      });
    });
    it('should handle RESET_ERROR_REDIRECT', () => {
      expect(reducer(
        {
          ...currentState,
          isErrorRedirected: true,
        },
        actions.resetErrorRedirectStatus()
      )).to.deep.equal({
        ...currentState,
        isErrorRedirected: false,
      });
    });
    it('should handle RESET_INVENTORY_ERROR', () => {
      expect(reducer(
        { ...currentState, inventoryError: [{ [sampleRelatedKey]: sampleMessage }] },
        actions.resetAPIErrorMessages()
      )).to.deep.equal({ ...currentState, inventoryError: [] });
    });
  });
});
