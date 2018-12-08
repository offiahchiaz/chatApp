const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate a correct message object', () => {
        let from = 'Jen';
        let text = 'Some text';
        let message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toBeTruthy();
    });
});