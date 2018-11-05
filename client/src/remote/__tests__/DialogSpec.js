import Dialog from '../Dialog';

import { Backend } from '../../app/__tests__/mocks';

describe('dialog', function() {

  it('#showOpenFilesDialog', function() {

    // given
    const sendSpy = (type, opts) => {

      // then
      expect(type).to.equal('dialog:open-files');

      expect(opts).to.eql(options);
    };

    const backend = new Backend({ send: sendSpy });
    const dialog = new Dialog(backend);

    const options = {
      defaultPath: 'foo',
      filter: {
        extensions: [ 'foo' ],
        name: 'foo'
      },
      title: 'Foo'
    };

    // when
    dialog.showOpenFilesDialog(options);
  });


  it('#show', function() {

    // given
    const sendSpy = (type, opts) => {

      // then
      expect(type).to.equal('dialog:show');

      expect(opts).to.eql(options);
    };

    const backend = new Backend({ send: sendSpy });
    const dialog = new Dialog(backend);

    const options = {
      type: 'info',
      title: 'Foo',
      message: 'Foo!',
      buttons: [
        { id: 'foo', label: 'Foo' }
      ]
    };

    // when
    dialog.show(options);
  });


  it('#showOpenFileErrorDialog', function() {

    // given
    const sendSpy = (type, opts) => {

      // then
      expect(type).to.equal('dialog:show');

      expect(opts).to.eql({
        type: 'error',
        title: 'Unrecognized file format',
        buttons: [
          { id: 'cancel', label: 'Close' }
        ],
        message: 'The file "foo" is not a foo, bar or baz file.'
      });
    };

    const backend = new Backend({ send: sendSpy });
    const dialog = new Dialog(backend);

    const options = {
      file: {
        name: 'foo'
      },
      types: [ 'foo', 'bar', 'baz' ]
    };

    // when
    dialog.showOpenFileErrorDialog(options);
  });


  it('#showEmptyFileDialog', function() {

    // given
    const sendSpy = (type, opts) => {

      // then
      expect(type).to.equal('dialog:show');

      expect(opts).to.eql({
        type: 'info',
        title: 'Empty FOO file',
        buttons: [
          { id: 'cancel', label: 'Cancel' },
          { id: 'create', label: 'Create' }
        ],
        message: 'The file "foo" is empty.\nWould you like to create a new FOO diagram?'
      });
    };

    const backend = new Backend({ send: sendSpy });
    const dialog = new Dialog(backend);

    const options = {
      file: {
        name: 'foo'
      },
      type: 'foo'
    };

    // when
    dialog.showEmptyFileDialog(options);
  });

});