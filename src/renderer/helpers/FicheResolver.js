import fs from 'fs';
import Dir from '@/helpers/Dir'

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

        let file = Dir.getFichesRollDir() + '/' + name + '.json';

        if (fs.existsSync(file)) {
            let json = fs.readFileSync(file, 'utf-8');
            return JSON.parse(json);
        } else {
            return JSON.parse(JSON.stringify( FICHES[type][name] ));
        }
    }
}
