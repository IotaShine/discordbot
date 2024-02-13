const modifyServer = async serverId => {
    const res = await fetch(
        `http://127.0.0.1:8090/api/collections/registeredServers/records?filter=(server='${serverId}')`,
    );

    if (res.status !== 200) return "Servidor no esta registrado";

    const { items } = await res.json();

    const activated = items[0].activated;

    const res2 = await fetch(
        `http://127.0.0.1:8090/api/collections/registeredServers/records/${items[0].id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ server: serverId, activated: !activated }),
        },
    );

    if (!res2.status === 200) {
        return `Ocurrió un error al ${activated ? "quitar" : "registrar"} el servidor`;
    }
};

module.exports = modifyServer;
