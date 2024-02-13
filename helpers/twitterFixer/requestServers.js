const requestServers = async serverId => {
    let activated = false;
    try {
        const res = await fetch(
            `http://127.0.0.1:8090/api/collections/registeredServers/records?filter=(server='${serverId}')&fields=activated`,
        );
        const { items } = await res.json();
        activated = items[0].activated;
    } catch (error) {
        activated = false;
    }

    return activated;
};

module.exports = { requestServers };
