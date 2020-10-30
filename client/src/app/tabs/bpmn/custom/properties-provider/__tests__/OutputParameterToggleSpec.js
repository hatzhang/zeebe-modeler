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

import { triggerEvent } from './helper';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { getExtensionElements } from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import contextPadModule from 'bpmn-js/lib/features/context-pad';
import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import paletteModule from 'bpmn-js/lib/features/palette';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '..';
import selectionModule from 'diagram-js/lib/features/selection';
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

import customModelingModule from '../../modeling';
import customModules from '../..';

const HIDE_CLASS = 'bpp-hidden';


describe('customs - input output property tab - output parameter toggle propagateAllChildVariables', function() {

  const diagramXML = require('./InputOutput.bpmn');

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

  describe('availability', function() {


    it('should display for CallActivity', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_1');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggle = getPropagateAllChildVariablesToggle(container);

        expect(propagateAllChildVariablesToggle).to.exist;
        expect(propagateAllChildVariablesToggle.className).not.to.contain(HIDE_CLASS);
      }));


    it('should not display for ServiceTask', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggle = getPropagateAllChildVariablesToggle(container);

        expect(propagateAllChildVariablesToggle).to.not.exist;
      }));


  });

  describe('show state', function() {


    it('should display true when set to true', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_2');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

        expect(propagateAllChildVariablesToggleLabel).to.exist;
        expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('True');
      }));


    it('should display false when set to false', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_3');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

        expect(propagateAllChildVariablesToggleLabel).to.exist;
        expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('False');
      }));


    it('should display true when not set', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_4');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

        expect(propagateAllChildVariablesToggleLabel).to.exist;
        expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('True');
      }));


    it('should display false when not set but output mappings exist', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_5');

        // when
        selection.select(shape);

        // then
        const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

        expect(propagateAllChildVariablesToggleLabel).to.exist;
        expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('False');
      }));


  });

  describe('update state', function() {

    describe('toggle on', function() {

      let calledElement;

      beforeEach(inject(function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_3');
        calledElement = getCalledElement(shape);

        // when
        selection.select(shape);
        clickPropagateAllChildVariablesToggle(container);
      }));

      describe('in the DOM', function() {


        it('should execute', function() {

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('True');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('False');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('True');
        }));


      });

      describe('on the business object', function() {


        it('should execute', function() {

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(true);
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(false);
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(true);
        }));


      });

    });

    describe('toggle off', function() {

      let calledElement;

      beforeEach(inject(function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_2');
        calledElement = getCalledElement(shape);

        // when
        selection.select(shape);
        clickPropagateAllChildVariablesToggle(container);
      }));

      describe('in the DOM', function() {


        it('should execute', function() {

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('False');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('True');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const propagateAllChildVariablesToggleLabel = getPropagateAllChildVariablesToggleLabel(container);

          expect(propagateAllChildVariablesToggleLabel.innerHTML).to.equal('False');
        }));


      });

      describe('on the business object', function() {


        it('should execute', function() {

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(false);
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(true);
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(calledElement.propagateAllChildVariables).to.equal(false);
        }));


      });

    });

  });


});


// helper /////////

const getPropagateAllChildVariablesToggle = (container) => {
  return domQuery('#output-propagate-all-toggle', container);
};

const getPropagateAllChildVariablesToggleLabel = (container) => {
  return domQuery('.bpp-toggle-switch__label:not(.bpp-hidden)', container);
};

const clickPropagateAllChildVariablesToggle = (container) => {
  const toggle = getPropagateAllChildVariablesToggle(container);
  triggerEvent(toggle, 'click');
};

const getCalledElement = (element) => {
  const bo = getBusinessObject(element);
  const elements = getExtensionElements(bo, 'zeebe:CalledElement') || [];
  return elements[0];
};
