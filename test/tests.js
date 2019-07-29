const expect = require('chai').expect;
const syncRequest = require('sync-request');

function request(method, url, config = {})
{
    return syncRequest('GET', url, config);
}

describe('GET USER FUNCTION', () => 
{
    const url = 'http://localhost:5000/api/users/';

    it('should with the correct credentials, return correct user document', () => 
    {
        const config = {
            headers: {
                Authorization: "Basic am9obkBzbWl0aC5jb206cGFzc3dvcmQ="
            }
        }
        const actual = JSON.parse(request('GET', url, config).getBody('utf-8')).fullName;

        expect(actual).to.deep.equal('John Smith');
    });

    it('should with the incorrect credentials, return a 401 error', () => 
    {
        const actual = request('GET', url).statusCode;

        expect(actual).to.equal(401);
    });
});