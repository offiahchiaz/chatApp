const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate a correct message object', () => {
        let from = 'Jen';
        let text = 'Some text';
        let message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toBeTruthy();
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let from = 'Woulda';
        let latitude = 234;
        let longitude = 756;
        let url = `https://www.google.com/maps?q=234,756`
        let message = generateLocationMessage(from, latitude, longitude);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toBeTruthy();
    });
});