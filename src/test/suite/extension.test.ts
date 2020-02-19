import * as assert from 'assert';
import * as vscode from 'vscode';

import { camelCase } from '../../utils';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });

    test('camelCase user input', () => {
        assert.equal(camelCase('foo buzz'), 'fooBuzz');
        assert.equal(camelCase('fooBuzz'), 'fooBuzz');
        assert.equal(
            camelCase('Text is 123 test TTextF̸̡̢͓̳̜̪̟̳̠̻̖͐̂̍̅̔̂͋͂͐l̸̢̹̣̤̙͚̱͓̖̹̻̣͇͗͂̃̈͝a̸̢̡̬͕͕̰̖͍̮̪̬̍̏̎̕͘ͅv̸̢̛̠̟̄̿i̵̮͌̑ǫ̶̖͓͎̝͈̰̹̫͚͓̠̜̓̈́̇̆̑͜ͅ123test !!12 --!~@#$%%^&*( (test)'),
            'textIs123TestTTextFLAvIo123test12test',
        );
        assert.equal(camelCase('foo       buzz'), 'fooBuzz');
        assert.equal(camelCase('LABAS'), 'lABAS');
    });
});
