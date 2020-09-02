/** 
 * @description jest server
 * @author LSKReno
 */

const request = require('supertest')

const server = require('../dist/app').callback()


module.exports = request(server)