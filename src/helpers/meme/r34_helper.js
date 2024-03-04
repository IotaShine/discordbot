const logger = require("../config/logger");

const limit = 500;
/** Fetches a random image from rule34 api
 * @param {string} tags
 */
const r34Helper = async (tags) => {
    tags = tags.trim().replace(/ /g, "_");
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=${limit}&tags=${tags} -ai_generated`;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Response was not ok");

                return response.json();
            })
            .then((data) => {
                const post = data;
                const rng = Math.round(Math.random() * post.length);
                const image = post[rng].file_url;
                resolve(image);
            })
            .catch((error) => {
                logger.error(error, "Error fetching r34 image");
                reject("Hubo un error");
            });
    });
};

module.exports = r34Helper;
