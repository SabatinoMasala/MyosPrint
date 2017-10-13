let FICHES = {
    classic: {
        c: require('@/printers/classic/c.json'),
        b: require('@/printers/classic/b.json'),
    },
    roll: {
        b: require('@/printers/roll/b.json'),
        c: require('@/printers/roll/c.json'),
        neck: require('@/printers/roll/neck.json'),
        mini_a: require('@/printers/roll/mini_a.json'),
        mini_b: require('@/printers/roll/mini_b.json'),
    }
};

export default {
    getFiche(type, name) {
        // TODO check if file exists
        return FICHES[type][name];
    }
}
