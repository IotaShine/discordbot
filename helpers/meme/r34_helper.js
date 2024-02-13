const r34Helper = async (tags, limit) => {
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=${limit}&tags=${tags} -ai_generated`;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("Response was not ok");
        }

        const data = await respuesta.json();
        const post = await data;
        const rng = Math.round(Math.random() * post.length);
        const image = post[rng].file_url;
        return image;
    } catch (error) {
        console.log(error);
        return "Hubo un error";
    }
};

module.exports = r34Helper;
