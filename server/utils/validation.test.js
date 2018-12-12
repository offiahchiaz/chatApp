const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        let str = 123;
        let message = isRealString(str);

        expect(message).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        let str = ' ';
        let message = isRealString(str);

        expect(message).toBeFalsy();
    });

    it('should allow string with non-space characters', () => {
        let str = ' wow ';
        let message = isRealString(str);

        expect(message).toBeTruthy();
    });
});