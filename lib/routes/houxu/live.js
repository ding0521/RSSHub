const axios = require('../../utils/axios');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const { id, timeline } = ctx.params;
    const filter = timeline ? timeline : 'all';
    const baseUrl = `https://houxu.app/lives/${id}?filter=${filter}`;
    const res = await axios.get(baseUrl);
    const data = res.data;
    const $ = cheerio.load(data);

    const list = $('section.threads > div');
    const out = list
        .map((_, el) => {
            const each = $(el);
            return {
                title:
                    each
                        .find('a')
                        .first()
                        .text()
                        .trim() +
                    ' | ' +
                    each
                        .find('h3')
                        .text()
                        .trim(),
                description: each
                    .find('.summary')
                    .text()
                    .trim(),
                link: each
                    .find('a')
                    .first()
                    .attr('href'),
            };
        })
        .get();
    ctx.state.data = {
        title: $('.large-title').text(),
        description: $('title')
            .text()
            .trim(),
        link: baseUrl,
        item: out,
    };
};
