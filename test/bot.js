var assert = require('chai').assert;
var Bot = require('../lib/bot').Bot;

describe('The Bot', function () {
    it('knows when a message is addressed to himself', function() {
        var bot = new Bot('lolz');
        assert.ok(bot.addressedToMe('lolz: welcome to the jungle'));
        assert.notOk(bot.addressedToMe('meh: not welcome to the jungle'));
    });
    it('knows how to identify a status message', function() {
        var bot = new Bot('meh');
        [
            'meh: today was a bad day #status',
            'meh: #status today was a bad day',
            'meh: writing #status reports is not fun'
            ].forEach(function(message) {
                assert.ok(bot.isStatusMessage(message));
            });
            assert.notOk(bot.isStatusMessage('meh: status today was a bad day'));
    });
    it('knows how to normalize a message', function() {
        var bot = new Bot('lulz');
        var result = bot.normalizeMessage('lulz: welcome to the jungle');
        assert.equal(result, 'welcome to the jungle');
    });
    it('knows how to identify factoid store requests', function(){
        var bot = new Bot('spongebob');
        assert.ok(bot.isFactoidStoreRequest('spongebob: cake is a lie'));
        assert.notOk(bot.isFactoidStoreRequest('spongebob: the cake is a truth'));
    });
    it('knows how to parse factoid store requests', function() {
        var bot = new Bot('rly');
        var result = bot.parseFactoidStoreRequest('rly: glwtd is good luck with that dude');
        assert.deepEqual(result, {key:'glwtd', value:'good luck with that dude'});
    });
    it('knows how to identify factoid removal requests', function(){
        var bot = new Bot('mnesia');
        assert.ok(bot.isFactoidRemovalRequest('mnesia: forget glwtd'));
        assert.notOk(bot.isFactoidRemovalRequest("mnesia: don't forget it, mmkay?"));
    });
    it('knows how to forget factoids', function() {
        var bot = new Bot('amnesia');
        var result = bot.parseFactoidRemovalRequest('amnesia: forget glwtd');
        assert.equal(result, 'glwtd');
    });
    it('knows how to identify factoid retrieval requests', function (){
        var bot = new Bot('elephant');
        assert.ok(bot.isFactoidRetrievalRequest('?glwtd'));
        assert.notOk(bot.isFactoidRetrievalRequest('? glwtd'));
    });
    it('knows how to identify best/worst karma request', function (){
        var bot = new Bot('karma');
        assert.notOk(bot.isKarmaBestRequest('karma worst'));
        assert.notOk(bot.isKarmaWorstRequest('karma best'));
        assert.ok(bot.isKarmaBestRequest('karma best'));
        assert.ok(bot.isKarmaWorstRequest('karma worst'));
    });
    it('knows how to parse factoid retrieval requests', function (){
        var bot = new Bot('elephant');
        var result = bot.parseFactoidRetrievalRequest('?glwtd');
        assert.equal(result, 'glwtd');
    });
    it('knows how to identify karma requests', function () {
        var bot = new Bot('mule');
        assert.ok(bot.isKarmaRequest('this was amazing, mule++', undefined, 'qmx'));
    });
    it('knows how to identify what is not a karma request', function () {
        var bot = new Bot('mule');
        assert.notOk(bot.isKarmaRequest('this was amazing'));
    });
    it('knows how to identify what is not a karma request', function () {
        var bot = new Bot('mule');
        assert.notOk(bot.isKarmaRequest('this was amazing', 'lance', 'qmx'));
    });
    it('avoids self-promoting karma requests', function () {
        var bot = new Bot('mule');
        assert.notOk(bot.isKarmaRequest('this was amazing, mule++', 'qmx', 'qmx'));
    });
    it('knows how to parse karma requests', function () {
        var bot = new Bot('platypus');
        assert.deepEqual(bot.parseKarmaRequest('mnesia++'), { user:'mnesia', direction:1 });
        assert.deepEqual(bot.parseKarmaRequest('buster--'), { user:'buster', direction:-1 });
    });
    it('knows how to identify factoid retrieval with mention requests', function (){
        var bot = new Bot('sunshine');
        assert.ok(bot.isFactoidRetrievalMentionRequest('?redbutton @ john'));
        [
        '?redbutton@ john',
        '?redbutton @john',
        '?redbutton@john',
        'redbutton@john',
        '? redbutton@john',
        '?redbutton  @john'
        ].forEach(function(message) {
            assert.notOk(bot.isFactoidRetrievalMentionRequest(message));
        });
    });
    it('knows how to parse mention on factoid requests', function() {
        var bot = new Bot('sunshine');
        var result1 = bot.parseFactoidMentionRequests('?redbutton @ john');
        assert.equal(result1.target, 'john');

        ['?redbutton @john', '?redbutton@john', '?redbutton@john',
            'redbutton@john', '? redbutton@john', '?redbutton  @john'].forEach(function(message) {
            assert.notOk(bot.parseFactoidMentionRequests(message));
        });
    });
    it('knows how to parse factoid on factoid requests', function() {
        var bot = new Bot('sunshine');

        var result = bot.parseFactoidMentionRequests('?redbutton @ john');
        assert.equal(result.factoid, '?redbutton');

        ['?redbutton @john', '?redbutton@john', '?redbutton@john',
            'redbutton@john', '? redbutton@john', '?redbutton  @john'].forEach(function(message) {
            assert.notOk(bot.parseFactoidMentionRequests(message));
        });
    });
});
