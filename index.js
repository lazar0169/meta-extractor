const boom = require('boom');
const got = require('got');
const fastify = require('fastify')({
    "logger": {
        "prettyPrint": {
            "colorize": true
        }
    },
    "trustProxy": true,
    "bodyLimit": 20971520,
    "ignoreTrailingSlash": true
});
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
  ])

const metaHandler = async (req, reply) => {
    try {
        const targetUrl = req.body.url;
        const { body: html, url } = await got(targetUrl);
        const metadata = await metascraper({ html, url });
        return reply.code(200).send({ Message: 'Success', data: { metadata } });
    } catch (err) {
        throw boom.boomify(err);
    }
}

fastify.route({
    method: 'POST',
    url: '/',
    handler: metaHandler,
});

const start = async () => {
    try {
        await fastify.listen(3000);

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();