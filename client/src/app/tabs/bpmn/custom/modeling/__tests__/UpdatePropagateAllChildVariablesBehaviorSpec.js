/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  bootstrapModeler,
  inject
} from 'bpmn-js/test/helper';

import { triggerEvent } from '../../properties-provider/__tests__/helper';

import {
  getOutputParameters,
  getInputOutput
} from '../../properties-provider/helper/InputOutputHelper';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import contextPadModule from 'bpmn-js/lib/features/context-pad';
import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import paletteModule from 'bpmn-js/lib/features/palette';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '../../properties-provider';
import selectionModule from 'diagram-js/lib/features/selection';
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

import customModelingModule from '..';
import customModules from '../../';


describe('features/modeling/behavior - update propagateAllChildVariables attribute on call activities', function() {

  const diagramXML = require('./process-call-activities.bpmn');

  const testModules = [
    contextPadModule,
    coreModule,
    modelingModule,
    paletteModule,
    propertiesPanelModule,
    propertiesProviderModule,
    selectionModule,
    customModelingModule,
    customModules
  ];

  const moddleExtensions = {
    zeebe: zeebeModdleExtensions
  };

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules,
    moddleExtensions
  }));

  beforeEach(inject(function(commandStack, propertiesPanel) {
    propertiesPanel.attachTo(container);
  }));


  describe('remove outputParameters', function() {

    describe('when toggling on with outputParameters and inputParameters', function() {

      let shape;

      describe('parameter explicitly set', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_3');

          // when
          selection.select(shape);
          clickPropagateAllChildVariablesToggle(container);
        }));


        it('should execute', inject(function() {

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters.length).to.equal(0);
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters).to.exist;
          expect(outputParameters.length).to.equal(1);
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters.length).to.equal(0);
        }));


      });

      describe('parameter not explicitly set (legacy callActivity)', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_4');

          // when
          selection.select(shape);
          clickPropagateAllChildVariablesToggle(container);
        }));


        it('should execute', inject(function() {

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters.length).to.equal(0);
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters).to.exist;
          expect(outputParameters.length).to.equal(1);
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters.length).to.equal(0);
        }));


      });

    });

  });

  describe('remove iOMapping', function() {

    describe('when toggling on with outputParameters', function() {

      let shape;

      describe('parameter explicitly set', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_5');

          // when
          selection.select(shape);
          clickPropagateAllChildVariablesToggle(container);
        }));


        it('should execute', inject(function() {

          // then
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters).to.exist;
          expect(outputParameters.length).to.equal(1);

          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.exist;
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


      });

      describe('parameter not explicitly set (legacy callActivity)', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_6');

          // when
          selection.select(shape);
          clickPropagateAllChildVariablesToggle(container);
        }));


        it('should execute', inject(function() {

          // then
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const outputParameters = getOutputParameters(shape);
          expect(outputParameters).to.exist;
          expect(outputParameters.length).to.equal(1);

          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.exist;
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


      });

    });


  });

  describe('set propagateAllChildVariables to false', function() {

    describe('when adding output parameters', function() {

      let shape;

      describe('parameter explicitly set', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_7');

          // assume
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;

          // when
          selection.select(shape);
          clickAddOutputParameterButton(container);
        }));


        it('should execute', inject(function() {

          // then
          const outputParameter = getOutputParameters(shape);
          expect(outputParameter).to.exist;
          expect(outputParameter.length).to.equal(1);
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // assume
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const outputParameter = getOutputParameters(shape);
          expect(outputParameter).to.exist;
          expect(outputParameter.length).to.equal(1);
        }));


      });

      describe('parameter not explicitly set (legacy callActivity)', function() {

        beforeEach(inject(function(selection, elementRegistry) {

          // given
          shape = elementRegistry.get('CallActivity_8');

          // assume
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;

          // when
          selection.select(shape);
          clickAddOutputParameterButton(container);
        }));


        it('should execute', inject(function() {

          // then
          const outputParameter = getOutputParameters(shape);
          expect(outputParameter).to.exist;
          expect(outputParameter.length).to.equal(1);
        }));


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // assume
          const inputOutput = getInputOutput(shape);
          expect(inputOutput).to.not.exist;
        }));


        it('should undo/redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const outputParameter = getOutputParameters(shape);
          expect(outputParameter).to.exist;
          expect(outputParameter.length).to.equal(1);
        }));


      });

    });


  });

});


// helper /////////

const getPropagateAllChildVariablesToggle = (container) => {
  return domQuery('#output-propagate-all-toggle', container);
};

const clickPropagateAllChildVariablesToggle = (container) => {
  const toggle = getPropagateAllChildVariablesToggle(container);
  triggerEvent(toggle, 'click');
};

const getAddButton = (container) => {
  return domQuery('button[data-action="createElement"].bpp-input-output__add', container);
};

const getAddOutputParameterButton = (container) => {
  return getAddButton(getOutputParameterGroup(container));
};

const clickAddOutputParameterButton = (container) => {
  const addButton = getAddOutputParameterButton(container);
  triggerEvent(addButton, 'click');
};

const getInputOutputTab = (container) => {
  return domQuery('div[data-tab="input-output"]', container);
};

const getParameterGroup = (type, container) => {
  return domQuery(`div[data-group="${type}"]`, getInputOutputTab(container));
};

const getOutputParameterGroup = (container) => {
  return getParameterGroup('output', container);
};
