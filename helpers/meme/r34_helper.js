const limit = 500;
const r34Helper = async (tags) => {
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=${limit}&tags=${tags} -ai_generated`;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const post = data;
                const rng = Math.round(Math.random() * post.length);
                const image = post[rng].file_url;
                resolve(image);
            })
            .catch((error) => {
                console.log(error);
                reject("Hubo un error");
            });
    });
};

module.exports = r34Helper;
